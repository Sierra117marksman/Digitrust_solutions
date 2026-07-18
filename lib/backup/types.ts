import { ObjectId } from 'mongodb';

export type BackupStatus = 
  | 'pending'
  | 'uploading'
  | 'verifying'
  | 'verified'
  | 'failed'
  | 'archive_candidate'
  | 'purged';

export type BackupLabel = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'manual'
  | 'pre-restore'
  | 'emergency'
  | 'pre-migration';

export interface BackupAuditLog {
  _id?: ObjectId | string;
  id: string; // e.g., BKP-20260718-020000-XA9D
  status: BackupStatus;
  label: BackupLabel;
  provider: string; // e.g., 'google-drive', 'local'
  providerFileId?: string; // ID assigned by the cloud provider
  gridfsId?: ObjectId | string; // Temporary GridFS file ID
  retryCount: number;
  nextAttemptAt?: Date;
  
  // Verification Metrics
  checksum?: string;
  size?: number; // in bytes
  duration?: number; // total process time in seconds
  
  // Fingerprint Metadata
  schemaVersion: string;
  appVersion: string;
  collectionsBackedUp: number;
  
  // Timestamps
  createdAt: Date;
  uploadedAt?: Date;
  verifiedAt?: Date;
  purgedAt?: Date;
  
  // Errors
  lastError?: string;
}

export interface BackupManifest {
  manifestVersion: number;
  backupId: string;
  backupLabel: BackupLabel;
  backupReason: 'manual' | 'cron';
  trigger: 'owner' | 'system';
  created: string; // ISO 8601
  crmVersion: string;
  schemaVersion: string;
  mongoVersion: string;
  collections: ({name: string, documents: number, checksum: string} | string)[];
  documentCounts: Record<string, number>;
  createdBy: string;
  hostname: string;
  environment: string;
  checksum: string;
  compression: 'zip';
  encryption: 'aes-256-gcm';
  keyVersion: number; // For future key rotation
  previousBackupId?: string; // Links this to the previous backup in the chain
}

export interface ProviderHealthMetrics {
  status: 'healthy' | 'degraded' | 'offline';
  latencyMs?: number;
  storageUsedBytes?: number;
  backupsCount?: number;
  oldestBackupDate?: Date;
  newestBackupDate?: Date;
  lastVerification?: 'PASS' | 'FAIL';
  retryQueueSize: number;
  apiQuotaUsed?: number;
  apiQuotaTotal?: number;
  lastError?: string;
  apiVersion: string;
}

export interface BackupStorageProvider {
  name: string;
  version: number;
  /**
   * Uploads the `.enc` stream or buffer to the cloud provider.
   */
  upload(fileBuffer: Buffer, fileName: string, metadata: Partial<BackupAuditLog>): Promise<string>; // returns providerFileId
  /**
   * Lists available backups stored in this provider.
   */
  list(): Promise<{ id: string, providerFileId: string, createdAt: Date }[]>;
  /**
   * Downloads the `.enc` file back into memory for full SHA-256 verification or restore.
   */
  download(providerFileId: string): Promise<Buffer>;
  /**
   * Deletes a backup from the provider (used for retention cleanup).
   */
  delete(providerFileId: string): Promise<void>;
  /**
   * Gets real-time health metrics of the provider.
   */
  getHealth(): Promise<ProviderHealthMetrics>;
}
