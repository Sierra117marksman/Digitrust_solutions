# Disaster Recovery FAQ

### Q: What if the Google Drive upload fails?
**A:** Automated clouds are secondary redundancy. If Google Drive fails, the CRM will still attempt to push to the secondary cloud (Dropbox). If both fail, manually generate a snapshot from the Recovery Center immediately and save it to your local disk.

### Q: What if the encryption key is lost?
**A:** If the `BACKUP_ENCRYPTION_KEY` is lost, **all existing encrypted backups are permanently unrecoverable.** There is no backdoor. You must generate a new key immediately, update Vercel, and generate a fresh snapshot.

### Q: What if the checksum fails during a restore?
**A:** The Restore Wizard will block the operation. This means the file was corrupted during download, or a malicious actor tampered with it. Do not attempt to bypass this. Find a different backup from a previous day.

### Q: What if the schema version mismatches?
**A:** If you try to restore a backup from Schema v1 into a CRM running Schema v2, the Dry Run report will throw a warning. You can still force the restore, but you may need to run a database migration script immediately afterward to update the old data to the new schema format.

### Q: What if restore validation fails?
**A:** The temporary DB swap will be cancelled and production data will remain untouched. Check the Vercel server logs to identify the exact validation error (e.g., missing required fields in the JSON).
