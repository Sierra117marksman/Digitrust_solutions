"use client";

import React, { useState, useEffect } from "react";

type InboxItem = {
  id: string;
  leadId: string;
  type: string;
  title: string;
  description: string;
  actionLabel: string;
  phone?: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
};

export default function NeedsAttentionQueue({ onAction }: { onAction: (leadId: string, actionLabel: string, phone?: string) => void }) {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      const res = await fetch("/api/admin/inbox");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setSummary(data.summary || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = () => { fetchInbox(); };
    init();
  }, []);

  const totalCritical = (summary.overdue || 0) + (summary.slaBreaches || 0) + (summary.idle || 0);

  if (loading) return <div style={{ padding: "2rem", color: "#888" }}>Loading Action Queue...</div>;
  if (items.length === 0) return null;

  return (
    <section style={{ margin: "1rem 0", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {summary.overdue > 0 && <span style={{ background: "#fef3c7", color: "#d97706", padding: "6px 12px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: 600 }}>⚠ {summary.overdue} Overdue</span>}
        {summary.slaBreaches > 0 && <span style={{ background: "#fee2e2", color: "#dc2626", padding: "6px 12px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: 600 }}>⚠ {summary.slaBreaches} SLA Breaches</span>}
        {summary.idle > 0 && <span style={{ background: "#ffedd5", color: "#ea580c", padding: "6px 12px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: 600 }}>⚠ {summary.idle} High Priority Idle</span>}
      </div>

      <div className="crm-table-container">
        <table className="admin-team-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "2px solid #e2e8f0", fontSize: "0.85rem", color: "#64748b" }}>Lead / Priority</th>
              <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "2px solid #e2e8f0", fontSize: "0.85rem", color: "#64748b" }}>Reason</th>
              <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "2px solid #e2e8f0", fontSize: "0.85rem", color: "#64748b" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(new Map(items.filter(i => i.priority === "high" || i.type === "sla" || i.type === "idle").map(i => [i.id, i])).values()).slice(0, 5).map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem" }}>
                  <strong>{item.title}</strong>
                  <br />
                  <span style={{ fontSize: "12px", padding: "2px 6px", borderRadius: "4px", background: item.type === "sla" || item.type === "idle" ? "#fee2e2" : "#f1f5f9", color: item.type === "sla" || item.type === "idle" ? "#dc2626" : "#334155", display: "inline-block", marginTop: "4px" }}>
                    {item.priority.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{item.description}</td>
                <td style={{ padding: "1rem" }}>
                  <button 
                    onClick={() => onAction(item.leadId, item.actionLabel, item.phone)}
                    style={{ background: "#3b82f6", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}
                  >
                    {item.actionLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>You are all caught up!</div>
        )}
      </div>
      
      {totalCritical > 5 && (
        <button style={{ marginTop: "1rem", background: "transparent", border: "1px solid #e2e8f0", color: "#64748b", padding: "0.75rem", borderRadius: "8px", cursor: "pointer", width: "100%", fontWeight: 500 }}>
          View Full Queue ({totalCritical - 5} more)
        </button>
      )}
    </section>
  );
}
