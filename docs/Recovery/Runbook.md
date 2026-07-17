# Disaster Recovery Runbook

This runbook dictates the exact procedure to follow in the event of a catastrophic server failure, data corruption, or malicious attack.
**Stay calm. Follow the steps exactly. Do not skip steps.**

## Phase 1: Assess and Contain
1. Identify the scope of the disaster (Did we lose a lead? Did the server go down? Did the DB get wiped?).
2. If the application is under active attack, immediately restrict access (e.g., enable Maintenance Mode or change DB passwords).

## Phase 2: Locate the Latest Healthy Snapshot
1. Open the **Recovery Center** in the Admin CRM.
2. Review the **Timeline** to identify the most recent `Validation Passed` or `Snapshot Created` event.
3. Ensure you have the `BACKUP_ENCRYPTION_KEY` available in your password manager.

## Phase 3: Execute the Restore
1. Open `docs/Recovery/Restore.md` and follow the exact 6-Step Safe Restore Engine protocol.
2. Ensure you have two confirmations ready (Password + typing "RESTORE").
3. Ensure the post-restore Integrity Check passes.

## Phase 4: Verify and Communicate
1. Verify the application is fully operational.
2. Communicate the successful recovery to the team.
3. Conduct a post-mortem to determine root cause and prevent future occurrences.
