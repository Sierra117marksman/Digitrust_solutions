import crypto from 'crypto';

export class EncryptionEngine {
  private key: Buffer;

  constructor() {
    const keyHex = process.env.BACKUP_ENCRYPTION_KEY;
    if (!keyHex) {
      throw new Error("BACKUP_ENCRYPTION_KEY is not configured.");
    }
    this.key = Buffer.from(keyHex, "hex");
    if (this.key.length !== 32) {
      throw new Error("BACKUP_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
    }
  }

  /**
   * Encrypts a buffer using AES-256-GCM.
   * Format: [12 bytes IV] [16 bytes AuthTag] [Encrypted Data]
   */
  encrypt(buffer: Buffer): { encryptedBuffer: Buffer; checksum: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", this.key, iv);
    
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const finalBuffer = Buffer.concat([iv, authTag, encrypted]);
    
    // Calculate the final full-file SHA-256 checksum
    const checksum = crypto.createHash("sha256").update(finalBuffer).digest("hex");

    return { encryptedBuffer: finalBuffer, checksum };
  }

  /**
   * Decrypts an encrypted buffer.
   */
  decrypt(encryptedBuffer: Buffer): Buffer {
    if (encryptedBuffer.length < 28) {
      throw new Error("Invalid encrypted buffer length");
    }

    const iv = encryptedBuffer.subarray(0, 12);
    const authTag = encryptedBuffer.subarray(12, 28);
    const encryptedData = encryptedBuffer.subarray(28);

    const decipher = crypto.createDecipheriv("aes-256-gcm", this.key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  }
}
