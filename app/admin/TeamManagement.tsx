"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Admin = {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[]; // we don't pass the full set from the old API, but we have role
};

type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
  mustResetPassword?: boolean;
  totpEnabled: boolean;
};

export default function TeamManagement({ admin }: { admin: Admin }) {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  
  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("employee");

  useEffect(() => {
    fetchUsers();
  }, [search]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    const t = toast.loading("Creating user...");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, role: formRole }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("User created!", { id: t });
        setTempPassword(data.tempPassword);
        fetchUsers();
        // Reset form
        setFormName("");
        setFormEmail("");
        setFormRole("employee");
      } else {
        toast.error(data.error || "Failed to create user.", { id: t });
      }
    } catch (err) {
      toast.error("Internal error.", { id: t });
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    const t = toast.loading("Deactivating user...");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deactivated.", { id: t });
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to deactivate.", { id: t });
      }
    } catch (e) {
      toast.error("Internal error.", { id: t });
    }
  }

  async function resetPassword(id: string) {
    if (!confirm("Are you sure you want to force a password reset for this user? They will be locked out until they log in with the new temporary password.")) return;
    const t = toast.loading("Resetting password...");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceReset: true })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successfully.", { id: t });
        setTempPassword(data.tempPassword);
        setShowModal(true);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to reset password.", { id: t });
      }
    } catch (e) {
      toast.error("Internal error.", { id: t });
    }
  }

  if (admin.role !== "owner" && admin.role !== "manager") {
    return null; // Should not render
  }

  return (
    <div className="crm-panel" id="team" style={{ marginTop: "24px" }}>
      <div className="crm-panel-head crm-toolbar">
        <div>
          <p className="admin-kicker">Access Control</p>
          <h3>Team Management</h3>
        </div>
        <button className="crm-primary-button" onClick={() => { setShowModal(true); setTempPassword(""); }}>
          + Add User
        </button>
      </div>

      <div className="crm-filters">
        <input 
          placeholder="Search name or email..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ maxWidth: "300px" }}
        />
      </div>

      {loading ? (
        <p style={{ padding: "20px" }}>Loading team...</p>
      ) : (
        <div className="crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>2FA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                    <br />
                    <small>{u.email}</small>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{u.role.replace("_", " ")}</td>
                  <td>
                    <span className={`status-badge ${u.status === "active" ? "status-won" : "status-lost"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.totpEnabled ? "Enabled" : "Disabled"}</td>
                  <td>
                    {admin.id !== u.id && (
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button onClick={() => resetPassword(u.id)} style={{ color: "var(--ice)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                          Reset Password
                        </button>
                        <button onClick={() => deleteUser(u.id)} style={{ color: "var(--red)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                          Deactivate
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--navy)", padding: "24px", borderRadius: "12px", width: "90%", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3>Create New User</h3>
            {tempPassword ? (
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px", marginTop: "16px", textAlign: "center" }}>
                <p style={{ color: "var(--white)", marginBottom: "8px" }}>Temporary Password generated successfully:</p>
                <code style={{ display: "block", fontSize: "24px", color: "var(--ice)", letterSpacing: "2px", marginBottom: "16px" }}>
                  {tempPassword}
                </code>
                <p style={{ color: "var(--red)", fontSize: "12px", marginBottom: "16px" }}>This password will only be shown once. Please copy and share it securely.</p>
                <button className="crm-primary-button" onClick={() => setShowModal(false)} style={{ width: "100%" }}>Close</button>
              </div>
            ) : (
              <form onSubmit={createUser} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                <div>
                  <label>Name</label>
                  <input required value={formName} onChange={e => setFormName(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.1)", border: "none", color: "var(--white)" }} />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" required value={formEmail} onChange={e => setFormEmail(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.1)", border: "none", color: "var(--white)" }} />
                </div>
                <div>
                  <label>Role</label>
                  <select value={formRole} onChange={e => setFormRole(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.1)", border: "none", color: "var(--white)" }}>
                    <option style={{background:"var(--navy)"}} value="employee">Employee (Telecaller)</option>
                    {admin.role === "owner" && (
                      <>
                        <option style={{background:"var(--navy)"}} value="developer">Developer</option>
                        <option style={{background:"var(--navy)"}} value="manager">Manager</option>
                        <option style={{background:"var(--navy)"}} value="owner">Owner</option>
                      </>
                    )}
                  </select>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button type="submit" className="crm-primary-button" style={{ flex: 1 }}>Create</button>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
