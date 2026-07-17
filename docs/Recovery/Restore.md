# Safe Restore Engine Procedure

The Restore Engine uses a 6-Step Reversible process to ensure production data is never accidentally corrupted.

## Step 1: Upload
Navigate to **Recovery Center** -> **Restore Wizard**. Upload your `backup.enc` file.

## Step 2: Deep Validation & Dry Run
The system will decrypt the file in memory, read the `manifest.json`, and simulate the restore. It will generate a **Restore Simulation Report**.

## Step 3: Preview
Review the Simulation Report carefully. Look for warnings regarding schema version mismatches. Note any differences in document counts between the current live DB and the backup snapshot.

## Step 4: Partial Selection
Select exactly which collections you wish to restore. (e.g., You may want to restore `leads` and `notes`, but leave `users` untouched).

## Step 5: Safe Swap (Temp DB)
1. You will be prompted to enter your password and explicitly type **RESTORE**.
2. The system will create an automatic **Emergency Snapshot** of production.
3. The selected collections will be restored into a temporary namespace.
4. A transaction swap will replace the production collections.

## Step 6: Integrity Check
The system will automatically query the new production collections and verify the counts match the manifest exactly.
