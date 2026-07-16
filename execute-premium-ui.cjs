const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'app', 'admin', 'AdminCrmApp.tsx');
let appCode = fs.readFileSync(appFile, 'utf8');

// 1. Table Columns: Checkbox, Lead, Service, Health/SLA, Follow-up, Status, Action
const tableHead = `<div className="crm-table-row crm-table-head">
                  <span style={{width:"40px"}}><input type="checkbox" onChange={selectAll} checked={selectedLeads.size > 0 && selectedLeads.size === leads.length} /></span>
                  <span>Lead</span>
                  <span>Service</span>
                  <span>Health / SLA</span>
                  <span>Status</span>
                  <span>Follow-up</span>
                  <span>Action</span>
                </div>`;
appCode = appCode.replace(/<div className="crm-table-row crm-table-head">[\s\S]*?<\/div>/, tableHead);

// 2. Table Rows
const tableRowRegex = /<div className="crm-table-row crm-rich-row" key=\{lead\._id\}[\s\S]*?<\/div>\s*\)\) :/g;
const newTableRow = `<div className="crm-table-row crm-rich-row" key={lead._id} style={{ background: selectedLeads.has(lead._id) ? "rgba(0,255,136,0.05)" : undefined }}>
                    <span style={{width:"40px"}}><input type="checkbox" checked={selectedLeads.has(lead._id)} onChange={() => toggleSelect(lead._id)} /></span>
                    <span>
                      <strong>{lead.name}</strong>
                      <small style={{color: "#888", fontSize: "0.75rem"}}>{lead.phone}</small>
                      <small style={{color: "#888", fontSize: "0.75rem"}}>{lead.email}</small>
                    </span>
                    <span style={{fontWeight: 500}}>{lead.service || "General"}</span>
                    <span style={{display:"flex", flexDirection:"column", gap:"0.25rem"}}>
                      <span className="crm-badge" style={{background: getSLA(lead).color + '22', color: getSLA(lead).color}}>{getSLA(lead).text}</span>
                    </span>
                    <span>
                      <select 
                        className="crm-select-badge"
                        value={lead.status}
                        onChange={(e) => {
                          let val = e.target.value;
                          let wonVal = lead.wonValue;
                          if (val === "Won") {
                            const input = window.prompt("Enter final project value (₹):", "0");
                            if (input !== null) wonVal = parseInt(input) || 0;
                            else return; // Cancelled
                          }
                          fetch('/api/admin/leads/' + lead._id, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: val, wonValue: wonVal })
                          }).then(res => res.json()).then(data => {
                            if (data.success) {
                              setLeads(leads.map(l => l._id === lead._id ? { ...l, status: val, wonValue: wonVal } : l));
                            }
                          });
                        }}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </span>
                    <span style={{fontSize: "0.8rem", color: "#666"}}>{formatDate(lead.nextFollowUpAt)}</span>
                    <span className="quick-actions" style={{display: "flex", gap: "8px", alignItems: "center"}}>
                      <button className="crm-row-button primary" onClick={() => openLead(lead)}>Open</button>
                      <select 
                        className="crm-action-dropdown"
                        value="" 
                        onChange={(e) => {
                          const action = e.target.value;
                          if (!action) return;
                          if (action === "call") { window.location.href = \`tel:\${lead.phone}\`; setActioningCall(lead._id); }
                          if (action === "wa" && lead.phone) setActioningWhatsApp(lead);
                          if (action === "snooze") snoozeLead(lead._id);
                          if (action === "complete") completeFollowUp(lead._id);
                        }}
                      >
                        <option value="">⋮</option>
                        <option value="call">Call</option>
                        {lead.phone && <option value="wa">WhatsApp</option>}
                        <option value="snooze">Snooze 24h</option>
                        <option value="complete">Mark Complete</option>
                      </select>
                    </span>
                  </div>
                )) :`;

appCode = appCode.replace(tableRowRegex, newTableRow);

fs.writeFileSync(appFile, appCode, 'utf8');

// 3. Update CSS in globals.css
const cssFile = path.join(__dirname, 'app', 'globals.css');
let cssCode = fs.readFileSync(cssFile, 'utf8');

const premiumCss = `
.crm-os {
  background: #F8FAFC !important;
}
.crm-os-sidebar {
  background: #0F172A !important;
  border-right: 1px solid rgba(255,255,255,0.05);
}
.crm-panel, .crm-kpi-grid button {
  background: #FFFFFF !important;
  border: 1px solid #E2E8F0 !important;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
  border-radius: 8px !important;
}
.crm-table-row {
  grid-template-columns: 40px minmax(210px, 1.2fr) minmax(130px, 0.8fr) 110px 140px 100px 160px !important;
  border-bottom: 1px solid #F1F5F9 !important;
}
.crm-table-row:hover {
  background: #F8FAFC;
}
.crm-badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}
.crm-select-badge {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
}
.crm-select-badge:hover {
  border-color: #CBD5E1;
}
.crm-row-button.primary {
  background: #EEF2FF;
  color: #4F46E5;
  border: 1px solid #C7D2FE;
}
.crm-row-button.primary:hover {
  background: #E0E7FF;
}
.crm-action-dropdown {
  appearance: none;
  border: 1px solid #E2E8F0;
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 40px;
  text-align: center;
}
.crm-action-dropdown:hover {
  background: #F1F5F9;
}
`;

if (!cssCode.includes('.crm-select-badge')) {
  cssCode += premiumCss;
  fs.writeFileSync(cssFile, cssCode, 'utf8');
}

console.log('Premium UI applied successfully!');
