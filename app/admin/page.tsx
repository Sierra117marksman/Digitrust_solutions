import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMongoClient } from "@/lib/mongodb";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { contactInfo } from "@/content/contact";

export const metadata: Metadata = {
  title: "CRM Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Enquiry = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  status?: string;
  createdAt?: Date;
};

function formatDate(value?: Date) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const client = await getMongoClient();
  const database = client.db(process.env.MONGODB_DB || "adybabacrm");
  const enquiries = database.collection<Enquiry>("website_enquiries");

  const [totalLeads, newLeads, recentLeads, statusCounts, adminCount] = await Promise.all([
    enquiries.countDocuments(),
    enquiries.countDocuments({ status: "new" }),
    enquiries.find({}).sort({ createdAt: -1 }).limit(12).toArray(),
    enquiries.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),
    database.collection("admin_users").countDocuments({ status: "active" }),
  ]);

  return (
    <main className="crm-page">
      <aside className="crm-sidebar">
        <div>
          <span className="crm-mark">D</span>
          <h1>Digitrust CRM</h1>
          <p>{admin.name}</p>
        </div>
        <nav aria-label="CRM navigation">
          <a href="#overview">Overview</a>
          <a href="#leads">Website leads</a>
          <a href="#team">Team</a>
        </nav>
        <form action="/api/admin/logout" method="post">
          <button className="crm-ghost-button">Logout</button>
        </form>
      </aside>

      <section className="crm-main">
        <header className="crm-topbar">
          <div>
            <p className="admin-kicker">Admin panel</p>
            <h2>Lead Command Center</h2>
          </div>
          <a className="crm-whatsapp-button" href={contactInfo.whatsapp.href}>
            WhatsApp lead line
          </a>
        </header>

        <section className="crm-stats" id="overview" aria-label="CRM overview">
          <article><span>Total leads</span><strong>{totalLeads}</strong></article>
          <article><span>New leads</span><strong>{newLeads}</strong></article>
          <article><span>Active admins</span><strong>{adminCount}</strong></article>
          <article><span>Lead phone</span><strong>{contactInfo.whatsapp.display}</strong></article>
        </section>

        <section className="crm-grid">
          <div className="crm-panel" id="leads">
            <div className="crm-panel-head">
              <div>
                <p className="admin-kicker">Pipeline</p>
                <h3>Recent website enquiries</h3>
              </div>
              <span>{recentLeads.length} shown</span>
            </div>
            <div className="crm-table">
              <div className="crm-table-row crm-table-head">
                <span>Lead</span><span>Service</span><span>Status</span><span>Received</span>
              </div>
              {recentLeads.length ? recentLeads.map((lead) => (
                <div className="crm-table-row" key={`${lead.email}-${lead.createdAt?.toISOString()}`}>
                  <span>
                    <strong>{lead.name || "Unnamed lead"}</strong>
                    <small>{lead.email}</small>
                    <small>{lead.phone}</small>
                  </span>
                  <span>{lead.service || "General"}</span>
                  <span><em>{lead.status || "new"}</em></span>
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
              )) : (
                <p className="crm-empty">No leads yet. Website enquiries will appear here.</p>
              )}
            </div>
          </div>

          <div className="crm-panel" id="team">
            <div className="crm-panel-head">
              <div>
                <p className="admin-kicker">Operations</p>
                <h3>Status summary</h3>
              </div>
            </div>
            <div className="crm-status-list">
              {statusCounts.length ? statusCounts.map((item) => (
                <div key={item._id || "unknown"}><span>{item._id || "unknown"}</span><strong>{item.count}</strong></div>
              )) : (
                <p className="crm-empty">No lead status data yet.</p>
              )}
            </div>
            <div className="crm-next-box">
              <span>Next build</span>
              <p>Telecaller accounts, lead assignment, call notes, follow-up dates, and manager reports.</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
