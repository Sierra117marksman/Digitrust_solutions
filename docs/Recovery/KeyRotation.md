# Encryption Key Rotation Procedure

The CRM uses AES-256-GCM to securely encrypt all Recovery Snapshots before they leave the server. The encryption key (`BACKUP_ENCRYPTION_KEY`) must be guarded tightly.

## Why Rotate?
If a former employee had access to the Vercel environment variables, or if you suspect the password manager was compromised, the key must be rotated.

## The Problem with Rotation
If you change the key today, **all backups created yesterday are now unreadable by the CRM.** You will not be able to use the Restore Wizard for those files unless you provide the old key.

## Safe Rotation Procedure
1. Go to your secure password manager.
2. Locate the current `BACKUP_ENCRYPTION_KEY`. Do NOT delete it. Rename it to `BACKUP_ENCRYPTION_KEY_OLD_[DATE]`.
3. Generate a new 256-bit secure key. Save it as the active `BACKUP_ENCRYPTION_KEY`.
4. Update the Vercel Environment Variables with the new key.
5. Immediately generate a new **Recovery Snapshot** from the CRM dashboard so you have at least one backup encrypted with the new key.

## Restoring Old Backups
If you ever need to restore a backup that was encrypted with an old key:
1. Temporarily replace the `BACKUP_ENCRYPTION_KEY` in Vercel with the old key from your vault.
2. Perform the restore.
3. Swap the key back to the new one.
