"use client";
/* eslint-disable */

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

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

export default function ActionCenter({ onAction }: { onAction: (leadId: string, actionLabel: string, phone?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      const res = await fetch("/api/admin/inbox");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInbox();
    
    let interval: ReturnType<typeof setInterval>;
    
    const handleVisibilityChange = () => {
      clearInterval(interval);
      if (document.visibilityState === "visible") {
        fetchInbox();
        interval = setInterval(fetchInbox, 60000);
      } else {
        interval = setInterval(fetchInbox, 300000); // 5 mins when hidden
      }
    };

    interval = setInterval(fetchInbox, 60000);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{ 
          background: "transparent", 
          border: "1px solid rgba(255,255,255,0.2)", 
          padding: "0.5rem 1rem", 
          borderRadius: "8px", 
          color: "white", 
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        <span>Inbox</span>
        {items.length > 0 && (
          <span style={{ background: "#ff4444", borderRadius: "12px", padding: "2px 8px", fontSize: "0.8rem", fontWeight: "bold" }}>
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "0.5rem",
          width: "360px",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "8px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          zIndex: 100,
          maxHeight: "500px",
          overflowY: "auto"
        }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>Actions Needed</h3>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}>✕</button>
          </div>
          
          {loading && items.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Loading...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>All caught up! 🎉</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {items.map(item => (
                <div key={item.id} style={{ padding: "1rem", borderBottom: "1px solid #2a2a2a", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      padding: "2px 6px", 
                      borderRadius: "4px",
                      background: item.priority === "high" ? "rgba(255, 68, 68, 0.2)" : item.priority === "medium" ? "rgba(255, 204, 0, 0.2)" : "rgba(0, 255, 136, 0.2)",
                      color: item.priority === "high" ? "#ff4444" : item.priority === "medium" ? "#ffcc00" : "#00ff88"
                    }}>
                      {item.priority === "high" ? "🔴 Overdue" : item.priority === "medium" ? "🟡 Today" : "🟢 New"}
                    </span>
                    <strong style={{ fontSize: "0.9rem" }}>{item.title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#aaa" }}>{item.description}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <button 
                      onClick={() => { onAction(item.leadId, item.actionLabel, item.phone); setOpen(false); }}
                      style={{ 
                        background: "rgba(255,255,255,0.1)", 
                        border: "none", 
                        padding: "0.4rem 0.8rem", 
                        borderRadius: "4px", 
                        color: "white", 
                        cursor: "pointer", 
                        fontSize: "0.8rem" 
                      }}
                    >
                      {item.actionLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
