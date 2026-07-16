const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'app', 'admin', 'AdminCrmApp.tsx');
let appCode = fs.readFileSync(appFile, 'utf8');

// The issue is that activeTab === "dashboard" && ( <> ) was opened, but never closed before crm-workspace closed.
// It should close after TeamManagement.
const target = `<TeamManagement admin={admin} />
      </section>`;
const replacement = `<TeamManagement admin={admin} />
          </>
        )}
      </section>`;

if (appCode.includes(target)) {
  appCode = appCode.replace(target, replacement);
  fs.writeFileSync(appFile, appCode, 'utf8');
  console.log('Fixed fragment closure successfully!');
} else {
  console.log('Target string not found in AdminCrmApp.tsx!');
}
