"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { contactInfo } from "@/content/contact";

const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const priorities = ["High", "Medium", "Low"];
const temperatures = ["Hot", "Warm", "Cold"];
const budgets = ["", "25k-50k", "50k-1l", "1l-3l", "3l+"];
const lostReasons = ["", "Budget", "No Response", "Chose Competitor", "Timeline", "Project Cancelled", "Not Qualified", "Other"];
const pageSize = 25;

type Admin = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type ActivityLog = {
  action: string;
  type: string;
  performedBy: string;
  timestamp: string;
};

type Lead = {
  _id: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  service?: string;
  message?: string;
  status: string;
  priority: string;
  leadTemperature: string;
  budgetRange?: string;
  source?: string;
  notes?: string;
  followUpDate?: string;
  lastContactedAt?: string;
  wonValue?: number;
  lostReason?: string;
  createdAt: string;
  updatedAt?: string;
  activityLog?: ActivityLog[];
};

type Stats = {
  total: number;
  active: number;
  new: number;
  contacted: number;
  qualified: number;
  proposalSent: number;
  won: number;
  lost: number;
  overdue: number;
  dueToday: number;
  upcoming: number;
  idle: number;
  totalWonValue: number;
};

type LeadsResponse = {
  leads: Lead[];
  stats: Stats;
  pagination: { totalLeads: number; page: number; limit: number; totalPages: number };
  services: string[];
};

