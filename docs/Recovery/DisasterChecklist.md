# Disaster Recovery Checklist

In a high-stress scenario, follow this checklist sequentially to guarantee a safe recovery.

- [ ] Identify the scope of the data loss.
- [ ] Notify the team that the CRM is entering recovery mode.
- [ ] Locate the latest healthy `backup.enc` snapshot (from local disk, Google Drive, or Dropbox).
- [ ] Obtain the `BACKUP_ENCRYPTION_KEY` from the secure password vault.
- [ ] Open the **Recovery Center** -> **Restore Wizard**.
- [ ] Upload the snapshot and await the **Restore Simulation Report**.
- [ ] Verify the `manifest.json` schema matches the current CRM version.
- [ ] Verify the expected document counts in the preview diff.
- [ ] Confirm the automatic Emergency Snapshot was created successfully.
- [ ] Approve the final Restore.
- [ ] Verify the post-restore Integrity Check reads `PASS`.
- [ ] Log in and manually verify a few Leads/Notes exist.
- [ ] Notify the team that recovery is complete.
