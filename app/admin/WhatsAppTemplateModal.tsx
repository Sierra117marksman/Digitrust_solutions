/* eslint-disable */
"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface WhatsAppTemplateModalProps {
  lead: any;
  employeeName: string;
  onClose: () => void;
  onSuccess: (channel: string) => void;
}

const templates = [
  {
    id: "initial",
    category: "Initial Contact",
    content: "Hello {{name}}, this is {{employee}} from DigiTrust. I saw your enquiry regarding {{service}}. Let me know a good time to connect!"
  },
  {
    id: "followup",
    category: "Follow-up",
    content: "Hi {{name}}, just following up on our previous conversation. Do you have any questions I can help answer?"
  },
  {
    id: "proposal",
    category: "Proposal",
    content: "Hello {{name}}, I've sent the proposal to your email. Please review it and let me know your thoughts."
  },
  {
    id: "reminder",
    category: "Reminder",
    content: "Hi {{name}}, just a quick reminder about our scheduled call today. Looking forward to speaking with you!"
  },
  {
    id: "thankyou",
    category: "Thank You",
    content: "Hi {{name}}, thank you for your time today. Let me know if you need any further details."
  }
];

export default function WhatsAppTemplateModal({ lead, employeeName, onClose, onSuccess }: WhatsAppTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);

  const generateMessage = (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId)?.content || "";
    return tmpl
      .replace(/{{name}}/g, lead.name || "there")
      .replace(/{{employee}}/g, employeeName || "our team")
      .replace(/{{service}}/g, lead.service || "our services");
  };

  const handleSend = async () => {
    const msg = generateMessage(selectedTemplate);
    const encoded = encodeURIComponent(msg);
    const phoneDigits = lead.phone.replace(/\D/g, "");
    const waPhone = phoneDigits.startsWith("91") ? phoneDigits : `91${phoneDigits}`;
    
    // Log contact first
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead._id, lastContactedAt: new Date().toISOString(), contactChannel: "whatsapp" })
      });
      onSuccess("whatsapp");
    } catch (e) {
      console.error(e);
      // Proceed to open WA anyway
    }

    window.open(`https://wa.me/${waPhone}?text=${encoded}`, "_blank");
    onClose();
  };

  return (
    <div className="crm-drawer-shell" style={{ zIndex: 1000, alignItems: "center", justifyContent: "center" }}>
      <div className="crm-drawer-backdrop" onClick={onClose} />
      <div style={{ background: "#1a1a1a", padding: "2rem", borderRadius: "8px", width: "100%", maxWidth: "500px", zIndex: 1001 }}>
        <h3 style={{ margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#25D366" }}>💬</span> WhatsApp Template
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {templates.map(t => (
              <button 
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                style={{ 
                  padding: "0.75rem", 
                  background: selectedTemplate === t.id ? "rgba(37, 211, 102, 0.2)" : "rgba(255,255,255,0.05)", 
                  color: selectedTemplate === t.id ? "#25D366" : "white", 
                  border: `1px solid ${selectedTemplate === t.id ? "#25D366" : "#333"}`, 
                  borderRadius: "4px", 
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                {t.category}
              </button>
            ))}
          </div>

          <div style={{ padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid #333", fontSize: "0.95rem", lineHeight: 1.5, color: "#ccc" }}>
            {generateMessage(selectedTemplate)}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button onClick={onClose} style={{ flex: 1, padding: "0.75rem", background: "transparent", border: "1px solid #333", color: "white", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
            <button 
              onClick={handleSend} 
              style={{ flex: 2, padding: "0.75rem", background: "#25D366", border: "none", color: "white", fontWeight: "bold", borderRadius: "4px", cursor: "pointer", display: "flex", justifyContent: "center", gap: "0.5rem" }}
            >
              <span>Send WhatsApp</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
