"use client";
/* eslint-disable */


import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import NewLeadModal from "./NewLeadModal";
import ActionCenter from "./ActionCenter";
import CallOutcomeModal from "./CallOutcomeModal";
import WhatsAppTemplateModal from "./WhatsAppTemplateModal";
import NeedsAttentionQueue from "./NeedsAttentionQueue";
import ExportPreviewModal from "./ExportPreviewModal";
import SavedViewsBar from "./SavedViewsBar";
import BusinessHealthDashboard from "./BusinessHealthDashboard";
import { contactInfo } from "@/content/contact";
import { logError } from "../utils/logger";
import TeamManagement from "./TeamManagement";

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

type Event = {
  action: string;
  type: string;
  performedBy: string;
  timestamp: string;
};

type Note = {
  author: string;
  createdAt: string;
  note: string;
  type: "Call" | "System" | "Manager" | "Employee";
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
  notes?: Note[];
  nextFollowUpAt?: string;
  followUpReason?: string;
  followUpType?: "Call" | "WhatsApp" | "Email" | "Meeting";
  followUpStatus?: "Pending" | "Completed" | "Missed" | "Cancelled";
  lastContactedAt?: string;
  wonValue?: number;
  lostReason?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  lastAssignedAt?: string;
  reassignedCount?: number;
  events?: Event[];
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
  unassigned?: number;
  employeeStats?: Record<string, number>;
  totalWonValue: number;
  yesterdayLeads?: number;
};

