import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { requireAuthenticated } from "@/lib/auth/requirePermission";
import crypto from "crypto";
import AdmZip from "adm-zip";
import { EJSON } from "bson";

function getEncryptionKey() {
  const keyHex = process.env.BACKUP_ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("BACKUP_ENCRYPTION_KEY is not configured.");
  }
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) {
    throw new Error("BACKUP_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
  }
  return key;
}

export const POST = requireAuthenticated(async (req, context) => {
  const admin = context.admin;

  if (admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden: Only the Owner can perform Restores." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const confirmation = formData.get("confirmation") as string | null;
    const collectionsStr = formData.get("collections") as string | null;
    
    if (!file) {
      return NextResponse.json({ error: "No backup file uploaded" }, { status: 400 });
    }
    if (confirmation !== "RESTORE") {
      return NextResponse.json({ error: "Invalid confirmation string. Must type RESTORE." }, { status: 400 });
    }
    
    let selectedCollections: string[] = [];
    try {
      selectedCollections = JSON.parse(collectionsStr || "[]");
    } catch {
      return NextResponse.json({ error: "Invalid collections format" }, { status: 400 });
    }

    if (selectedCollections.length === 0) {
      return NextResponse.json({ error: "No collections selected for restore." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 28) {
      return NextResponse.json({ error: "Invalid backup file structure." }, { status: 400 });
    }

    const iv = buffer.subarray(0, 12);
    const authTag = buffer.subarray(12, 28);
    const encryptedData = buffer.subarray(28);

    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let decryptedBuffer: Buffer;
    try {
      decryptedBuffer = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    } catch (_err) {
      console.error("[Decrypt Error]", (_err as Error).message);
      return NextResponse.json({ 
        error: "Decryption failed. The file is corrupt, or the encryption key is incorrect." 
      }, { status: 400 });
    }

    let zip: AdmZip;
    try {
      zip = new AdmZip(decryptedBuffer);
    } catch {
      return NextResponse.json({ error: "Failed to parse decrypted archive as ZIP." }, { status: 400 });
    }

    const manifestEntry = zip.getEntry("metadata/manifest.json");
    if (!manifestEntry) {
      return NextResponse.json({ error: "Missing metadata/manifest.json in archive." }, { status: 400 });
    }
    const manifest = EJSON.parse(manifestEntry.getData().toString("utf8")) as Record<string, unknown>;

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");

    // Phase 1C: Emergency Backup (In-DB Namespace Copy)
    const timestamp = Date.now();
    for (const coll of selectedCollections) {
      try {
        await db.collection(coll).aggregate([{ $match: {} }, { $out: `${coll}_emergency_${timestamp}` }]).toArray();
      } catch {
        console.warn(`Emergency backup failed for ${coll}`);
      }
    }

    // Phase 1C: Atomic Swap - Insert into temporary namespaces
    const swapPlan: { original: string; temp: string; archive: string }[] = [];

    for (const coll of selectedCollections) {
      const dataEntry = zip.getEntry(`database/${coll}.json`);
      if (!dataEntry) {
        throw new Error(`Collection ${coll} selected but missing in backup archive.`);
      }
      const docs = EJSON.parse(dataEntry.getData().toString("utf8")) as Record<string, unknown>[];
      const tempCollName = `restore_tmp_${coll}_${timestamp}`;
      
      if (docs.length > 0) {
        await db.collection(tempCollName).insertMany(docs);
      } else {
        await db.createCollection(tempCollName);
      }

      swapPlan.push({
        original: coll,
        temp: tempCollName,
        archive: `${coll}_archive_${timestamp}`
      });
    }

    // Phase 1C: Atomic Swap - The actual swap
    for (const plan of swapPlan) {
      try {
        await db.collection(plan.original).rename(plan.archive);
      } catch {
        // Collection might not exist yet, which is fine
      }
      await db.collection(plan.temp).rename(plan.original);
    }

    // Verify Integrity
    const integrityResults: Record<string, { status: string; expected: number; actual: number }> = {};
    for (const plan of swapPlan) {
      const actual = await db.collection(plan.original).countDocuments();
      
      let expected = 0;
      if (Array.isArray(manifest.collections)) {
        if (typeof manifest.collections[0] === 'string') {
          expected = (manifest.documentCounts as Record<string, number>)?.[plan.original] || 0;
        } else {
          const expectedObj = (manifest.collections as { name: string; documents: number }[]).find(c => c.name === plan.original);
          expected = expectedObj ? expectedObj.documents : 0;
        }
      }
      
      integrityResults[plan.original] = {
        status: actual === expected ? "PASS" : "FAIL",
        expected,
        actual
      };
    }

    await db.collection("backup_logs").insertOne({
      backupId: manifest.backupId,
      fingerprint: manifest.fingerprint,
      backupType: "restore",
      status: "Success",
      startedAt: new Date(timestamp),
      finishedAt: new Date(),
      createdBy: admin.name,
      restoredCollections: selectedCollections
    });

    return NextResponse.json({
      success: true,
      message: "Restore completed successfully via atomic swap.",
      integrity: integrityResults
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("[Restore Error]", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
});
