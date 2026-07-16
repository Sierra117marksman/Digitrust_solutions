"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface CurrentAdmin {
  name: string;
}

export default function ForcePasswordReset({ admin }: { admin: CurrentAdmin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    const t = toast.loading("Updating password...");
    try {
      const res = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        toast.success("Password updated successfully!", { id: t });
        window.location.reload(); // Reload to lift the reset screen
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update password.", { id: t });
      }
    } catch {
      toast.error("Internal error.", { id: t });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="crm-os" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="crm-panel" style={{ maxWidth: "400px", width: "100%", padding: "32px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "16px", color: "var(--white)" }}>Welcome, {admin.name}</h2>
        <p style={{ color: "var(--slate)", marginBottom: "24px", fontSize: "14px" }}>
          For security reasons, you must set a new password before you can access the dashboard.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--ice)" }}>New Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            />
            <small style={{ display: "block", marginTop: "8px", color: "var(--slate)", fontSize: "11px" }}>
              Must be at least 12 characters and include upper/lowercase, numbers, and symbols.
            </small>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--ice)" }}>Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <button type="submit" disabled={loading} className="crm-primary-button" style={{ marginTop: "8px" }}>
            {loading ? "Updating..." : "Set Password & Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