type LeadsResponse = {
  leads: Lead[];
  stats: Stats;
  pagination: { totalLeads: number; page: number; limit: number; totalPages: number };
  services: string[];
  recentActivityFeed?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

function formatDate(value?: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}


  const getSLA = (lead: Lead) => {
    const ageHours = (Date.now() - new Date(lead.createdAt).getTime()) / 3600000;
    if (ageHours < 2) return { color: "#00ff88", text: "New" };
    if (ageHours < 8) return { color: "#ffcc00", text: "Action Needed" };
    return { color: "#ff4444", text: "At Risk" };
  };

  const getHealth = (lead: Lead) => {
    if (!lead.lastContactedAt) return "🔴 Idle";
    const days = (Date.now() - new Date(lead.lastContactedAt).getTime()) / 86400000;
    if (days < 2) return "🟢 Healthy";
    if (days < 5) return "🟡 Needs Attention";
    return "🔴 At Risk";
  };

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
    unassigned: 0,
    employeeStats: {},
    totalWonValue: 0,
  });
  const [services, setServices] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Admin[]>([]);
  const [pagination, setPagination] = useState({ totalLeads: 0, page: 1, limit: pageSize, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [temperatureFilter, setTemperatureFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [timelineFilter, setTimelineFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const [originalLead, setOriginalLead] = useState<Lead | null>(null);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [actioningCall, setActioningCall] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [actioningWhatsApp, setActioningWhatsApp] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [recentFeed, setRecentFeed] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any

  const isSavingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasUnsavedChanges = useMemo(() => {
    if (!activeLead || !originalLead) return false;
    if (note.trim().length > 0) return true;
    const editableFields = ["status", "priority", "leadTemperature", "budgetRange", "nextFollowUpAt", "wonValue", "lostReason", "company"];
    return editableFields.some((field) => activeLead[field as keyof Lead] !== originalLead[field as keyof Lead]);
  }, [activeLead, note, originalLead]);

  
  const toggleSelect = (id: string) => {
    const next = new Set(selectedLeads);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeads(next);
  };

  const selectAll = () => {
    if (selectedLeads.size === leads.length) setSelectedLeads(new Set());
    else setSelectedLeads(new Set(leads.map(l => l._id)));
  };

  const handleBulkAction = async (action: 'assign' | 'archive', assignedTo?: string) => {
    if (selectedLeads.size === 0) return;
    const loadingToast = toast.loading(`Bulk ${action}ing...`);
    try {
      const res = await fetch("/api/admin/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, leadIds: Array.from(selectedLeads), assignedTo })
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      toast.success(`Bulk ${action} complete`, { id: loadingToast });
      setSelectedLeads(new Set());
      loadLeads(true);
    } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(e.message, { id: loadingToast });
    }
  };

  function openLead(lead: Lead) {
    setActiveLead(lead);
    setOriginalLead(lead);
  }

  function closeLead() {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to close?")) return;
    }
    setActiveLead(null);
    setOriginalLead(null);
    setNote("");
  }

  const canAssignLeads = admin.role === "owner" || admin.role === "manager";

  useEffect(() => {
    if (!canAssignLeads) return;
    fetch("/api/admin/users?role=employee")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setEmployees(data.users.filter((u: Admin & { status: string }) => u.status !== "deleted"));
        }
      })
      .catch(console.error);
  }, [canAssignLeads]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
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
    if (assignedToFilter) params.set("assignedTo", assignedToFilter);

    try {
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
      if (data.recentActivityFeed) setRecentFeed(data.recentActivityFeed);
    } catch (err) {
      console.error(err);
      setError("Could not load CRM leads.");
    } finally {
      setLoading(false);
    }
  }, [page, priorityFilter, search, serviceFilter, statusFilter, temperatureFilter, timelineFilter, assignedToFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadLeads();
    }, search ? 280 : 0);
    return () => window.clearTimeout(timeout);
  }, [loadLeads, search]);

  async function updateLead(id: string, payload: Record<string, unknown>) {
    if (isSavingRef.current) return false;
    isSavingRef.current = true;
    setSaving(true);
    setError("");

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const previousLead = leads.find((l) => l._id === id);
    if (previousLead) {
      setLeads((current) =>
        current.map((l) => (l._id === id ? { ...l, ...payload } : l))
      );
      if (activeLead && activeLead._id === id) {
        setActiveLead((current) => ({ ...current, ...payload } as Lead));
        setOriginalLead((current) => current ? ({ ...current, ...payload } as Lead) : null);
      }
    }

    const loadingToast = toast.loading("Saving changes...");

    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updatedAt: previousLead?.updatedAt, ...payload }),
        signal: abortControllerRef.current.signal
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Lead update failed.");
      }
      
      toast.success("Saved", { id: loadingToast });
      await loadLeads(true);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        toast.dismiss(loadingToast);
        return false;
      }
      logError("updateLead", error);
      toast.error(error instanceof Error ? error.message : "Could not save changes.", { id: loadingToast });
      
      if (previousLead) {
        setLeads((current) =>
          current.map((l) => (l._id === id ? previousLead : l))
        );
        if (activeLead && activeLead._id === id) {
          setActiveLead(previousLead);
          setOriginalLead(previousLead);
        }
      }
      return false;
    } finally {
      isSavingRef.current = false;
      setSaving(false);
    }
  }

  async function appendNote() {
    if (!activeLead || !note.trim()) return;
    const loadingToast = toast.loading("Saving note...");
    isSavingRef.current = true;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeLead._id, note: note.trim() }),
      });
      if (!response.ok) throw new Error("Could not save note.");
      
      toast.success("Note saved", { id: loadingToast });
      setNote("");
      await loadLeads(true);
    } catch (error: unknown) {
      logError("appendNote", error);
      toast.error("Could not save note.", { id: loadingToast });
    } finally {
      isSavingRef.current = false;
      setSaving(false);
    }
  }

    async function snoozeLead(id: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0);
    await updateLead(id, { nextFollowUpAt: tomorrow.toISOString(), followUpStatus: 'Pending' });
    toast.success("Follow-up snoozed to tomorrow 11 AM");
  }

  async function completeFollowUp(id: string) {
    await updateLead(id, { followUpStatus: 'Completed' });
    toast.success("Follow-up marked as completed");
  }

