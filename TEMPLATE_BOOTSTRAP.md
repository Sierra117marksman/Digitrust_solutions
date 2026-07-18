# 🚀 CRM Factory: 24-Hour Deployment Playbook

This document is your master template guide to clone, customize, and deploy this Agency/CRM repository for **new clients** in under 24 hours with zero build errors.

## Phase 1: Repository Setup (Hour 1)
1. **Fork or Duplicate the Repo**: 
   Do not start from scratch. Duplicate this repository to your new client's GitHub organization.
2. **Global Search and Replace**:
   Open the codebase in VS Code and perform a global find-and-replace for the following terms to rebrand the application:
   - `Digitrust Solutions` -> `New Client Name`
   - `adybabacrm` -> `newclientcrm`
   - Update `PROJECT_BRIEF.md` with their brand colors and GSTIN/Address.
3. **Brand Assets**:
   Replace `public/brand/logo.svg` (and any favicons in `app/favicon.ico`).

## Phase 2: Database & Environment (Hour 2-3)
1. **MongoDB Atlas**:
   - Create a new Project and Cluster in MongoDB Atlas.
   - Whitelist `0.0.0.0/0` in Network Access.
   - Create a database user and capture the connection string.
2. **Google Cloud Console (Backups)**:
   - Create a new Google Cloud Project.
   - Enable the **Google Drive API**.
   - Create a **Service Account** and generate a JSON Key.
   - Share a specific Google Drive Folder with the Service Account email and get the `FOLDER_ID`.
3. **Environment Setup**:
   Generate the encryption keys and secret keys:
   ```bash
   # Generate AUTH_SECRET
   openssl rand -base64 32
   
   # Generate BACKUP_ENCRYPTION_KEY (64 hex characters)
   openssl rand -hex 32
   ```

## Phase 3: Content Customization (Hour 4-8)
1. **Service Pages**: 
   Navigate to `app/services/` and map out the specific services the client offers. Adjust the hardcoded slugs in `app/components/` navigation bars.
2. **Policy Pages**: 
   Update `app/policies/` with the client's actual Terms and Conditions and Privacy Policy.
3. **Contact Information**:
   Update `app/contact/page.tsx` or footer components with their specific Phone, Email, and Address.

## Phase 4: Production Deployment (Hour 9-10)
1. **Vercel Setup**:
   - Import the GitHub repository into Vercel.
   - Go to **Settings > Environment Variables** and paste all contents from your `.env.local` (ensure `NODE_ENV=production` is automatically set).
2. **Deploy**:
   Hit Deploy. The strict TypeScript and ESLint rules are already resolved in this template, meaning the build will succeed on the first try.
3. **Verify Edge Cases**:
   - Check the contact form submission.
   - Verify Vercel hasn't blocked the MongoDB IP.

## Phase 5: CRM Initialization (Hour 11)
1. **Create the Admin Account**:
   Run the seeder locally against the production database to create the owner's account:
   ```bash
   node --env-file=.env.local scripts/seed-admins.mjs
   ```
2. **First Backup Test**:
   - Log into the deployed Admin CRM.
   - Go to **Settings > Recovery Center**.
   - Trigger a Manual Backup. Verify it encrypts and uploads to Google Drive successfully.

## Phase 6: Handoff (Hour 12-24)
- Run through a live QA session.
- Invite the client's team to the CRM.
- Provide them with their MFA setup instructions.
