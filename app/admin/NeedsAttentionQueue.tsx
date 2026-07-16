"use client";
/* eslint-disable */

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
  const [summary, setSummary] = useState<any>({});
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
    fetchInbox();
  }, []);

  const totalCritical = (summary.overdue || 0) + (summary.slaBreaches || 0) + (summary.idle || 0);

  if (loading) return <div style={{ padding: "2rem", color: "#888" }}>Loading Action Queue...</div>;
  if (items.length === 0) return null;

  return (
    <section style={{ margin: "2rem 0", background: "rgba(255, 68, 68, 0.05)", border: "1px solid rgba(255, 68, 68, 0.2)", borderRadius: "12px", padding: "1.5rem" }}>
      <h3 style={{ margin: "0 0 1rem 0", color: "#ff4444", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>🔥</span> Needs Attention
      </h3>
      
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
        {summary.overdue > 0 && <span style={{ color: "#ffcc00", fontSize: "0.9rem" }}>⚠ {summary.overdue} Overdue Follow-ups</span>}
        {summary.slaBreaches > 0 && <span style={{ color: "#ff4444", fontSize: "0.9rem" }}>⚠ {summary.slaBreaches} SLA Breaches</span>}
        {summary.idle > 0 && <span style={{ color: "#ff8800", fontSize: "0.9rem" }}>⚠ {summary.idle} High Priority Idle</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.filter(i => i.priority === "high" || i.type === "sla" || i.type === "idle").slice(0, 5).map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <strong style={{ display: "block", color: "white", marginBottom: "0.25rem" }}>{item.title}</strong>
              <span style={{ fontSize: "0.85rem", color: "#aaa" }}>{item.description}</span>
            </div>
            <button 
              onClick={() => onAction(item.leadId, item.actionLabel, item.phone)}
              style={{ 
                background: item.type === "sla" || item.type === "idle" ? "#ff4444" : "rgba(255,255,255,0.1)", 
                color: item.type === "sla" || item.type === "idle" ? "white" : "white",
                border: "none", 
                padding: "0.5rem 1rem", 
                borderRadius: "4px", 
                cursor: "pointer",
                fontWeight: item.type === "sla" || item.type === "idle" ? "bold" : "normal"
              }}
            >
              {item.actionLabel}
            </button>
          </div>
        ))}
      </div>
      
      {totalCritical > 5 && (
        <button style={{ marginTop: "1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", width: "100%" }}>
          View Full Queue ({totalCritical - 5} more)
        </button>
      )}
    </section>
  );
}
