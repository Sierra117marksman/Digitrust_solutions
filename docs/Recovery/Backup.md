# Recovery Snapshot Documentation

## Overview
A **Recovery Snapshot** is an AES-256-GCM encrypted ZIP archive containing the full state of the CRM database at a specific point in time. 

## Structure
```text
backup.enc
├── database/
│   ├── leads.json
│   ├── users.json
│   ├── notes.json
│   └── activities.json
├── uploads/
└── metadata/
    └── manifest.json
```

## The Manifest
The `manifest.json` acts as the fingerprint for the snapshot. It contains:
- **backupId**: Human readable ID (e.g., `BKP-20260717-020001-8A2F`)
- **fingerprint**: A short 16-character identifier (e.g., `8D34-9AF2-1C55-7EEA`)
- **documentCounts**: The exact expected number of documents for integrity validation.

## Manual Execution
To manually generate a snapshot:
1. Navigate to **Recovery Center** -> **Snapshot**.
2. Click **Create Recovery Snapshot**.
3. Download the resulting `.enc` file and store it safely offline (e.g., an External Hard Drive).
