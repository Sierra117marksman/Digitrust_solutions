# Payment Receipts Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-trust, privacy-sanitized "Verified Client Payments" tab on `/client-results`, showcasing authentic UPI payment receipts with interactive modal inspection.

**Architecture:** 
1. Use `sharp` to redact sensitive client personal information (names, phone numbers, personal UPI IDs, bank accounts) from the 6 raw receipt screenshots, saving web-optimized WebP images into `public/images/receipts/`.
2. Implement a responsive tab switcher (`📊 Campaign Dashboards (8)`, `🎬 Video Walkthroughs (6)`, `💳 Verified Client Payments (6)`) in `app/client-results/ProofDossierClient.tsx`.
3. Build a high-conversion verified payment card grid with verified badges, milestone tags, and click-to-zoom modal lightbox.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Sharp (image processing), Lucide React.

**Spec:** User request to showcase client payment receipts on `/client-results` under a dedicated tab while strictly sanitizing all sensitive and personal information (names, numbers, accounts).

## Global Constraints
- Strictly sanitize all personal client names, phone numbers, personal emails, personal UPI IDs, and bank account numbers before publishing.
- Preserve only public business trust metrics: amounts (₹5,000, ₹2,800, ₹1,999, ₹1,000, ₹999), transaction timestamps, green success ticks, and work start confirmations.
- Author git commits strictly with `Sierra117marksman <thakkarajay37@yahoo.com>`.
- Keep existing phone numbers strictly (+91 92117 34699, +91 92172 13181) and canonical domain `digitrustsolutions.com`.
- Maintain 100% responsive design across Mobile (360px-390px), Tablet (768px-1024px), and Desktop (1440px+).

## Review Focus
- Redaction completeness: Verify no raw client phone numbers or personal names leak through any image.
- Image quality: Verify the cropped/masked receipts are crisp and legible.
- Tab accessibility & state: Ensure switching tabs updates view smoothly with keyboard and screen reader support.
- Lightbox zoom: Verify modal opens full-resolution preview and closes cleanly on Escape or backdrop click.
- Mobile responsiveness: Ensure receipt cards and modal fit small viewports cleanly.

---

### Task 1: Image Processing & Sensitive Data Redaction
**Files:**
- Create: `scripts/sanitize-receipts.mjs`
- Generate: `public/images/receipts/receipt-1.webp` through `receipt-6.webp`
- Test: Visual inspection and verification script

- [x] Create `scripts/sanitize-receipts.mjs` using `sharp` to mask top contact headers, phone numbers, personal UPI handles, and bank details with clean privacy badges ("Verified Client", "Digitrust Account").
- [x] Run the sanitization script to generate optimized WebP images in `public/images/receipts/`.
- [x] Visually verify that all sensitive data is 100% masked and amounts/ticks are crisp.

### Task 2: Data Model & Content Schema for Payment Proofs
**Files:**
- Create: `content/payment-receipts.ts`
- Test: TypeScript type check

- [x] Define `PaymentReceipt` interface: id, title, amount, date, status, serviceCategory, imageSrc, highlight, whatsappMessage.
- [x] Populate the 6 sanitized receipt items with realistic marketing milestone descriptions (e.g. "Meta Ads Setup & 7-Day Campaign Advance", "Retainer Advance", "Ad Account Optimization Retainer").

### Task 3: Tab Switcher & Payment Proof UI in `ProofDossierClient.tsx`
**Files:**
- Modify: `app/client-results/ProofDossierClient.tsx`
- Modify: `app/globals.css` (or dedicated styles)

- [x] Add active tab state: `'dashboards' | 'videos' | 'payments' | 'all'`.
- [x] Implement modern, accessible pill-tab switcher at the top of `/client-results`.
- [x] Render the `Verified Client Payments` section with trust badges, amount callouts, transaction dates, and lightbox triggers.
- [x] Extend existing lightbox modal to handle payment receipt zoom seamlessly.

### Task 4: End-to-End Verification & Production Build
**Files:**
- Test: `npm run lint`
- Test: `npm run build`
- Test: Playwright browser check

- [x] Run `npm run lint` and verify 0 errors, 0 warnings.
- [x] Run `npm run build` and verify all 37 pages compile and render.
- [x] Run headless browser test verifying tab switching and modal zoom on the live client results page.
- [x] Commit and push to `main` with designated author.
