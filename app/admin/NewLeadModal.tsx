"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface NewLeadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewLeadModal({ onClose, onSuccess }: NewLeadModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    service: "Web Development",
    source: "Manual"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      
      if (response.status === 409 && data.isDuplicate) {
        toast.error(`Duplicate Phone! Existing Lead ID: ${data.existingLeadId}`, { duration: 5000 });
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error(data.message || "Could not create lead");
      }
      
      toast.success("Lead created!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crm-drawer-shell">
      <button className="crm-drawer-backdrop" onClick={onClose} aria-label="Close modal" />
      <aside className="crm-drawer">
        <header>
          <div>
            <p className="admin-kicker">New Entry</p>
            <h3>Create Lead</h3>
          </div>
          <button onClick={onClose}>Close</button>
        </header>

        <form onSubmit={handleSubmit} className="crm-drawer-grid" style={{ padding: '1.5rem' }}>
          <label style={{ gridColumn: '1 / -1' }}>Name<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></label>
          <label>Phone<input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></label>
          <label>Email<input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></label>
          <label style={{ gridColumn: '1 / -1' }}>Company<input value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></label>
          <label>Service<select value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
            <option>Web Development</option>
            <option>SEO</option>
            <option>Social Media</option>
            <option>General</option>
          </select></label>
          <label>Source<select value={form.source} onChange={e => setForm({...form, source: e.target.value})}>
            <option>Manual</option>
            <option>Website</option>
            <option>WhatsApp</option>
            <option>Google Ads</option>
          </select></label>
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} style={{ background: 'white', color: 'black', padding: '0.75rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
              {loading ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
