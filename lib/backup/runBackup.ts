import { getMongoClient } from '@/lib/mongodb';
import { SnapshotEngine } from './snapshot';
import { EncryptionEngine } from './encryption';
import { GoogleDriveProvider } from './providers/google-drive';
import { VerificationEngine } from './verification';
import { BackupAuditLog } from './types';
import crypto from 'crypto';
import { Db, ObjectId } from 'mongodb';

interface RunBackupParams {
  trigger: 'owner' | 'system';
  reason: 'manual' | 'cron';
  label: 'daily' | 'manual' | 'emergency';
  adminId?: string;
  adminName?: string;
}

async function purgeOldBackups(provider: GoogleDriveProvider, db: Db) {
  const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS ?? 30);
  const retentionCount = Number(process.env.BACKUP_RETENTION_COUNT ?? 30);
  
  if (retentionDays <= 0 || retentionCount <= 0) return;

  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  
  // Authoritative logs from our DB
  const verifiedLogs = await db.collection('backup_logs')
    .find({ status: 'verified', providerFileId: { $exists: true } })
    .sort({ createdAt: -1 })
    .toArray();

  // Safeguard: Keep at least ONE backup, and keep retentionCount
  if (verifiedLogs.length <= retentionCount) return;

  // We skip the first `retentionCount` backups entirely (newest first due to sort -1)
  const candidates = verifiedLogs.slice(retentionCount);

  for (const log of candidates) {
    if (new Date(log.createdAt) < cutoff && log.providerFileId) {
      try {
        await provider.delete(log.providerFileId);
        await db.collection('backup_logs').updateOne(
          { _id: log._id },
          { $set: { status: 'purged', purgedAt: new Date() } }
        );
      } catch (err) {
        console.warn(`Failed to purge backup ${log.id}:`, err);
      }
    }
  }
}

export async function runBackup(params: RunBackupParams): Promise<{ buffer: Buffer; auditLog: BackupAuditLog }> {
  const startMs = Date.now();
  const now = new Date(startMs);

  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || "adybabacrm");

  // Generate Backup ID
  const timestampStr = now.toISOString().replace(/[:.]/g, "").split("T");
  const dateStr = timestampStr[0].replace(/-/g, ""); // e.g. 20260718
  const timeStr = timestampStr[1].substring(0, 6);   // e.g. 020000
  const randomHex = crypto.randomBytes(2).toString("hex").toUpperCase();
  const backupId = `BKP-${dateStr}-${timeStr}-${randomHex}`;

  let finalAuditLog: Partial<BackupAuditLog> = {
    id: backupId,
    label: params.label,
    provider: 'Google Drive',
    retryCount: 0,
    createdAt: now,
    status: 'failed',
    appVersion: "1.0.4",
  };

  try {
    // 1. Snapshot
    const snapshotEngine = new SnapshotEngine(db);
    const { zipBuffer, manifest } = await snapshotEngine.createSnapshot(
      backupId,
      params.label,
      params.reason,
      params.trigger,
      params.adminName || 'System',
      1
    );

    // Calculate unencrypted size
    const rawSize = zipBuffer.length;

    // 2. Encrypt
    const encryptionEngine = new EncryptionEngine();
    const { encryptedBuffer, checksum } = encryptionEngine.encrypt(zipBuffer);
    const encryptedSize = encryptedBuffer.length;

    finalAuditLog = {
      ...finalAuditLog,
      schemaVersion: manifest.schemaVersion,
      collectionsBackedUp: manifest.collections.length,
      size: encryptedSize,
      checksum,
    };

    // 3. Upload
    const provider = new GoogleDriveProvider();
    const filename = `${backupId}.enc`;
    const providerFileId = await provider.upload(encryptedBuffer, filename, finalAuditLog);

    finalAuditLog.providerFileId = providerFileId;
    finalAuditLog.uploadedAt = new Date();

    // 4. Verify
    const downloadedBuffer = await provider.download(providerFileId);
    const isVerified = VerificationEngine.verify(downloadedBuffer, checksum, 'sha256');

    if (!isVerified) {
      throw new Error("Verification Failed: Uploaded file checksum does not match.");
    }

    finalAuditLog.status = 'verified';
    finalAuditLog.verifiedAt = new Date();

    // 5. Save Audit Log
    const endMs = Date.now();
    finalAuditLog.duration = (endMs - startMs) / 1000;

    const logEntry = {
      ...finalAuditLog,
      // Custom metric for the user: compression ratio
      rawSize,
      compressionRatio: `${Math.round(((rawSize - encryptedSize) / rawSize) * 100)}% reduction`,
      createdBy: params.adminId ? new ObjectId(params.adminId) : 'System'
    };

    await db.collection('backup_logs').insertOne(logEntry as Record<string, unknown>);

    // Safeguard: Only execute purge AFTER successful verification and log save
    try {
      await purgeOldBackups(provider, db);
    } catch (e) {
      console.error("[Purge Error]", e);
    }

    return {
      buffer: encryptedBuffer,
      auditLog: logEntry as BackupAuditLog
    };
  } catch (error: unknown) {
    // Log failure
    const endMs = Date.now();
    finalAuditLog.duration = (endMs - startMs) / 1000;
    finalAuditLog.lastError = (error as Error).message;
    finalAuditLog.status = 'failed';

    const logEntry = {
      ...finalAuditLog,
      createdBy: params.adminId ? new ObjectId(params.adminId) : 'System'
    };

    try {
      await db.collection('backup_logs').insertOne(logEntry as Record<string, unknown>);
    } catch {
      // Ignore inner db error
    }

    throw error;
  }
}