async function logContact(id: string, channel: string) {
    await updateLead(id, { lastContactedAt: new Date().toISOString(), contactChannel: channel });
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
      lead.nextFollowUpAt || "",
      lead.lastContactedAt || "",
      (Array.isArray(lead.notes) ? lead.notes.map(n => n.note).join(" | ") : (lead.notes || "")),
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
      .flatMap((lead) => (lead.events || (lead as any).activityLog || []).map((item: Event) => ({ ...item, leadName: lead.name })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  }, [leads]);

  const nextCallLead = useMemo(() => {
    if (admin.role !== 'employee') return null;
    const pendingCalls = leads.filter(l => l.nextFollowUpAt && l.followUpStatus !== 'Completed');
    pendingCalls.sort((a, b) => new Date(a.nextFollowUpAt!).getTime() - new Date(b.nextFollowUpAt!).getTime());
    return pendingCalls[0];
  }, [leads, admin.role]);

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
          {(admin.role === "owner" || admin.role === "manager") && (
            <a href="#team">Team</a>
          )}
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
            <ActionCenter onAction={(id, action, phone) => { if (action.includes("Call")) { window.location.href=`tel:${phone}`; setActioningCall(id); } else { const lead = leads.find(l => l._id === id); if(lead) openLead(lead); } }} />
            <button onClick={exportCsv}>Export CSV</button>
          </div>
        </header>

        {error && <p className="crm-error">{error}</p>}

        {nextCallLead && (
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', borderLeft: '4px solid #00ff88', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>Next Call</p>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'white' }}>{nextCallLead.name} at {formatDateTime(nextCallLead.nextFollowUpAt)}</h3>
            </div>
            <button onClick={() => { void logContact(nextCallLead._id, "call"); window.location.href = `tel:${nextCallLead.phone}`; }} style={{ background: '#00ff88', color: 'black', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Call Now →</button>
          </div>
        )}

        <section className="crm-kpi-grid" id="dashboard">

          {admin.role === "employee" ? (
            <div className="crm-daily-planner" style={{ width: '100%' }}>
              <NeedsAttentionQueue 
                onAction={(leadId, action, phone) => {
                  if (action === "Call Now" && phone) {
                    window.location.href = `tel:${phone}`;
                    const l = leads.find(l => l._id === leadId);
                    if (l) setActioningCall(l._id);
                  } else {
                    const l = leads.find(l => l._id === leadId);
                    if (l) openLead(l);
                  }
                }}
              />
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <button onClick={() => { setTimelineFilter(""); setStatusFilter(""); }} className={!timelineFilter && !statusFilter ? "active" : ""}><span>My Leads</span><strong>{stats.total}</strong></button>
                <button onClick={() => { setTimelineFilter("dueToday"); setStatusFilter(""); }} className={timelineFilter === "dueToday" ? "active" : ""}><span>Today&apos;s Calls</span><strong>{stats.dueToday}</strong></button>
                <button onClick={() => { setTimelineFilter("overdue"); setStatusFilter(""); }} className={timelineFilter === "overdue" ? "active" : ""}><span>Pending</span><strong>{stats.overdue}</strong></button>
              </div>
            </div>
          ) : (
            <>
              <NeedsAttentionQueue 
                onAction={(leadId, action, phone) => {
                  if (action === "Call Now" && phone) {
                    window.location.href = `tel:${phone}`;
                    const l = leads.find((l: any) => l._id === leadId);
                    if (l) setActioningCall(l._id);
                  } else {
                    const l = leads.find((l: any) => l._id === leadId);
                    if (l) openLead(l);
                  }
                }}
              />
              <button onClick={() => setTimelineFilter("")}>
                <span>Total leads</span>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {stats.total} 
                  <small style={{ color: stats.yesterdayLeads && stats.total > stats.yesterdayLeads ? '#00ff88' : '#888', fontSize: '0.7rem' }}>
                    {stats.yesterdayLeads ? `↑ ${Math.round(((stats.total - stats.yesterdayLeads) / stats.yesterdayLeads) * 100)}% vs Ytd` : ''}
                  </small>
                </strong>
                <small>All captured enquiries</small>
              </button>
              <button onClick={() => setStatusFilter("New")}><span>New</span><strong>{stats.new}</strong><small>Awaiting first action</small></button>
              <button onClick={() => setTimelineFilter("dueToday")}><span>Due today</span><strong>{stats.dueToday}</strong><small>Follow-ups scheduled</small></button>
              <button onClick={() => setTimelineFilter("idle")}><span>Idle</span><strong>{stats.idle}</strong><small>No activity 14+ days</small></button>
              <button onClick={() => setStatusFilter("Won")}><span>Won value</span><strong>{formatMoney(stats.totalWonValue)}</strong><small>{stats.won} closed deals</small></button>
            </>
          )}

        </section>

        {canAssignLeads && (
          <section className="crm-kpi-grid" style={{ marginTop: "1rem" }}>
            <button onClick={() => setAssignedToFilter("unassigned")} className={assignedToFilter === "unassigned" ? "active" : ""}>
              <span>Unassigned</span>
              <strong>{stats.unassigned || 0}</strong>
              <small>Needs assignment</small>
            </button>
            {employees.map(emp => (
              <button key={emp.id} onClick={() => setAssignedToFilter(emp.id)} className={assignedToFilter === emp.id ? "active" : ""}>
                <span>{emp.name}</span>
                <strong>{(stats.employeeStats && stats.employeeStats[emp.id]) || 0} Leads <span style={{fontSize:"0.6rem"}}>{((stats.employeeStats && stats.employeeStats[emp.id]) || 0) < 20 ? "🟢" : ((stats.employeeStats && stats.employeeStats[emp.id]) || 0) < 40 ? "🟡" : "🔴"}</span></strong>
                <small>Active pipeline</small>
              </button>
            ))}
          </section>
        )}

        <section className="crm-main-grid">
          <div className="crm-panel crm-leads-panel" id="leads">
            <div className="crm-panel-head crm-toolbar">
              <div>
                <p className="admin-kicker">Leads hub</p>
                <h3>Pipeline workspace</h3>
              </div>
              <div className="crm-view-toggle">
                <button onClick={() => setIsCreatingLead(true)} style={{ marginRight: '1rem', background: 'white', color: 'black' }}>+ New Lead</button>
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
              {canAssignLeads && (
                <select value={assignedToFilter} onChange={(event) => { setAssignedToFilter(event.target.value); setPage(1); }}>
                  <option value="">All Assignees</option>
                  <option value="unassigned">Unassigned</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              )}
              <button 
                onClick={() => { setSearch(""); setStatusFilter(""); setPriorityFilter(""); setTemperatureFilter(""); setServiceFilter(""); setTimelineFilter(""); setPage(1); }}
                disabled={!(search || statusFilter || priorityFilter || temperatureFilter || serviceFilter || timelineFilter)}
                className="crm-clear-filters"
              >
                Clear Filters
              </button>
            </div>

            {loading ? (
              <p className="crm-empty">Loading CRM leads...</p>
            ) : view === "kanban" ? (
              <div className="crm-kanban">
                {statuses.map((status) => (
                  <div className="crm-kanban-column" key={status}>
                    <div><strong>{status}</strong><span>{leads.filter((lead) => lead.status === status).length}</span></div>
                    {leads.filter((lead) => lead.status === status).map((lead) => (
                      <button className="crm-kanban-card" key={lead._id} onClick={() => openLead(lead)}>
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
                  <span style={{width:"40px"}}><input type="checkbox" onChange={selectAll} checked={selectedLeads.size > 0 && selectedLeads.size === leads.length} /></span><span>Lead</span><span>Service</span><span>Health / SLA</span><span>Follow-up</span><span>Action</span>
                </div>
                {leads.length ? leads.map((lead) => (
                  <div className="crm-table-row crm-rich-row" key={lead._id} style={{ background: selectedLeads.has(lead._id) ? "rgba(0,255,136,0.05)" : undefined }}>
                    <span style={{width:"40px"}}><input type="checkbox" checked={selectedLeads.has(lead._id)} onChange={() => toggleSelect(lead._id)} /></span>
                    <span>
                      <strong>{lead.name}</strong>
                      <small>{lead.email || "No email"}</small>
                      <small>{lead.phone}</small>
                    </span>
                    <span>{lead.service || "General"}</span>
                    <span style={{display:"flex", flexDirection:"column", gap:"0.25rem"}}>
                      <em style={{fontSize:"0.75rem", color: getSLA(lead).color}}>{getSLA(lead).text}</em>
                      <em style={{fontSize:"0.75rem", color:"#888"}}>{getHealth(lead)}</em>
                    </span>
                    <span>{formatDate(lead.nextFollowUpAt)}</span>
                    <span className="quick-actions">
                      <button title="Call" onClick={() => { window.location.href = `tel:${lead.phone}`; setActioningCall(lead._id); }}>📞</button>
                      {lead.phone && <button title="WhatsApp" onClick={() => { setActioningWhatsApp(lead); }}>💬</button>}
                      <button title="Snooze to Tomorrow 11AM" onClick={() => void snoozeLead(lead._id)}>📅</button>
                      <button title="Mark Complete" onClick={() => void completeFollowUp(lead._id)}>✓</button>
                      <button className="crm-row-button" onClick={() => openLead(lead)}>Open</button>
                    </span>
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
        
        <TeamManagement admin={admin} />
      </section>

      {activeLead && (
        <div className="crm-drawer-shell">
          <button className="crm-drawer-backdrop" onClick={closeLead} aria-label="Close lead details" />
          <aside className="crm-drawer">
            <header>
              <div>
                <p className="admin-kicker">Lead profile</p>
                <h3>{activeLead.name}</h3>
                <span>Captured {formatDateTime(activeLead.createdAt)}</span>
              </div>
              <button onClick={closeLead}>Close</button>
            </header>

            <div className="crm-drawer-actions">
              <a href={`tel:${activeLead.phone}`} onClick={() => void logContact(activeLead._id, "call")}>Call</a>
              <a href={`https://wa.me/${phoneDigits(activeLead.phone)}`} target="_blank" rel="noreferrer" onClick={() => void logContact(activeLead._id, "whatsapp")}>WhatsApp</a>
            </div>

            <section className="crm-drawer-grid">
              {canAssignLeads && (
                <label style={{ gridColumn: "1 / -1" }}>
                  Assigned To
                  <select 
                    value={activeLead.assignedTo || ""} 
                    onChange={(event) => void updateLead(activeLead._id, { assignedTo: event.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        👤 {emp.name} - {(stats.employeeStats && stats.employeeStats[emp.id]) || 0} Active Leads
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label>Status<select value={activeLead.status} onChange={(event) => void updateLead(activeLead._id, { status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label>Priority<select value={activeLead.priority} onChange={(event) => void updateLead(activeLead._id, { priority: event.target.value })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
              <label>Source<select disabled={!canAssignLeads} value={activeLead.source || "Website"} onChange={(event) => void updateLead(activeLead._id, { source: event.target.value })}><option value="Website">Website</option><option value="Google Ads">Google Ads</option><option value="Meta Ads">Meta Ads</option><option value="WhatsApp">WhatsApp</option><option value="Manual">Manual</option></select></label>
            </section>

            <section className="crm-drawer-section">
              <h4>Timeline</h4>
              <div className="crm-timeline-slack">
                {(activeLead.events || (activeLead as any).activityLog || []).slice().reverse().map((item: Event, index: number) => (
                  <div key={`${item.timestamp}-${index}`} className="timeline-event">
                    <span className="timeline-icon">
                      {item.type === "creation" ? "🟢" : item.type === "status" ? "🟡" : item.type === "assignment" ? "🔵" : "⚪"}
                    </span>
                    <div className="timeline-content">
                      <strong>{formatDate(item.timestamp)}</strong>
                      <p>{item.performedBy} {item.action.toLowerCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="crm-drawer-section">
              <h4>Notes</h4>
              <div className="crm-notes-list">
                {Array.isArray(activeLead.notes) ? activeLead.notes.map((n, i) => (
                  <div key={i} className="crm-note-item">
                    <strong>{n.author}</strong> <span>{formatDateTime(n.createdAt)}</span>
                    <p>{n.note}</p>
                  </div>
                )) : activeLead.notes ? (
                  <p className="crm-existing-notes">{activeLead.notes as string}</p>
                ) : null}
              </div>
              <fieldset disabled={saving} style={{ all: "unset", display: "contents" }}>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add call note, client response..." />
                <button disabled={!note.trim()} onClick={() => void appendNote()}>Save note</button>
              </fieldset>
            </section>

            <section className="crm-drawer-section">
              <h4>Next Follow-up</h4>
              <div className="crm-drawer-grid">
                <label>Date & Time<input type="datetime-local" value={activeLead.nextFollowUpAt ? new Date(new Date(activeLead.nextFollowUpAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""} onChange={(event) => void updateLead(activeLead._id, { nextFollowUpAt: new Date(event.target.value).toISOString() })} /></label>
                <label>Type<select value={activeLead.followUpType || "Call"} onChange={(event) => void updateLead(activeLead._id, { followUpType: event.target.value as any })}><option>Call</option><option>WhatsApp</option><option>Email</option><option>Meeting</option></select></label>
                <label style={{ gridColumn: "1 / -1" }}>Reason<input type="text" value={activeLead.followUpReason || ""} onChange={(event) => void updateLead(activeLead._id, { followUpReason: event.target.value })} placeholder="Why are we following up?" /></label>
              </div>
            </section>
          </aside>
        </div>
      )}

      {isCreatingLead && (
        <NewLeadModal 
          onClose={() => setIsCreatingLead(false)} 
          onSuccess={() => { setIsCreatingLead(false); void loadLeads(true); }} 
        />
      )}

      {selectedLeads.size > 0 && (
        <div style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", background: "#00ff88", color: "black", padding: "1rem 2rem", borderRadius: "30px", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 10px 30px rgba(0,255,136,0.3)", zIndex: 1000 }}>
          <strong>{selectedLeads.size} leads selected</strong>
          <div style={{ width: "1px", height: "20px", background: "rgba(0,0,0,0.2)" }} />
          {canAssignLeads && (
            <select onChange={(e) => { if(e.target.value) { handleBulkAction('assign', e.target.value); e.target.value = ""; } }} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "0.5rem", borderRadius: "4px", color: "black", outline: "none", cursor: "pointer" }}>
              <option value="">Assign to...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          )}
          {canAssignLeads && (
            <button onClick={() => handleBulkAction('archive')} style={{ background: "black", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>Archive</button>
          )}
          <button onClick={() => setSelectedLeads(new Set())} style={{ background: "transparent", border: "none", color: "black", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
        </div>
      )}

      {actioningCall && (
        <CallOutcomeModal 
          leadId={actioningCall} 
          onClose={() => setActioningCall(null)} 
          onSuccess={() => { setActioningCall(null); loadLeads(true); }} 
        />
      )}

      {actioningWhatsApp && (
        <WhatsAppTemplateModal 
          lead={actioningWhatsApp} 
          employeeName={admin.name.split(" ")[0]}
          onClose={() => setActioningWhatsApp(null)} 
          onSuccess={() => { setActioningWhatsApp(null); loadLeads(true); }} 
        />
      )}

    </main>
  );
}
