"use client";
/* eslint-disable */

import React from "react";

interface ExportPreviewModalProps {
  leads: any[];
  onClose: () => void;
  onConfirm: () => void;
}

export default function ExportPreviewModal({ leads, onClose, onConfirm }: ExportPreviewModalProps) {
  const previewRows = leads.slice(0, 3);

  return (
    <div className="crm-drawer-shell" style={{ zIndex: 1000, alignItems: "center", justifyContent: "center" }}>
      <div className="crm-drawer-backdrop" onClick={onClose} />
      <div style={{ background: "#1a1a1a", padding: "2rem", borderRadius: "8px", width: "100%", maxWidth: "600px", zIndex: 1001 }}>
        <h3 style={{ margin: "0 0 1rem 0", color: "white" }}>Export Preview</h3>
        
        <div style={{ padding: "1rem", background: "rgba(0,153,255,0.1)", borderRadius: "8px", border: "1px solid rgba(0,153,255,0.3)", marginBottom: "1.5rem" }}>
          <strong style={{ color: "#0099ff", fontSize: "1.2rem" }}>{leads.length} Rows</strong> will be exported.
        </div>

        <p style={{ color: "#aaa", marginBottom: "0.5rem" }}>Preview of first 3 rows:</p>
        <div style={{ overflowX: "auto", marginBottom: "1.5rem", borderRadius: "4px", border: "1px solid #333" }}>
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((l: any) => (
                <tr key={l._id}>
                  <td>{l.name}</td>
                  <td>{l.status}</td>
                  <td>{l.source || "Unknown"}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>No rows match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid #333", color: "white", borderRadius: "4px", cursor: "pointer" }}>
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={leads.length === 0}
            style={{ padding: "0.75rem 1.5rem", background: "#00ff88", border: "none", color: "black", fontWeight: "bold", borderRadius: "4px", cursor: leads.length === 0 ? "not-allowed" : "pointer", opacity: leads.length === 0 ? 0.5 : 1 }}
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
