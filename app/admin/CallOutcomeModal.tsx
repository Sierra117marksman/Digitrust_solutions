"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface CallOutcomeModalProps {
  leadId: string;
  onClose: () => void;
  onSuccess: (updates: Record<string, unknown>) => void;
}

export default function CallOutcomeModal({ leadId, onClose, onSuccess }: CallOutcomeModalProps) {
  const [outcome, setOutcome] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-suggestions based on outcome
  const getSuggestion = (val: string) => {
    const d = new Date();
    if (val === "Busy") {
      d.setDate(d.getDate() + 1);
      d.setHours(11, 0, 0, 0);
    } else if (val === "No Answer") {
      d.setDate(d.getDate() + 1);
      d.setHours(15, 0, 0, 0);
    } else if (val === "Interested") {
      d.setDate(d.getDate() + 2);
      d.setHours(14, 0, 0, 0);
    } else if (val === "Callback Tomorrow") {
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
    } else {
      return ""; // Wrong number or other
    }
    
    // Convert to datetime-local string
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const handleOutcomeSelect = (val: string) => {
    setOutcome(val);
    setCustomTime(getSuggestion(val));
    
    if (val === "Wrong Number") {
      handleSubmit(val, "", "Lost");
    }
  };

  const handleSubmit = async (selectedOutcome: string, timeStr: string, statusOverride?: string) => {
    setLoading(true);
    
    const updates: Record<string, unknown> = {
      callOutcome: selectedOutcome,
      followUpStatus: "Completed"
    };

    if (timeStr) {
      updates.nextFollowUpAt = new Date(timeStr).toISOString();
      updates.followUpStatus = "Pending";
      updates.followUpReason = `Follow up after ${selectedOutcome}`;
    }

    if (statusOverride) {
      updates.status = statusOverride;
      if (statusOverride === "Lost") updates.lostReason = selectedOutcome;
    }

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, ...updates })
      });
      if (!res.ok) throw new Error("Failed to save outcome");
      
      toast.success("Outcome saved");
      onSuccess(updates);
    } catch (e: unknown) {
      toast.error((e as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crm-drawer-shell" style={{ zIndex: 1000, alignItems: "center", justifyContent: "center" }}>
      <div className="crm-drawer-backdrop" onClick={onClose} />
      <div style={{ background: "#1a1a1a", padding: "2rem", borderRadius: "8px", width: "100%", maxWidth: "400px", zIndex: 1001 }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>Call Outcome</h3>
        
        {!outcome ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button onClick={() => handleOutcomeSelect("Interested")} style={{ padding: "0.75rem", background: "rgba(0,255,136,0.1)", color: "#00ff88", border: "1px solid #00ff88", borderRadius: "4px", cursor: "pointer" }}>Interested</button>
            <button onClick={() => handleOutcomeSelect("Busy")} style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid #333", borderRadius: "4px", cursor: "pointer" }}>Busy</button>
            <button onClick={() => handleOutcomeSelect("No Answer")} style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid #333", borderRadius: "4px", cursor: "pointer" }}>No Answer</button>
            <button onClick={() => handleOutcomeSelect("Callback Tomorrow")} style={{ padding: "0.75rem", background: "rgba(255,204,0,0.1)", color: "#ffcc00", border: "1px solid #ffcc00", borderRadius: "4px", cursor: "pointer" }}>Callback Tomorrow</button>
            <button onClick={() => handleOutcomeSelect("Wrong Number")} style={{ padding: "0.75rem", background: "rgba(255,68,68,0.1)", color: "#ff4444", border: "1px solid #ff4444", borderRadius: "4px", cursor: "pointer" }}>Wrong Number</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ margin: 0 }}>Outcome: <strong>{outcome}</strong></p>
            {outcome !== "Wrong Number" && (
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#888" }}>Next Follow-up Suggestion</span>
                <input 
                  type="datetime-local" 
                  value={customTime} 
                  onChange={(e) => setCustomTime(e.target.value)}
                  style={{ padding: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "white", borderRadius: "4px" }}
                />
              </label>
            )}
            
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={() => setOutcome("")} style={{ flex: 1, padding: "0.75rem", background: "transparent", border: "1px solid #333", color: "white", borderRadius: "4px", cursor: "pointer" }}>Back</button>
              <button 
                onClick={() => handleSubmit(outcome, customTime)} 
                disabled={loading}
                style={{ flex: 2, padding: "0.75rem", background: "#00ff88", border: "none", color: "black", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}
              >
                {loading ? "Saving..." : "Save Outcome"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
