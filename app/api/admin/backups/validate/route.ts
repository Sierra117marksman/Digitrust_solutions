import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { requireAuthenticated } from "@/lib/auth/requirePermission";
import crypto from "crypto";
import AdmZip from "adm-zip";

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
    return NextResponse.json({ error: "Forbidden: Only the Owner can run Restore Simulations." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    
    if (!file) {
      return NextResponse.json({ error: "No backup file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 28) {
      return NextResponse.json({ error: "Invalid backup file structure. File is too small." }, { status: 400 });
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
      return NextResponse.json({ error: "Failed to parse decrypted archive as ZIP. It may be corrupt." }, { status: 400 });
    }

    const manifestEntry = zip.getEntry("metadata/manifest.json");
    if (!manifestEntry) {
      return NextResponse.json({ error: "Missing metadata/manifest.json in archive." }, { status: 400 });
    }

    const manifestStr = manifestEntry.getData().toString("utf8");
    const manifest = JSON.parse(manifestStr);

    const checksumEntry = zip.getEntry("metadata/checksum.json");
    if (!checksumEntry) {
      return NextResponse.json({ error: "Missing metadata/checksum.json in archive." }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");

    const warnings: string[] = [];
    const diff: Record<string, unknown> = {};

    const liveCrmVersion = "1.0.4";
    if (manifest.minimumRestoreVersion && liveCrmVersion < manifest.minimumRestoreVersion) {
      warnings.push(`CRITICAL: Live CRM (${liveCrmVersion}) is older than Minimum Restore Version (${manifest.minimumRestoreVersion}). Restore may fail.`);
    }

    const collections = manifest.collections || [];

    for (const coll of collections) {
      const collName = coll.name;
      const backupCount = coll.documents;
      
      const liveDocs = await db.collection(collName).countDocuments();
      diff[collName] = {
        liveCount: liveDocs,
        backupCount: backupCount,
        difference: backupCount - liveDocs
      };
    }

    await db.collection("backup_logs").insertOne({
      backupId: manifest.backupId,
      fingerprint: manifest.fingerprint,
      backupType: "simulation",
      status: "Success",
      startedAt: new Date(),
      finishedAt: new Date(),
      createdBy: admin.name
    });

    return NextResponse.json({
      manifest,
      warnings,
      diff,
      integrity: "PASS"
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("[Validation Error]", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
});
