"use client";



import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import NewLeadModal from "./NewLeadModal";
import CallOutcomeModal from "./CallOutcomeModal";
import WhatsAppTemplateModal from "./WhatsAppTemplateModal";
import NeedsAttentionQueue from "./NeedsAttentionQueue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contactInfo } from "@/content/contact";
import { logError } from "../utils/logger";
import TeamManagement from "./TeamManagement";
import ReminderProvider from "../components/ReminderEngine/ReminderProvider";
import LeadContextAlert from "../components/ReminderEngine/LeadContextAlert";
import RecoveryCenter from "./RecoveryCenter";

const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const priorities = ["High", "Medium", "Low"];
const temperatures = ["Hot", "Warm", "Cold"];
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
  clientSummary?: string;
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
  recentActivityFeed?: unknown[];
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
    if (ageHours < 2) return { color: "#00ff88", text: "New", title: "New Lead (< 2 hours old)" };
    if (ageHours < 8) return { color: "#ffcc00", text: "Action Needed", title: "Action Needed: Uncontacted for 2-8 hours" };
    return { color: "#ff4444", text: "At Risk", title: "At Risk: Uncontacted for over 8 hours" };
  };

  const getHealth = (lead: Lead) => {
    if (!lead.lastContactedAt) return { color: "#ff4444", text: "🔴 Idle", title: "Idle: Never contacted" };
    const days = (Date.now() - new Date(lead.lastContactedAt).getTime()) / 86400000;
    if (days < 2) return { color: "#00ff88", text: "🟢 Healthy", title: "Healthy: Contacted within the last 48 hours" };
    if (days < 5) return { color: "#ffcc00", text: "🟡 Needs Attention", title: "Needs Attention: Ignored for 2-5 days" };
    return { color: "#ff4444", text: "🔴 At Risk", title: "At Risk: Ignored for over 5 days" };
  };

