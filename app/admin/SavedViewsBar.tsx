"use client";
/* eslint-disable */

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface View {
  _id: string;
  name: string;
  isShared: boolean;
  filters: {
    statusFilter: string;
    sourceFilter: string;
    timelineFilter: string;
    assigneeFilter: string;
  };
}

export default function SavedViewsBar({ 
  onApplyView, 
  currentFilters,
  role
}: { 
  onApplyView: (filters: any) => void, 
  currentFilters: any,
  role: string 
}) {
  const [views, setViews] = useState<View[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    fetch("/api/admin/views")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setViews(d);
      });
  }, []);

  const handleSaveView = async () => {
    if (!newViewName.trim()) return;
    
    const payload = {
      name: newViewName,
      isShared,
      filters: currentFilters
    };

    const res = await fetch("/api/admin/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const saved = await res.json();
      setViews([...views, saved]);
      setShowSaveModal(false);
      setNewViewName("");
      toast.success("View saved!");
    } else {
      toast.error("Failed to save view");
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
      <button 
        onClick={() => onApplyView({ statusFilter: "", sourceFilter: "", timelineFilter: "", assigneeFilter: "" })}
        style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap" }}
      >
        All Leads
      </button>
      
      {views.map(v => (
        <button 
          key={v._id}
          onClick={() => onApplyView(v.filters)}
          style={{ 
            padding: "0.5rem 1rem", 
            background: "rgba(0,153,255,0.1)", 
            color: "#0099ff", 
            border: "1px solid rgba(0,153,255,0.3)", 
            borderRadius: "4px", 
            cursor: "pointer",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {v.isShared && <span title="Shared Team View">👥</span>}
          {v.name}
        </button>
      ))}

      <button 
        onClick={() => setShowSaveModal(true)}
        style={{ padding: "0.5rem 1rem", background: "transparent", color: "#00ff88", border: "1px dashed #00ff88", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap" }}
      >
        + Save Current Filter
      </button>

      {showSaveModal && (
        <div className="crm-drawer-shell" style={{ zIndex: 1000, alignItems: "center", justifyContent: "center" }}>
          <div className="crm-drawer-backdrop" onClick={() => setShowSaveModal(false)} />
          <div style={{ background: "#1a1a1a", padding: "2rem", borderRadius: "8px", width: "100%", maxWidth: "400px", zIndex: 1001 }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "white" }}>Save View</h3>
            <input 
              type="text" 
              value={newViewName}
              onChange={e => setNewViewName(e.target.value)}
              placeholder="e.g. Meta Ads High Priority"
              style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", background: "#111", border: "1px solid #333", color: "white", borderRadius: "4px" }}
            />
            
            {role !== "employee" && (
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#aaa", marginBottom: "1.5rem" }}>
                <input type="checkbox" checked={isShared} onChange={e => setIsShared(e.target.checked)} />
                Share with entire team
              </label>
            )}

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button onClick={() => setShowSaveModal(false)} style={{ padding: "0.75rem 1rem", background: "transparent", border: "1px solid #333", color: "white", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveView} style={{ padding: "0.75rem 1.5rem", background: "#00ff88", border: "none", color: "black", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}>Save View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
