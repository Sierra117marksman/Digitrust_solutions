"use client";

import React, { useState, useEffect } from "react";
import { AnalyticsSnapshot } from "@/lib/analytics";

export default function BusinessHealthDashboard({ onAction }: { onAction: (actionType: string, payload?: unknown) => void }) {
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "2rem", color: "#888" }}>Loading Insights...</div>;
  if (!data || ("message" in (data as object))) return <div style={{ padding: "2rem", color: "#ff4444" }}>Error loading metrics.</div>;

  const getHealthColor = (status: string) => {
    if (status === "Excellent" || status === "Healthy") return "#00ff88";
    if (status === "Needs Attention" || status === "Good") return "#ffcc00";
    return "#ff4444";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "2rem" }}>
      
      {/* 1. Business Health Header */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#aaa", fontSize: "0.9rem" }}>Team Health</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold", color: getHealthColor(data.businessHealth.team) }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: getHealthColor(data.businessHealth.team) }} />
            {data.businessHealth.team}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#aaa", fontSize: "0.9rem" }}>Pipeline Health</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold", color: getHealthColor(data.businessHealth.pipeline) }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: getHealthColor(data.businessHealth.pipeline) }} />
            {data.businessHealth.pipeline}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#aaa", fontSize: "0.9rem" }}>SLA Compliance</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: "bold", color: getHealthColor(data.businessHealth.sla) }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: getHealthColor(data.businessHealth.sla) }} />
            {data.businessHealth.sla}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#aaa", fontSize: "0.9rem" }}>Expected Wins</h4>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>
            {Math.round(data.pipeline.new * 0.22)} <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: "normal" }}>This Month</span>
          </div>
        </div>
      </section>

      {/* 2. Pipeline Funnel */}
      <section style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: "0 0 1rem 0", color: "white", fontSize: "1rem" }}>Pipeline Drop-offs</h3>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {["new", "contacted", "interested", "proposal", "won"].map((stage, idx, arr) => (
            <React.Fragment key={stage}>
              <div 
                onClick={() => onAction("filter", stage)}
                style={{ background: "#111", padding: "1rem", borderRadius: "8px", minWidth: "120px", textAlign: "center", border: "1px solid #333", cursor: "pointer", flex: 1 }}
              >
                <div style={{ fontSize: "0.85rem", color: "#888", textTransform: "capitalize", marginBottom: "0.5rem" }}>{stage}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>{data.pipeline[stage as keyof typeof data.pipeline]}</div>
              </div>
              {idx < arr.length - 1 && <div style={{ color: "#444" }}>→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 3. Team Scorecards */}
      <section style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: "0 0 1rem 0", color: "white", fontSize: "1rem" }}>Team Scorecards</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          {data.teamScorecards.map(score => (
            <div key={score.id} style={{ background: "#111", padding: "1rem", borderRadius: "8px", border: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <strong style={{ color: "white" }}>{score.name}</strong>
                <span style={{ color: "#ffcc00" }}>⭐⭐⭐⭐☆</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                <span style={{ color: "#888" }}>Follow-up Rate</span>
                <span>
                  <strong style={{ color: "white", marginRight: "0.5rem" }}>{score.followUpRate}%</strong>
                  <span style={{ color: score.trend.calls > 0 ? "#00ff88" : "#ff4444" }}>
                    {score.trend.calls > 0 ? "↑" : "↓"} {Math.abs(score.trend.calls)}%
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                <span style={{ color: "#888" }}>SLA Compliance</span>
                <strong style={{ color: score.slaCompliance >= 95 ? "#00ff88" : (score.slaCompliance >= 85 ? "#ffcc00" : "#ff4444") }}>
                  {score.slaCompliance}%
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "#888" }}>Wins (Month)</span>
                <strong style={{ color: "white" }}>{score.wins}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recommendations Engine */}
      <section style={{ background: "rgba(0, 153, 255, 0.05)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(0, 153, 255, 0.2)" }}>
        <h3 style={{ margin: "0 0 1rem 0", color: "#0099ff", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>💡</span> AI Recommendations
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "white", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {data.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
          {data.recommendations.length === 0 && <li style={{ color: "#888" }}>No urgent recommendations at this time.</li>}
        </ul>
      </section>

    </div>
  );
}