function formatDate(value?: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formatDateTime(value?: string) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formatMoney(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function budgetLabel(value?: string) {
  if (!value) return "Not specified";
  const labels: Record<string, string> = {
    "25k-50k": "Rs. 25k - Rs. 50k",
    "50k-1l": "Rs. 50k - Rs. 1L",
    "1l-3l": "Rs. 1L - Rs. 3L",
    "3l+": "Rs. 3L+",
  };
  return labels[value] || value;
}

function phoneDigits(phone = "") {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91")) return digits;
  return `91${digits}`;
}

function todayInputValue(value?: string) {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
}

export function AdminCrmApp({ admin }: { admin: Admin }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposalSent: 0,
    won: 0,
    lost: 0,
    overdue: 0,
    dueToday: 0,
    upcoming: 0,
    idle: 0,
    totalWonValue: 0,
  });
  const [services, setServices] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ totalLeads: 0, page: 1, limit: pageSize, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [temperatureFilter, setTemperatureFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [timelineFilter, setTimelineFilter] = useState("");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [note, setNote] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (temperatureFilter) params.set("leadTemperature", temperatureFilter);
    if (serviceFilter) params.set("service", serviceFilter);
    if (timelineFilter) params.set("timeline", timelineFilter);

    const response = await fetch(`/api/admin/leads?${params.toString()}`, { cache: "no-store" });
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = (await response.json()) as Partial<LeadsResponse> & { message?: string };
    if (!response.ok) {
      setError(data.message || "Could not load CRM leads.");
      setLoading(false);
      return;
    }
    const nextLeads = data.leads || [];
    setLeads(nextLeads);
    setActiveLead((current) => {
      if (!current) return current;
      return nextLeads.find((lead) => lead._id === current._id) || current;
    });
      setStats(data.stats || {
        total: 0,
        active: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        proposalSent: 0,
        won: 0,
        lost: 0,
        overdue: 0,
        dueToday: 0,
        upcoming: 0,
        idle: 0,
        totalWonValue: 0,
      });
      setPagination(data.pagination || { totalLeads: 0, page: 1, limit: pageSize, totalPages: 1 });
    setServices(data.services || []);
    setLoading(false);
  }, [page, priorityFilter, search, serviceFilter, statusFilter, temperatureFilter, timelineFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadLeads();
    }, search ? 280 : 0);
    return () => window.clearTimeout(timeout);
  }, [loadLeads, search]);

  async function updateLead(id: string, payload: Record<string, unknown>) {
    setSaving(true);
    setError("");
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.message || "Lead update failed.");
      return false;
    }
    await loadLeads();
    return true;
  }

  async function appendNote() {
    if (!activeLead || !note.trim()) return;
    const ok = await updateLead(activeLead._id, { note: note.trim() });
    if (ok) setNote("");
  }

  async function logContact(channel: string) {
    if (!activeLead) return;
    await updateLead(activeLead._id, { lastContactedAt: new Date().toISOString(), contactChannel: channel });
  }

  function exportCsv() {
    const headers = ["Name", "Email", "Phone", "Company", "Service", "Status", "Priority", "Temperature", "Budget", "Source", "Follow Up", "Last Contacted", "Notes"];
    const rows = leads.map((lead) => [
      lead.name,
      lead.email || "",
      lead.phone,
      lead.company || "",
      lead.service || "",
      lead.status,
      lead.priority,
      lead.leadTemperature,
      lead.budgetRange || "",
      lead.source || "",
      lead.followUpDate || "",
      lead.lastContactedAt || "",
      lead.notes || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `digitrust-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const recentActivity = useMemo(() => {
    return leads
      .flatMap((lead) => (lead.activityLog || []).map((item) => ({ ...item, leadName: lead.name })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  }, [leads]);

  return (
    <main className="crm-os">
      <aside className="crm-os-sidebar">
        <div>
          <span className="crm-mark">D</span>
          <h1>Digitrust CRM</h1>
          <p>{admin.name}</p>
          <small>{admin.role.replace(/_/g, " ")}</small>
        </div>
        <nav aria-label="CRM sections">
          <a href="#dashboard">Dashboard</a>
          <a href="#leads">Leads Hub</a>
          <a href="#activity">Activity</a>
        </nav>
        <form action="/api/admin/logout" method="post">
          <button className="crm-ghost-button">Logout</button>
        </form>
      </aside>

      <section className="crm-workspace">
        <header className="crm-commandbar">
          <div>
            <p className="admin-kicker">Sales operations</p>
            <h2>Lead Command Center</h2>
            <span>{stats.active} active leads need movement. {stats.overdue} overdue follow-ups.</span>
          </div>
          <div className="crm-command-actions">
            <a href={contactInfo.whatsapp.href}>WhatsApp line</a>
            <button onClick={exportCsv}>Export CSV</button>
          </div>
        </header>

        {error && <p className="crm-error">{error}</p>}

        <section className="crm-kpi-grid" id="dashboard">
          <button onClick={() => setTimelineFilter("")}><span>Total leads</span><strong>{stats.total}</strong><small>All captured enquiries</small></button>
          <button onClick={() => setStatusFilter("New")}><span>New</span><strong>{stats.new}</strong><small>Awaiting first action</small></button>
          <button onClick={() => setTimelineFilter("dueToday")}><span>Due today</span><strong>{stats.dueToday}</strong><small>Follow-ups scheduled</small></button>
          <button onClick={() => setTimelineFilter("overdue")}><span>Overdue</span><strong>{stats.overdue}</strong><small>Needs attention now</small></button>
          <button onClick={() => setStatusFilter("Won")}><span>Won value</span><strong>{formatMoney(stats.totalWonValue)}</strong><small>{stats.won} closed deals</small></button>
        </section>

        <section className="crm-main-grid">
          <div className="crm-panel crm-leads-panel" id="leads">
            <div className="crm-panel-head crm-toolbar">
              <div>
                <p className="admin-kicker">Leads hub</p>
                <h3>Pipeline workspace</h3>
              </div>
              <div className="crm-view-toggle">
                <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>Table</button>
                <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}>Kanban</button>
              </div>
            </div>

            <div className="crm-filters">
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email, phone, company" />
              <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
                <option value="">All statuses</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <select value={priorityFilter} onChange={(event) => { setPriorityFilter(event.target.value); setPage(1); }}>
                <option value="">All priorities</option>
                {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
              <select value={temperatureFilter} onChange={(event) => { setTemperatureFilter(event.target.value); setPage(1); }}>
                <option value="">All temperatures</option>
                {temperatures.map((temperature) => <option key={temperature} value={temperature}>{temperature}</option>)}
              </select>
              <select value={serviceFilter} onChange={(event) => { setServiceFilter(event.target.value); setPage(1); }}>
                <option value="">All services</option>
                {services.map((service) => <option key={service} value={service}>{service}</option>)}
              </select>
              <select value={timelineFilter} onChange={(event) => { setTimelineFilter(event.target.value); setPage(1); }}>
                <option value="">All follow-ups</option>
                <option value="dueToday">Due today</option>
                <option value="overdue">Overdue</option>
                <option value="upcoming">Upcoming</option>
                <option value="idle">Idle 48h+</option>
              </select>
            </div>

            {loading ? (
              <p className="crm-empty">Loading CRM leads...</p>
            ) : view === "kanban" ? (
              <div className="crm-kanban">
                {statuses.map((status) => (
                  <div className="crm-kanban-column" key={status}>
                    <div><strong>{status}</strong><span>{leads.filter((lead) => lead.status === status).length}</span></div>
                    {leads.filter((lead) => lead.status === status).map((lead) => (
                      <button className="crm-kanban-card" key={lead._id} onClick={() => setActiveLead(lead)}>
                        <strong>{lead.name}</strong>
                        <span>{lead.service || "General enquiry"}</span>
                        <small>{lead.priority} priority • {lead.leadTemperature}</small>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="crm-table">
                <div className="crm-table-row crm-table-head">
                  <span>Lead</span><span>Service</span><span>Status</span><span>Priority</span><span>Follow-up</span><span>Action</span>
                </div>
                {leads.length ? leads.map((lead) => (
                  <div className="crm-table-row crm-rich-row" key={lead._id}>
                    <span>
                      <strong>{lead.name}</strong>
                      <small>{lead.email || "No email"}</small>
                      <small>{lead.phone}</small>
                    </span>
                    <span>{lead.service || "General"}</span>
                    <span><em className={`crm-status-pill ${lead.status.toLowerCase().replace(/\s/g, "-")}`}>{lead.status}</em></span>
                    <span><em className={`crm-priority-pill ${lead.priority.toLowerCase()}`}>{lead.priority}</em></span>
                    <span>{formatDate(lead.followUpDate)}</span>
                    <span><button className="crm-row-button" onClick={() => setActiveLead(lead)}>Open</button></span>
                  </div>
                )) : (
                  <p className="crm-empty">No leads match these filters.</p>
                )}
              </div>
            )}

            <div className="crm-pagination">
              <span>{pagination.totalLeads} leads • page {pagination.page} of {pagination.totalPages || 1}</span>
              <div>
                <button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
                <button disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next</button>
              </div>
            </div>
          </div>

          <aside className="crm-side-stack">
            <div className="crm-panel" id="activity">
              <div className="crm-panel-head">
                <div>
                  <p className="admin-kicker">Activity</p>
                  <h3>Recent movement</h3>
                </div>
              </div>
              <div className="crm-activity-list">
                {recentActivity.length ? recentActivity.map((item, index) => (
                  <div key={`${item.timestamp}-${index}`}>
                    <strong>{item.leadName}</strong>
                    <p>{item.action}</p>
                    <span>{formatDateTime(item.timestamp)} • {item.performedBy}</span>
                  </div>
                )) : <p className="crm-empty">Activity appears when leads are updated.</p>}
              </div>
            </div>

            <div className="crm-panel">
              <div className="crm-next-box">
                <span>Manager view</span>
                <p>Next layer: create telecaller users, assign leads, daily call targets, and manager reports.</p>
              </div>
            </div>
          </aside>
        </section>
      </section>

      {activeLead && (
        <div className="crm-drawer-shell">
          <button className="crm-drawer-backdrop" onClick={() => setActiveLead(null)} aria-label="Close lead details" />
          <aside className="crm-drawer">
            <header>
              <div>
                <p className="admin-kicker">Lead profile</p>
                <h3>{activeLead.name}</h3>
                <span>Captured {formatDateTime(activeLead.createdAt)}</span>
              </div>
              <button onClick={() => setActiveLead(null)}>Close</button>
            </header>

            <div className="crm-drawer-actions">
              <a href={`tel:${activeLead.phone}`} onClick={() => void logContact("call")}>Call</a>
              <a href={`https://wa.me/${phoneDigits(activeLead.phone)}`} target="_blank" rel="noreferrer" onClick={() => void logContact("whatsapp")}>WhatsApp</a>
            </div>

            <section className="crm-drawer-grid">
              <label>Status<select value={activeLead.status} onChange={(event) => void updateLead(activeLead._id, { status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label>Priority<select value={activeLead.priority} onChange={(event) => void updateLead(activeLead._id, { priority: event.target.value })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
              <label>Temperature<select value={activeLead.leadTemperature} onChange={(event) => void updateLead(activeLead._id, { leadTemperature: event.target.value })}>{temperatures.map((temperature) => <option key={temperature}>{temperature}</option>)}</select></label>
              <label>Budget<select value={activeLead.budgetRange || ""} onChange={(event) => void updateLead(activeLead._id, { budgetRange: event.target.value })}>{budgets.map((budget) => <option key={budget} value={budget}>{budgetLabel(budget)}</option>)}</select></label>
              <label>Follow-up<input type="date" value={todayInputValue(activeLead.followUpDate)} onChange={(event) => void updateLead(activeLead._id, { followUpDate: event.target.value })} /></label>
              <label>Won value<input type="number" min="0" value={activeLead.wonValue || ""} onChange={(event) => void updateLead(activeLead._id, { wonValue: Number(event.target.value || 0) })} /></label>
              <label>Lost reason<select value={activeLead.lostReason || ""} onChange={(event) => void updateLead(activeLead._id, { lostReason: event.target.value })}>{lostReasons.map((reason) => <option key={reason} value={reason}>{reason || "None"}</option>)}</select></label>
              <label>Company<input value={activeLead.company || ""} onChange={(event) => setActiveLead({ ...activeLead, company: event.target.value })} onBlur={(event) => void updateLead(activeLead._id, { company: event.target.value })} /></label>
            </section>

            <section className="crm-drawer-section">
              <h4>Project brief</h4>
              <p>{activeLead.message || "No message submitted."}</p>
            </section>

            <section className="crm-drawer-section">
              <h4>Internal notes</h4>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add call note, client response, next step..." />
              <button disabled={saving || !note.trim()} onClick={() => void appendNote()}>{saving ? "Saving..." : "Save note"}</button>
              {activeLead.notes && <p className="crm-existing-notes">{activeLead.notes}</p>}
            </section>

            <section className="crm-drawer-section">
              <h4>Timeline</h4>
              <div className="crm-timeline">
                {(activeLead.activityLog || []).slice().reverse().map((item, index) => (
                  <div key={`${item.timestamp}-${index}`}>
                    <strong>{item.action}</strong>
                    <span>{formatDateTime(item.timestamp)} • {item.performedBy}</span>
                  </div>
                ))}
                {!(activeLead.activityLog || []).length && <p>No activity recorded yet.</p>}
              </div>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
}
