# Adybaba Next.js CRM & Agency Template

An enterprise-grade, high-performance Digital Agency Website and CRM application built with Next.js 16 (App Router), React 19, TypeScript, MongoDB, and Tailwind CSS 4.

## 🚀 Features

### Public Facing Agency Website
- **Modern UI/UX**: Built with Tailwind CSS 4 for a responsive, fast, and accessible user experience.
- **Service Pages & Dynamic Routing**: SEO-friendly dynamic routing for services (Web Development, SEO, Meta Ads, etc.).
- **Lead Generation Integration**: Public contact forms directly insert lead data into the secure CRM database.

### Secure Admin CRM Dashboard
- **Role-Based Access Control**: Secure login with bcrypt hashing. Super Admin, Manager, and Employee roles.
- **Live Analytics Engine**: Real-time pipeline funnel tracking, SLA compliance monitoring, team scorecards, and expected win-rate calculations.
- **Lead Management Pipeline**: Interactive kanban-style pipeline for tracking prospects from "New" to "Won". Includes WhatsApp quick-messaging integration.
- **Automated Cloud Backups & Recovery**: 
  - Daily, automated encrypted snapshots to Google Drive.
  - Granular Recovery Center UI for downloading, validating checksums, and restoring databases with a single click.
  - Automated 30-day retention policies (auto-pruning).
- **Multi-Factor Authentication (MFA)**: Optional MFA setup for administrators.

## 🛠️ Technology Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Styling**: React 19, [Tailwind CSS v4](https://tailwindcss.com/), Lucide Icons
- **Database**: [MongoDB Atlas](https://www.mongodb.com/) (Native Driver)
- **Cloud Integration**: Google Drive API (for Backups)
- **Deployment**: [Vercel](https://vercel.com/)

## 💻 Local Development

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env.local` and provide your MongoDB connection string and backup keys:
   ```bash
   cp .env.example .env.local
   ```
   *(See `TEMPLATE_BOOTSTRAP.md` for a detailed guide on creating Google Drive API credentials and encryption keys).*

3. **Seed Initial Admin User**
   Run the setup script to generate your first Super Admin account.
   ```bash
   npm run seed:admins
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Building for Production
Vercel handles Next.js deployments seamlessly. Ensure your environment variables are configured in the Vercel project settings.
```bash
npm run build
```

## 📚 Documentation
- To mass-produce this CRM for future clients, refer to the **[Template Bootstrap Guide](TEMPLATE_BOOTSTRAP.md)** for a step-by-step 24-hour launch playbook.
- For business logic and design tokens, check `PROJECT_BRIEF.md`.

---
*Built securely for Digitrust Solutions.*
