import { Resend } from "resend";
import { companyConfig } from "@/config/company";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const SENDER_EMAIL =
  process.env.RESEND_FROM_EMAIL || "support@digitrustsolutions.com";
export const FROM_NAME = "Digitrust Solutions";
export const FROM_HEADER = `${FROM_NAME} <${SENDER_EMAIL}>`;

export const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ||
  companyConfig.contact.email ||
  "digitrustsolutions@gmail.com";

export interface EnquiryEmailData {
  name: string;
  company?: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt?: Date;
}

/**
 * Sends a notification email to the internal Digitrust team about a new website lead.
 */
export async function sendLeadNotificationToAdmin(enquiry: EnquiryEmailData) {
  if (!resend) {
    console.warn("Resend is not configured (missing RESEND_API_KEY). Skipping admin email.");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const cleanPhone = enquiry.phone.replace(/[^\d+]/g, "");
  const waPhone = cleanPhone.startsWith("+")
    ? cleanPhone.replace("+", "")
    : cleanPhone.startsWith("0")
    ? `91${cleanPhone.slice(1)}`
    : cleanPhone.length === 10
    ? `91${cleanPhone}`
    : cleanPhone;

  const subject = `🔥 New Lead: ${enquiry.name} – ${enquiry.service}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060e18; margin: 0; padding: 24px; color: #e2e8f0; }
    .container { max-width: 600px; margin: 0 auto; background: #0b1f33; border: 1px solid #1e3a5a; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0b1f33 0%, #102a45 100%); border-bottom: 2px solid #219dc5; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 20px; color: #ffffff; }
    .badge { display: inline-block; background: #219dc5; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-top: 8px; }
    .body { padding: 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; text-transform: uppercase; color: #8ba2b9; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: 600; }
    .value { font-size: 16px; color: #f8fafc; font-weight: 500; }
    .message-box { background: #081726; border-left: 3px solid #219dc5; padding: 16px; border-radius: 4px; font-size: 15px; line-height: 1.5; color: #cbd5e1; }
    .actions { margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e3a5a; display: flex; gap: 12px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 8px; margin-bottom: 8px; }
    .btn-wa { background: #25D366; color: #ffffff; }
    .btn-email { background: #219dc5; color: #ffffff; }
    .btn-call { background: #334155; color: #ffffff; }
    .footer { padding: 16px 32px; background: #060e18; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Website Enquiry Received</h1>
      <span class="badge">${escapeHtml(enquiry.service)}</span>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Client Name</div>
        <div class="value">${escapeHtml(enquiry.name)}</div>
      </div>
      ${
        enquiry.company
          ? `<div class="field"><div class="label">Company / Brand</div><div class="value">${escapeHtml(enquiry.company)}</div></div>`
          : ""
      }
      <div class="field">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${escapeHtml(enquiry.email)}" style="color: #219dc5; text-decoration: none;">${escapeHtml(enquiry.email)}</a></div>
      </div>
      <div class="field">
        <div class="label">Phone Number</div>
        <div class="value"><a href="tel:${escapeHtml(cleanPhone)}" style="color: #219dc5; text-decoration: none;">${escapeHtml(enquiry.phone)}</a></div>
      </div>
      <div class="field">
        <div class="label">Requested Service</div>
        <div class="value">${escapeHtml(enquiry.service)}</div>
      </div>
      <div class="field">
        <div class="label">Project Details / Message</div>
        <div class="message-box">${escapeHtml(enquiry.message).replace(/\n/g, "<br>")}</div>
      </div>

      <div class="actions">
        <a class="btn btn-wa" href="https://wa.me/${waPhone}?text=${encodeURIComponent(`Hi ${enquiry.name}, thank you for reaching out to Digitrust Solutions regarding ${enquiry.service}!`)}" target="_blank">Chat on WhatsApp</a>
        <a class="btn btn-email" href="mailto:${escapeHtml(enquiry.email)}?subject=${encodeURIComponent(`Regarding your ${enquiry.service} enquiry - Digitrust Solutions`)}">Reply via Email</a>
        <a class="btn btn-call" href="tel:${escapeHtml(cleanPhone)}">Call Client</a>
      </div>
    </div>
    <div class="footer">
      Digitrust Solutions CRM • Received on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_HEADER,
      to: ADMIN_EMAIL,
      replyTo: enquiry.email,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (err) {
    console.error("Failed to send admin lead notification email via Resend:", err);
    return { success: false, error: err };
  }
}

/**
 * Sends a branded acknowledgment email to the prospective client confirming their submission.
 */
export async function sendClientConfirmation(enquiry: EnquiryEmailData) {
  if (!resend) {
    console.warn("Resend is not configured. Skipping client confirmation email.");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const subject = `We've received your enquiry – Digitrust Solutions`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0b1f33; padding: 32px 36px; text-align: left; border-bottom: 3px solid #219dc5; }
    .header h1 { margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #94a3b8; font-size: 14px; }
    .body { padding: 36px; }
    .greeting { font-size: 18px; font-weight: 600; color: #0b1f33; margin-bottom: 16px; }
    .intro { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .summary-card { background: #f1f5f9; border-radius: 8px; padding: 20px 24px; margin-bottom: 28px; }
    .summary-card h3 { margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #0b1f33; }
    .summary-item { font-size: 14px; margin-bottom: 8px; color: #334155; }
    .summary-item strong { color: #0f172a; }
    .steps { margin-bottom: 28px; }
    .steps h3 { font-size: 16px; color: #0b1f33; margin: 0 0 16px 0; }
    .step-item { display: flex; margin-bottom: 12px; font-size: 14px; line-height: 1.5; color: #475569; }
    .step-num { width: 24px; height: 24px; border-radius: 50%; background: #219dc5; color: #ffffff; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; font-size: 12px; }
    .cta-box { background: #ecfeff; border: 1px solid #a5f3fc; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 28px; }
    .cta-box p { margin: 0 0 12px 0; font-size: 14px; color: #0e7490; }
    .wa-link { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 22px; border-radius: 6px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 36px; font-size: 12px; color: #94a3b8; text-align: center; }
    .footer a { color: #219dc5; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Digitrust Solutions</h1>
      <p>Digital Growth & Full-Stack Development</p>
    </div>
    <div class="body">
      <div class="greeting">Hi ${escapeHtml(enquiry.name)},</div>
      <div class="intro">
        Thank you for reaching out! We have received your enquiry for <strong>${escapeHtml(enquiry.service)}</strong>. Our team is already reviewing your details.
      </div>

      <div class="summary-card">
        <h3>Enquiry Summary</h3>
        <div class="summary-item"><strong>Service:</strong> ${escapeHtml(enquiry.service)}</div>
        ${enquiry.company ? `<div class="summary-item"><strong>Company:</strong> ${escapeHtml(enquiry.company)}</div>` : ""}
        <div class="summary-item"><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</div>
      </div>

      <div class="steps">
        <h3>What happens next?</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div><strong>Requirement Review:</strong> Our team reviews your goals, scope, and target timelines.</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div><strong>Direct Reach-out:</strong> A growth or technical specialist will contact you within 24 business hours to discuss the plan.</div>
        </div>
      </div>

      <div class="cta-box">
        <p><strong>Need urgent assistance or want to talk right now?</strong></p>
        <a class="wa-link" href="https://wa.me/919211734699?text=${encodeURIComponent(`Hi Digitrust team, I submitted an enquiry for ${enquiry.service} and wanted to connect!`)}" target="_blank">Chat with Us on WhatsApp</a>
      </div>

      <p style="margin: 0; font-size: 14px; color: #64748b;">
        Best regards,<br>
        <strong style="color: #0b1f33;">The Digitrust Solutions Team</strong><br>
        <a href="https://digitrustsolutions.com" style="color: #219dc5; text-decoration: none;">digitrustsolutions.com</a>
      </p>
    </div>
    <div class="footer">
      Digitrust Solutions • Palam Vihar, Gurugram, Haryana - 122017<br>
      Phone: +91 92117 34699 | +91 92172 13181 • Email: support@digitrustsolutions.com
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_HEADER,
      to: enquiry.email,
      replyTo: SENDER_EMAIL,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (err) {
    console.error("Failed to send client confirmation email via Resend:", err);
    return { success: false, error: err };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
