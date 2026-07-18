import crypto from 'crypto';

export class VerificationEngine {
  /**
   * Abstracted verification engine to support SHA-256 now, and others later.
   * Compares an in-memory buffer against an expected hash string.
   */
  static verify(buffer: Buffer, expectedHash: string, algorithm: 'sha256' | 'sha512' = 'sha256'): boolean {
    const actualHash = crypto.createHash(algorithm).update(buffer).digest("hex");
    return actualHash === expectedHash;
  }
}