function formatDateTime(value?: string) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatMoney(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState("");
  
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [note, setNote] = useState("");

  const [originalLead, setOriginalLead] = useState<Lead | null>(null);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [actioningCall, setActioningCall] = useState<string | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "queue" | "activity" | "analytics" | "team" | "recovery">("dashboard");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recentFeed, setRecentFeed] = useState<Record<string, unknown>[]>([]);

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
    } catch (e: unknown) {
      toast.error((e as Error).message, { id: loadingToast });
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
      if (data.recentActivityFeed) setRecentFeed(data.recentActivityFeed as Record<string, unknown>[]);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      .flatMap((lead) => (lead.events || (lead as Record<string, unknown>).activityLog as Event[] || []).map((item: Event) => ({ ...item, leadName: lead.name })))
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
    <ReminderProvider
      items={leads.map(l => ({
        id: l._id,
        title: l.name,
        subtitle: l.phone,
        details: l.clientSummary || (l.notes && l.notes.length > 0 ? l.notes[0].note : undefined),
        scheduledAt: l.nextFollowUpAt || '',
        status: l.followUpStatus || 'Pending',
        originalPayload: l
      })).filter(i => i.scheduledAt)}
      onCompleteItem={async (id) => { await updateLead(id, { followUpStatus: 'Completed' }); }}
      onOpenItem={(item) => setActiveLead(item.originalPayload as Lead)}
      contextActiveId={activeLead?._id || null}
    >
      <main className="crm-os">
        <style>{`
        .crm-tooltip-container { position: relative; display: inline-flex; }
        .crm-tooltip-text { visibility: hidden; background-color: #1e293b; color: #f8fafc; text-align: center; border-radius: 8px; padding: 8px 12px; position: absolute; z-index: 99999; bottom: 125%; left: 50%; transform: translateX(-50%) translateY(10px); opacity: 0; transition: opacity 0.2s, transform 0.2s, visibility 0.2s; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2); font-size: 13px; font-weight: 500; white-space: nowrap; pointer-events: none; }
        .crm-tooltip-text::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: #1e293b transparent transparent transparent; }
        .crm-tooltip-container:hover .crm-tooltip-text { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
      `}</style>
      <aside className="crm-os-sidebar">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Digitrust Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '1rem', background: 'white', borderRadius: '8px', padding: '4px' }} />
          <h1>Digitrust CRM</h1>
          <p>{admin.name}</p>
          <small>{admin.role.replace(/_/g, " ")}</small>
        </div>
        <nav aria-label="CRM sections" className="crm-nav">
          <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>Executive Dashboard</button>
          <button onClick={() => setActiveTab("queue")} className={activeTab === "queue" ? "active" : ""}>Action Queue</button>
          <button onClick={() => setActiveTab("leads")} className={activeTab === "leads" ? "active" : ""}>Lead Workspace</button>
          {(admin.role === "owner" || admin.role === "manager") && (
            <>
              <button onClick={() => setActiveTab("activity")} className={activeTab === "activity" ? "active" : ""}>Activities</button>
              <button onClick={() => setActiveTab("analytics")} className={activeTab === "analytics" ? "active" : ""}>Analytics</button>
              <button onClick={() => setActiveTab("team")} className={activeTab === "team" ? "active" : ""}>Team</button>
            </>
          )}
          {admin.role === "owner" && (
            <button onClick={() => setActiveTab("recovery")} className={activeTab === "recovery" ? "active" : ""}>Recovery Center</button>
          )}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button className="crm-nav-bottom">Settings</button>
          <form action="/api/admin/logout" method="post">
            <button className="crm-logout-small">Logout</button>
          </form>
        </div>
      </aside>

      <section className="crm-workspace">
        {activeTab === "dashboard" && (
          <>
        <header className="crm-commandbar" style={{ justifyContent: 'space-between', padding: '16px 32px', background: 'white', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
          <div style={{ flex: 1, maxWidth: '600px' }}>
            <div className="crm-search-bar" style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ marginRight: '8px' }}>🔍</span>
              <input type="text" placeholder="Search Name, Phone, Email, Company, Service..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '14px' }} />
            </div>
          </div>
          <div className="crm-command-actions" style={{ gap: '16px', marginLeft: '24px' }}>
            <button className="icon-btn" title="Quick Add" onClick={() => setIsCreatingLead(true)} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', borderStyle: 'solid' }}>➕</button>
            <button className="icon-btn" title="Sales Playbook & Glossary" onClick={() => setShowGlossary(true)} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', borderStyle: 'solid' }}>❓</button>
            <button className="icon-btn" title="Notifications" style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', borderStyle: 'solid' }}>🔔</button>
            <button className="icon-btn" title="Profile" style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', borderStyle: 'solid' }}>👤</button>
          </div>
        </header>

        {error && <p className="crm-error" style={{ margin: "16px 32px 0 32px" }}>{error}</p>}

        <div className="workflow-hub-header" style={{ padding: '32px 32px 0 32px', maxWidth: '900px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Good Morning {admin.name.split(' ')[0]} 👋</h1>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 24px 0' }}>{stats.overdue + stats.dueToday} leads need attention today.</p>
          
          <button className="hero-start-btn" onClick={() => {
             if (nextCallLead) { openLead(nextCallLead); } else { const pending = leads.filter(l => l.nextFollowUpAt && l.followUpStatus !== 'Completed'); if (pending.length > 0) openLead(pending[0]); }
          }} style={{ background: '#0f172a', color: 'white', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '32px', display: 'inline-block' }}>
            Start Working
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
            <div className="mission-stat">
              <span style={{ color: '#ef4444' }}>🔴</span> <strong>{stats.overdue}</strong> Overdue
            </div>
            <div className="mission-stat">
              <span style={{ color: '#eab308' }}>🟡</span> <strong>{stats.dueToday}</strong> Follow-ups
            </div>
            <div className="mission-stat">
              <span style={{ color: '#22c55e' }}>🟢</span> <strong>{stats.new}</strong> New Leads
            </div>
          </div>
        </div>
        
        <section style={{ padding: '0 32px 32px 32px' }} id="dashboard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Executive Dashboard</h2>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
              This Month ▾
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {(() => {
              const totalLeads = leads.length;
              const newLeads = leads.filter(l => l.status === "New").length;
              const wonLeads = leads.filter(l => l.status === "Won").length;
              const pipelineVal = leads.filter(l => l.status !== "Lost").reduce((sum, l) => {
                if (l.wonValue) return sum + Number(l.wonValue);
                if (l.budgetRange) {
                  const m = l.budgetRange.match(/\d+/g);
                  if (m) return sum + Number(m[m.length - 1]);
                }
                return sum + 5000;
              }, 0);
              
              const formatMoneyVal = (v: number) => {
                if (v >= 10000000) return "₹" + (v / 10000000).toFixed(2) + "Cr";
                if (v >= 100000) return "₹" + (v / 100000).toFixed(2) + "L";
                if (v >= 1000) return "₹" + (v / 1000).toFixed(1) + "k";
                return "₹" + v.toLocaleString('en-IN');
              };

              const cards = [
                { title: "Total Leads", val: totalLeads.toLocaleString(), badge: "+12%", color: "#9333ea", icon: "👥", path: "M0,35 C20,35 30,15 50,25 C70,35 80,5 100,5" },
                { title: "New Leads", val: newLeads.toLocaleString(), badge: "+8%", color: "#3b82f6", icon: "👤", path: "M0,25 C20,25 30,35 50,20 C70,5 80,15 100,10" },
                { title: "Pipeline Value", val: formatMoneyVal(pipelineVal), badge: "↑ 2%", color: "#f59e0b", icon: "💰", path: "M0,35 C20,35 30,25 50,30 C70,35 80,10 100,5" },
                { title: "Deals Won", val: wonLeads.toLocaleString(), badge: "+15%", color: "#10b981", icon: "🏆", path: "M0,30 C20,30 30,15 50,25 C70,35 80,5 100,5" }
              ];

              return cards.map(c => (
                <div key={c.title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px 24px 0 24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: c.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        {c.icon}
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{c.title}</div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{c.val}</div>
                      </div>
                    </div>
                    <div style={{ background: c.color + '20', color: c.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                      {c.badge}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '24px', height: '60px', position: 'relative', marginLeft: '-24px', marginRight: '-24px', width: 'calc(100% + 48px)' }}>
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <path d={c.path} fill="none" stroke={c.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={`${c.path} L100,50 L0,50 Z`} fill={`url(#grad-${c.title.replace(/\s/g, '')})`} opacity="0.15" />
                      <defs>
                        <linearGradient id={`grad-${c.title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={c.color} stopOpacity="1" />
                          <stop offset="100%" stopColor={c.color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              ));
            })()}
          </div>
        </section>
        </>
        )}

        {activeTab === "leads" && (
        <>
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
                  <span style={{width:"40px"}}><input type="checkbox" onChange={selectAll} checked={selectedLeads.size > 0 && selectedLeads.size === leads.length} /></span>
                  <span>Lead</span>
                  <span>Service</span>
                  <span>Health / SLA</span>
                  <span>Status</span>
                  <span>Follow-up</span>
                  <span>Action</span>
                </div>
                {leads.length ? leads.map((lead) => (
                  <div className="crm-table-row crm-rich-row" key={lead._id} style={{ background: selectedLeads.has(lead._id) ? "rgba(0,255,136,0.05)" : undefined }}>
                    <span style={{width:"40px"}}><input type="checkbox" checked={selectedLeads.has(lead._id)} onChange={() => toggleSelect(lead._id)} /></span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <strong style={{ fontSize: '14px' }}>{lead.name}</strong>
                      <small style={{color: "#64748b", fontSize: "12px"}}>{lead.phone}</small>
                      <small style={{color: "#64748b", fontSize: "12px"}}>{lead.email}</small>
                    </span>
                    <span style={{fontWeight: 500}}>{lead.service || "General"}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="crm-tooltip-container">
                        <span className="crm-badge" style={{background: getSLA(lead).color + '22', color: getSLA(lead).color, cursor: 'help'}}>{getSLA(lead).text}</span>
                        <span className="crm-tooltip-text">{getSLA(lead).title}</span>
                      </div>
                      <div className="crm-tooltip-container">
                        <span className="crm-badge" style={{background: getHealth(lead).color + '22', color: getHealth(lead).color, cursor: 'help'}}>{getHealth(lead).text}</span>
                        <span className="crm-tooltip-text">{getHealth(lead).title}</span>
                      </div>
                    </span>
                    <span>
                      <select 
                        className="crm-select-badge"
                        value={lead.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          let wonVal = lead.wonValue;
                          if (val === "Won") {
                            const input = window.prompt("Enter final project value (₹):", "0");
                            if (input !== null) wonVal = parseInt(input) || 0;
                            else return; // Cancelled
                          }
                          fetch('/api/admin/leads/' + lead._id, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: val, wonValue: wonVal })
                          }).then(res => res.json()).then(data => {
                            if (data.success) {
                              setLeads(leads.map(l => l._id === lead._id ? { ...l, status: val, wonValue: wonVal } : l));
                            }
                          });
                        }}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </span>
                    <span style={{fontSize: "0.8rem", color: "#666"}}>{formatDate(lead.nextFollowUpAt)}</span>
                    <span className="quick-actions" style={{display: "flex", gap: "6px", alignItems: "center"}}>
                      <button className="crm-row-button primary" onClick={() => openLead(lead)} title="Open Profile" style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#ffffff', color: '#0f172a' }}>Open</button>
                      <button className="icon-btn" onClick={() => { window.location.href = `tel:${lead.phone}`; setActioningCall(lead._id); }} title="Call" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>📞</button>
                      {lead.phone && <button className="icon-btn" onClick={() => setActioningWhatsApp(lead)} title="WhatsApp" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>💬</button>}
                      <select 
                        className="crm-action-dropdown"
                        value="" 
                        onChange={(e) => {
                          const action = e.target.value;
                          if (!action) return;
                          if (action === "snooze") snoozeLead(lead._id);
                          if (action === "complete") completeFollowUp(lead._id);
                        }}
                        style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', width: '20px' }}
                      >
                        <option value="">⋮</option>
                        <option value="snooze">Snooze 24h</option>
                        <option value="complete">Mark Complete</option>
                      </select>
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


          </aside>
        </section>
        </>
        )}

      {activeTab === "queue" && (
        <div style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Action Queue</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Leads that require immediate attention (SLA breaches, Overdue follow-ups, Idle VIPs).</p>
          <NeedsAttentionQueue 
             onAction={(leadId, action, phone) => {
               if (action === "Call Now" && phone) {
                 window.location.href = `tel:${phone}`;
                 const l = leads.find((l) => l._id === leadId);
                 if (l) setActioningCall(l._id);
               } else {
                 const l = leads.find((l) => l._id === leadId);
                 if (l) openLead(l);
               }
             }}
          />
        </div>
      )}

      {activeTab === "activity" && (
        <div className="crm-panel">
          <div className="crm-panel-head">
            <div>
              <p className="admin-kicker">Admin Only</p>
              <h2>Complete Activity Log</h2>
            </div>
          </div>
          <div className="crm-recent-list" style={{ padding: '24px' }}>
            {recentActivity.length ? recentActivity.map((event: { leadName?: string; action?: string; timestamp?: string; performedBy?: string }, i: number) => (
              <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #edf5f8' }}>
                <strong>{event.leadName}</strong> - {event.action}
                <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '4px' }}>{formatDateTime(event.timestamp)} • {event.performedBy}</div>
              </div>
            )) : (
              <p className="crm-empty">No recent activity.</p>
            )}
          </div>
        </div>
      )}

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
            
            <LeadContextAlert leadId={activeLead._id} />

            <div className="crm-drawer-actions" style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
              <a href={`tel:${activeLead.phone}`} onClick={() => void logContact(activeLead._id, "call")} style={{ flex: 1, textAlign: 'center', background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                📞 Call
              </a>
              <a href={`https://wa.me/${phoneDigits(activeLead.phone)}`} target="_blank" rel="noreferrer" onClick={() => void logContact(activeLead._id, "whatsapp")} style={{ flex: 1, textAlign: 'center', background: '#10b981', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                💬 WhatsApp
              </a>
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
                {(activeLead.events || (activeLead as Record<string, unknown>).activityLog as Event[] || []).slice().reverse().map((item: Event, index: number) => (
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
              <h4 style={{ marginBottom: '16px' }}>Interaction Timeline</h4>
              <fieldset disabled={saving} style={{ all: "unset", display: "flex", gap: "8px", marginBottom: "24px" }}>
                <input 
                  type="text"
                  value={note} 
                  onChange={(event) => setNote(event.target.value)} 
                  placeholder="Quickly add a call note or update..." 
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <button 
                  disabled={!note.trim()} 
                  onClick={() => void appendNote()}
                  style={{ padding: '0 24px', background: '#0f172a', color: 'white', borderRadius: '8px', fontWeight: 500, opacity: note.trim() ? 1 : 0.5 }}
                >Post</button>
              </fieldset>

              <div className="crm-notes-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Array.isArray(activeLead.notes) ? activeLead.notes.map((n, i) => (
                  <div key={i} className="crm-note-item" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <strong style={{ color: '#0f172a' }}>{n.author}</strong> 
                      <span style={{ color: '#64748b' }}>{formatDateTime(n.createdAt)}</span>
                    </div>
                    <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: 1.5 }}>{n.note}</p>
                  </div>
                )) : activeLead.notes ? (
                  <p className="crm-existing-notes">{activeLead.notes as string}</p>
                ) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No timeline events yet.</p>}
              </div>
            </section>

            <section className="crm-drawer-section" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '12px' }}>📝 Executive Summary / Client Needs</h4>
              <textarea 
                placeholder="Write a clear summary of what this client needs, budget constraints, or other key reporting details..." 
                value={activeLead.clientSummary || ""}
                onChange={(e) => void updateLead(activeLead._id, { clientSummary: e.target.value })}
                onBlur={(e) => void updateLead(activeLead._id, { clientSummary: e.target.value })}
                style={{ 
                  width: '100%', minHeight: '100px', padding: '16px', borderRadius: '8px', 
                  border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '14px', 
                  color: '#334155', resize: 'vertical', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                  fontFamily: 'inherit'
                }} 
              />
            </section>

            <section className="crm-drawer-section">
              <h4>Lead Qualification</h4>
              <div className="crm-drawer-grid">
                <label>Date & Time<input type="datetime-local" value={activeLead.nextFollowUpAt ? new Date(new Date(activeLead.nextFollowUpAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""} onChange={(event) => void updateLead(activeLead._id, { nextFollowUpAt: new Date(event.target.value).toISOString() })} /></label>
                <label>Type<select value={activeLead.followUpType || "Call"} onChange={(event) => void updateLead(activeLead._id, { followUpType: event.target.value as "Call" | "WhatsApp" | "Email" | "Meeting" })}><option>Call</option><option>WhatsApp</option><option>Email</option><option>Meeting</option></select></label>
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

      {showGlossary && (
        <div className="crm-modal" onClick={() => setShowGlossary(false)}>
          <div className="crm-modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Sales Playbook & Glossary</h2>
              <button onClick={() => setShowGlossary(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#0f172a' }}>SLA (Response Time)</h3>
              <p style={{ color: '#64748b', marginBottom: '12px', fontSize: '14px' }}>Measures how quickly we respond to new leads.</p>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #00ff88' }}><strong>New:</strong> Lead arrived &lt; 2 hours ago.</div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ffcc00' }}><strong>Action Needed:</strong> Waiting 2-8 hours without contact.</div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ff4444' }}><strong>At Risk:</strong> Ignored &gt; 8 hours.</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#0f172a' }}>Lead Health (Engagement)</h3>
              <p style={{ color: '#64748b', marginBottom: '12px', fontSize: '14px' }}>Measures how consistently we stay in touch with active leads.</p>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #00ff88' }}><strong>Healthy:</strong> Contacted in the last 48 hours.</div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ffcc00' }}><strong>Needs Attention:</strong> No contact for 2-5 days.</div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ff4444' }}><strong>At Risk:</strong> Ignored &gt; 5 days.</div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #94a3b8' }}><strong>Idle:</strong> Never contacted.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (() => {
        const wonLeads = leads.filter(l => l.status === "Won");
        const lostLeads = leads.filter(l => l.status === "Lost");
        const totalResolved = wonLeads.length + lostLeads.length;
        const conversionRate = totalResolved > 0 ? Math.round((wonLeads.length / totalResolved) * 100) : 0;
        
        const totalRevenue = wonLeads.reduce((sum, l) => sum + (l.wonValue || 0), 0);
        const avgDealSize = wonLeads.length > 0 ? Math.round(totalRevenue / wonLeads.length) : 0;
        
        const sourceMap = leads.reduce((acc, l) => { const s = l.source || "Direct"; acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>);
        const sources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]);
        
        const serviceMap = leads.reduce((acc, l) => { const s = l.service || "General"; acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>);
        const services = Object.entries(serviceMap).sort((a, b) => b[1] - a[1]);

        const formatINR = (v: number) => {
          if (v >= 10000000) return "₹" + (v / 10000000).toFixed(2) + "Cr";
          if (v >= 100000) return "₹" + (v / 100000).toFixed(2) + "L";
          if (v >= 1000) return "₹" + (v / 1000).toFixed(1) + "k";
          return "₹" + v.toLocaleString('en-IN');
        };

        return (
          <div style={{ padding: '32px', maxWidth: '1200px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Analytics & Performance</h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Weekly insights and team performance metrics.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>Conversion Rate</div>
                <div style={{ fontSize: '48px', fontWeight: 800 }}>{conversionRate}%</div>
                <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', display: 'inline-block', alignSelf: 'flex-start', fontSize: '13px' }}>
                  Based on {totalResolved} resolved leads
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', fontSize: '150px', opacity: 0.05 }}>📈</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#d1fae5', fontWeight: 600, marginBottom: '8px' }}>Avg Deal Size</div>
                <div style={{ fontSize: '48px', fontWeight: 800 }}>{formatINR(avgDealSize)}</div>
                <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.1)', padding: '8px 12px', borderRadius: '8px', display: 'inline-block', alignSelf: 'flex-start', fontSize: '13px' }}>
                  From {wonLeads.length} won deals
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', fontSize: '150px', opacity: 0.1 }}>💰</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Top Lead Sources</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sources.slice(0, 5).map(([source, count]) => (
                    <div key={source}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                        <strong style={{ color: '#334155' }}>{source}</strong>
                        <span style={{ color: '#64748b' }}>{count} leads</span>
                      </div>
                      <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(count / leads.length) * 100}%`, background: '#3b82f6', height: '100%', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  ))}
                  {sources.length === 0 && <p style={{ color: '#94a3b8' }}>No source data available.</p>}
                </div>
              </div>

              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Service Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {services.slice(0, 5).map(([service, count]) => (
                    <div key={service}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                        <strong style={{ color: '#334155' }}>{service}</strong>
                        <span style={{ color: '#64748b' }}>{count} leads</span>
                      </div>
                      <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(count / leads.length) * 100}%`, background: '#8b5cf6', height: '100%', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && <p style={{ color: '#94a3b8' }}>No service data available.</p>}
                </div>
              </div>
            </div>
            
          </div>
        );
      })()}

      {activeTab === "team" && (
        <div style={{ padding: '32px' }}>
          <TeamManagement admin={admin} />
        </div>
      )}

      {activeTab === "recovery" && admin.role === "owner" && (
        <div style={{ padding: '32px' }}>
          <RecoveryCenter />
        </div>
      )}

      </section>
      </main>
    </ReminderProvider>
  );
}
