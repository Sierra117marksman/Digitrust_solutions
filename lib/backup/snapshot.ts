import { Db } from 'mongodb';
import AdmZip from 'adm-zip';
import crypto from 'crypto';
import { EJSON } from 'bson';
import { BackupManifest, BackupLabel } from './types';

export class SnapshotEngine {
  constructor(private db: Db) {}

  /**
   * Generates a fresh backup manifest and zip buffer for the database collections.
   */
  async createSnapshot(
    backupId: string, 
    label: BackupLabel,
    reason: 'manual' | 'cron',
    trigger: 'owner' | 'system',
    createdBy: string,
    keyVersion: number
  ): Promise<{ zipBuffer: Buffer; manifest: BackupManifest }> {
    const collectionsToExport = ["website_enquiries", "admin_users", "backup_logs", "crm_views"];
    const databaseFiles: Record<string, unknown[]> = {};
    const collectionManifest: { name: string; documents: number; checksum: string }[] = [];
    const documentCounts: Record<string, number> = {};

    for (const collName of collectionsToExport) {
      const docs = await this.db.collection(collName).find({}).toArray();
      databaseFiles[collName] = docs;
      
      const buffer = Buffer.from(EJSON.stringify(docs, { relaxed: false }), "utf8");
      const colChecksum = crypto.createHash("sha256").update(buffer).digest("hex");
      
      collectionManifest.push({
        name: collName,
        documents: docs.length,
        checksum: colChecksum
      });
      documentCounts[collName] = docs.length;
    }

    const now = new Date();
    
    // Manifest
    const manifest: BackupManifest = {
      manifestVersion: 3,
      backupId,
      backupLabel: label,
      backupReason: reason,
      trigger: trigger,
      created: now.toISOString(),
      crmVersion: "1.0.4",
      schemaVersion: "2",
      mongoVersion: "7.5.0", // Hardcoded for now
      collections: collectionManifest,
      documentCounts,
      createdBy,
      hostname: process.env.VERCEL_URL || "localhost",
      environment: process.env.NODE_ENV || "production",
      checksum: "", // Filled later
      compression: "zip",
      encryption: "aes-256-gcm",
      keyVersion
    };

    // Create ZIP
    const zip = new AdmZip();
    
    // Add Database JSONs
    for (const [name, docs] of Object.entries(databaseFiles)) {
      zip.addFile(`database/${name}.json`, Buffer.from(JSON.stringify(docs, null, 2), "utf8"));
    }
    
    // Add dummy uploads dir
    zip.addFile("uploads/", Buffer.alloc(0));

    // Calculate Checksum of the ZIP before encryption (without manifest)
    const initialZipBuffer = zip.toBuffer();
    const checksum = crypto.createHash("sha256").update(initialZipBuffer).digest("hex");
    manifest.checksum = checksum;

    // Add Manifest
    zip.addFile("metadata/manifest.json", Buffer.from(JSON.stringify(manifest, null, 2), "utf8"));
    zip.addFile("metadata/checksum.json", Buffer.from(JSON.stringify({ checksum }, null, 2), "utf8"));
    
    const finalZipBuffer = zip.toBuffer();

    return { zipBuffer: finalZipBuffer, manifest };
  }
}
