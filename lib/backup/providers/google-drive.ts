import { google, drive_v3 } from 'googleapis';
import { BackupStorageProvider, BackupAuditLog, ProviderHealthMetrics } from '../types';
import { Readable } from 'stream';

export class GoogleDriveProvider implements BackupStorageProvider {
  name = 'Google Drive';
  version = 1;
  private drive: drive_v3.Drive;
  private folderId: string;

  constructor() {
    const credsJson = process.env.GOOGLE_DRIVE_CREDENTIALS;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    // OAuth2 Alternative
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    if (!folderId) {
      throw new Error("Google Drive folder ID is not configured.");
    }

    if (clientId && clientSecret && refreshToken) {
      // Use User OAuth2 (Bypasses Service Account 0-byte quota on free Gmail accounts)
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      this.drive = google.drive({ version: 'v3', auth: oauth2Client });
    } else if (credsJson) {
      // Use Service Account (Only works for Workspace Shared Drives)
      const credentials = JSON.parse(credsJson);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
      this.drive = google.drive({ version: 'v3', auth });
    } else {
      throw new Error("Google Drive credentials (Service Account JSON or OAuth2 Tokens) are missing.");
    }

    this.folderId = folderId;
  }

  async upload(fileBuffer: Buffer, fileName: string, metadata: Partial<BackupAuditLog>): Promise<string> {
    const fileMetadata: Record<string, any> = {
      name: fileName,
      parents: [this.folderId]
    };
    
    // We can't attach arbitrarily large custom metadata, so we attach minimal description
    if (metadata.id) {
      fileMetadata['description'] = `Backup ID: ${metadata.id} | Label: ${metadata.label}`;
    }

    const media = {
      mimeType: 'application/octet-stream',
      body: Readable.from(fileBuffer)
    };

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    if (!response.data.id) {
      throw new Error("Failed to get file ID from Google Drive");
    }

    return response.data.id;
  }

  async list(): Promise<{ id: string, providerFileId: string, createdAt: Date }[]> {
    const response = await this.drive.files.list({
      q: `'${this.folderId}' in parents and trashed = false`,
      fields: 'files(id, name, createdTime)',
      orderBy: 'createdTime desc'
    });

    const files = response.data.files || [];
    return files.map(f => {
      // Parse our ID format: BKP-20260718-020000-XA9D.enc
      const id = f.name?.replace('.enc', '') || 'unknown';
      return {
        id,
        providerFileId: f.id as string,
        createdAt: new Date(f.createdTime || Date.now())
      };
    });
  }

  async download(providerFileId: string): Promise<Buffer> {
    const response = await this.drive.files.get(
      { fileId: providerFileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data as ArrayBuffer);
  }

  async delete(providerFileId: string): Promise<void> {
    await this.drive.files.delete({ fileId: providerFileId });
  }

  async getHealth(): Promise<ProviderHealthMetrics> {
    try {
      const start = Date.now();
      const response = await this.drive.files.list({
        q: `'${this.folderId}' in parents and trashed = false`,
        fields: 'files(id, size, createdTime)',
        orderBy: 'createdTime asc', // Oldest first to easily get newest and oldest
        pageSize: 1000 // Assumes we don't keep more than 1000
      });
      const latencyMs = Date.now() - start;

      const files = response.data.files || [];
      const backupsCount = files.length;
      
      let storageUsedBytes = 0;
      files.forEach(f => {
        if (f.size) storageUsedBytes += parseInt(f.size, 10);
      });

      let oldestBackupDate: Date | undefined;
      let newestBackupDate: Date | undefined;

      if (backupsCount > 0) {
        oldestBackupDate = new Date(files[0].createdTime || Date.now());
        newestBackupDate = new Date(files[backupsCount - 1].createdTime || Date.now());
      }

      // Google Drive API quota is complex to fetch exactly via API for Service Accounts without admin SDK,
      // so we omit apiQuota used/total
      const apiQuotaTotal = undefined;
      const apiQuotaUsed = undefined;

      return {
        status: 'healthy',
        latencyMs,
        storageUsedBytes,
        backupsCount,
        oldestBackupDate,
        newestBackupDate,
        retryQueueSize: 0, // This is application-level, not provider level, so it will be injected later
        apiVersion: 'v3',
        apiQuotaTotal,
        apiQuotaUsed
      };
    } catch (error: unknown) {
      return {
        status: 'offline',
        retryQueueSize: 0,
        apiVersion: 'v3',
        lastError: (error as Error).message
      };
    }
  }
}
