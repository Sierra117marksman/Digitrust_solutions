const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'app', 'admin', 'AdminCrmApp.tsx');
let appCode = fs.readFileSync(appFile, 'utf8');

// 1. Fix the dashboard grid
appCode = appCode.replace(
  '<section className="crm-kpi-grid" id="dashboard">',
  '<section style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px", alignItems: "start", marginBottom: "24px" }} id="dashboard">'
);

// 2. Remove employee daily planner wrapper to let it use the new grid
appCode = appCode.replace(
  '<div className="crm-daily-planner" style={{ width: \'100%\' }}>',
  '<>'
);
appCode = appCode.replace(
  '</div>\n          ) : (',
  '</>\n          ) : ('
);

// 3. Update employee stats buttons to use KPI grid
appCode = appCode.replace(
  '<div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>',
  '<div className="crm-kpi-grid" style={{ width: "100%", margin: 0, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>'
);

// 4. Update manager stats buttons to use KPI grid class properly
appCode = appCode.replace(
  '<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem", width: "100%" }}>',
  '<div className="crm-kpi-grid" style={{ width: "100%", margin: 0, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>'
);

// 5. Remove Activity aside from main grid
const asideStart = appCode.indexOf('<aside className="crm-panel">');
const asideEndStr = '</aside>';
const asideEnd = appCode.indexOf(asideEndStr, asideStart) + asideEndStr.length;

if (asideStart > -1 && asideEnd > asideStart) {
  appCode = appCode.slice(0, asideStart) + appCode.slice(asideEnd);
}

// 6. Add Activity to Sidebar
const navEnd = '</nav>';
const navEndIndex = appCode.indexOf(navEnd);
if (navEndIndex > -1) {
  const sidebarActivity = `
        <div style={{ marginTop: '2rem', flex: 1, overflowY: 'auto' }}>
          <h4 style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>Recent Activity</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.slice(0, 8).map((event: any, i: number) => (
              <div key={i} style={{ fontSize: '0.8rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold' }}>{event.leadName}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', margin: '0.2rem 0' }}>{event.action}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{formatDateTime(event.timestamp)} • {event.performedBy}</div>
              </div>
            ))}
          </div>
        </div>
`;
  appCode = appCode.slice(0, navEndIndex + navEnd.length) + sidebarActivity + appCode.slice(navEndIndex + navEnd.length);
}

fs.writeFileSync(appFile, appCode, 'utf8');

// 7. Update globals.css to fix crm-main-grid
const cssFile = path.join(__dirname, 'app', 'globals.css');
let cssCode = fs.readFileSync(cssFile, 'utf8');

cssCode = cssCode.replace(
  /grid-template-columns: minmax\(0, 1\.55fr\) minmax\(300px, 0\.55fr\);/g,
  'grid-template-columns: 1fr;'
);

fs.writeFileSync(cssFile, cssCode, 'utf8');

console.log('UI patch applied successfully!');
