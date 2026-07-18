"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface TimelineEvent {
  id: string;
  backupId: string;
  fingerprint: string;
  type: string;
  status: string;
  timestamp: string;
  durationMs: number;
  sizeBytes: number;
  error?: string;
}

interface HealthStats {
  status: "Ready" | "Attention Needed";
  lastSnapshot: string;
  lastVerification: string;
  restoreTested: string;
  encryptionEnabled: boolean;
  cloudSync: string;
  retentionDays?: number;
  retentionCount?: number;
  verifiedCount?: number;
  oldestVerified?: string;
}

export default function RecoveryCenter() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [health, setHealth] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showRestoreWizard, setShowRestoreWizard] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [restoreConfirmation, setRestoreConfirmation] = useState("");
  const [restoring, setRestoring] = useState(false);
  
  // Restore Wizard state
  const [validating, setValidating] = useState(false);
  const [simulationReport, setSimulationReport] = useState<{
    manifest: { backupId: string; created: string; [key: string]: unknown };
    warnings: string[];
    diff: Record<string, { backupCount: number; liveCount: number; difference: number }>;
  } | null>(null);

  const fetchHistory = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/backups/history");
      if (res.ok) {
        const data = await res.json();
        setTimeline(data.timeline);
        setHealth(data.health);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = () => { fetchHistory(); };
    init();
  }, [fetchHistory]);



  const handleCreateSnapshot = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/admin/backups/export", { method: "POST" });
      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Failed to create snapshot");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "backup.enc";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/["']/g, "");
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setTimeout(fetchHistory, 1000);
      alert("Recovery Snapshot created and downloaded successfully. Store it in a safe offline location.");
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred during export.");
    } finally {
      setExporting(false);
    }
  };

  const handleUploadBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadedFile(file);
    
    setValidating(true);
    setSimulationReport(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/backups/validate", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Validation Failed");
      } else {
        setSimulationReport(data);
      }
    } catch {

      alert("An error occurred during validation upload.");
    } finally {
      setValidating(false);
      // Reset input so it can be uploaded again
      e.target.value = '';
    }
  };

  
  const handleRestore = async () => {
    if (!uploadedFile) return;
    if (restoreConfirmation !== "RESTORE") {
      alert("Please type RESTORE exactly to confirm.");
      return;
    }
    if (selectedCollections.size === 0) {
      alert("Please select at least one collection to restore.");
      return;
    }

    setRestoring(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("confirmation", restoreConfirmation);
    formData.append("collections", JSON.stringify(Array.from(selectedCollections)));

    try {
      const res = await fetch("/api/admin/backups/restore", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Restore Failed");
      } else {
        alert("Restore completed successfully! " + JSON.stringify(data.integrity));
        setSimulationReport(null);
        setShowRestoreWizard(false);
        setUploadedFile(null);
        fetchHistory();
      }
    } catch {
      alert("An unexpected error occurred during restore.");
    } finally {
      setRestoring(false);
      setRestoreConfirmation("");
    }
  };

  if (loading) {
    return <div className="p-8">Loading Recovery Data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ShieldCheck className="w-8 h-8 mr-3 text-green-600" />
          Recovery Center
        </h1>
        <p className="text-gray-600 mt-2">
          Business Continuity Engine. Ensure you have your `BACKUP_ENCRYPTION_KEY` safely stored.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-8">
        {["dashboard", "snapshot", "restore", "timeline", "runbook"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeTab === "dashboard" && health && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Recovery Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 flex items-center">
                  {health.status === 'Ready' ? (
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                  )}
                  Overall Readiness
                </span>
                <span className={`font-mono text-lg font-bold ${health.status === 'Ready' ? 'text-green-700' : 'text-yellow-700'}`}>
                  {health.status === 'Ready' ? '🟢 Ready' : '🟡 Attention Needed'}
                </span>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="p-4 bg-white space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">✓ Last Snapshot</span>
                    <span className="font-medium text-gray-900">{health.lastSnapshot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">✓ Last Verification</span>
                    <span className={`font-medium ${health.lastVerification === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>{health.lastVerification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">✓ Last Restore Test</span>
                    <span className="font-medium text-gray-900">{health.restoreTested}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">✓ Encryption</span>
                    <span className={`font-medium ${health.encryptionEnabled ? 'text-green-600' : 'text-red-600'}`}>{health.encryptionEnabled ? 'Enabled' : 'Missing Key'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">✓ Cloud Sync</span>
                    <span className={`font-medium ${health.cloudSync === 'Healthy' ? 'text-green-600' : 'text-red-600'}`}>{health.cloudSync}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Retention Widget */}
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mt-6 mb-4">Retention Policy</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 bg-white space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">✓ Limit (Days)</span>
                  <span className="font-medium text-gray-900">{health.retentionDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">✓ Limit (Count)</span>
                  <span className="font-medium text-gray-900">Min {health.retentionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">✓ Backups Stored</span>
                  <span className="font-medium text-blue-700">{health.verifiedCount} Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">✓ Oldest Backup</span>
                  <span className="font-medium text-gray-900">{health.oldestVerified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">✓ Next Purge</span>
                  <span className="font-medium text-gray-900">Tomorrow 2:00 AM</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                The automatic Google Drive backup runs daily at 2:00 AM UTC. You can manually run the backup pipeline now.
              </p>
              <button
                onClick={() => { setActiveTab("snapshot"); }}
                className="w-full py-2 bg-blue-50 text-blue-700 font-bold rounded border border-blue-200 hover:bg-blue-100 transition"
              >
                Run Backup Now &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot View */}
      {activeTab === "snapshot" && (
        <div className="bg-white p-8 border rounded-lg shadow-sm max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Create Recovery Snapshot</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <ShieldAlert className="h-6 w-6 text-yellow-600 mr-3" />
              <p className="text-sm text-yellow-700">
                This will trigger the full backup pipeline synchronously (Snapshot &rarr; Encrypt &rarr; Upload &rarr; Verify). 
                Once complete, you will also automatically download a local offline copy.
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateSnapshot}
            disabled={exporting}
            className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {exporting ? (
              "Running Backup Pipeline..."
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Run Backup Now
              </>
            )}
          </button>
        </div>
      )}

      {/* Restore View (Phase 1B) */}
      {activeTab === "restore" && (
        <div className="bg-white p-8 border rounded-lg shadow-sm max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Restore Wizard (Simulation)</h2>
          <p className="text-gray-600 mb-6">
            Upload an encrypted `.enc` backup snapshot. The system will securely decrypt it in-memory, validate the manifest, 
            and produce a Dry Run Report comparing the backup to your live database. <strong>No data will be overwritten during simulation.</strong>
          </p>

          {!simulationReport && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
              {validating ? (
                <div className="text-blue-600 font-medium animate-pulse">Decrypting and validating in memory...</div>
              ) : (
                <>
                  <input type="file" id="backup-upload" accept=".enc" className="hidden" onChange={handleUploadBackup} />
                  <label htmlFor="backup-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Select .enc Snapshot
                  </label>
                  <p className="mt-2 text-sm text-gray-500">Only AES-256-GCM encrypted snapshot files are accepted.</p>
                </>
              )}
            </div>
          )}

          {simulationReport && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-green-50 p-4 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <ShieldCheck className="h-6 w-6 text-green-600 mr-2" />
                  <span className="font-bold text-green-800">Archive Validated & Decrypted</span>
                </div>
                <button onClick={() => setSimulationReport(null)} className="text-sm text-gray-600 hover:underline">
                  Upload Different File
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="border p-4 rounded-md">
                  <p className="text-gray-500 mb-1">Backup ID</p>
                  <p className="font-mono font-medium">{simulationReport.manifest.backupId}</p>
                </div>
                <div className="border p-4 rounded-md">
                  <p className="text-gray-500 mb-1">Created At</p>
                  <p className="font-medium">{format(new Date(simulationReport.manifest.created), "MMM dd, yyyy HH:mm:ss")}</p>
                </div>
              </div>

              {simulationReport.warnings?.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">Warnings</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    {simulationReport.warnings.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-bold text-lg mb-3">Dry Run Diff Report</h3>
                <table className="w-full text-left border">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 font-medium text-gray-600">Collection</th>
                      <th className="px-4 py-2 font-medium text-gray-600">Backup Has</th>
                      <th className="px-4 py-2 font-medium text-gray-600">Live DB Has</th>
                      <th className="px-4 py-2 font-medium text-gray-600">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries((simulationReport.diff as Record<string, { backupCount: number; liveCount: number; difference: number }>)).map(([col, data]) => (
                      <tr key={col}>
                        <td className="px-4 py-3 font-medium">{col}</td>
                        <td className="px-4 py-3">{data.backupCount}</td>
                        <td className="px-4 py-3">{data.liveCount}</td>
                        <td className="px-4 py-3">
                          <span className={"px-2 py-1 rounded text-xs font-bold " + (
                            data.difference > 0 ? "bg-green-100 text-green-800" : 
                            data.difference < 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                          )}>
                            {data.difference > 0 ? '+' : ''}{data.difference}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4">
                {!showRestoreWizard ? (
                  <button 
                    onClick={() => {
                      const cols = new Set<string>();
                      (simulationReport.manifest.collections as ({name: string} | string)[] | undefined)?.forEach(c => cols.add(typeof c === 'string' ? c : c.name));
                      setSelectedCollections(cols);
                      setShowRestoreWizard(true);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                  >
                    Proceed to Restore
                  </button>
                ) : (
                  <div className="w-full bg-white border rounded-lg p-6 mt-4 shadow-lg">
                    <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                      <ShieldAlert className="mr-2" />
                      Atomic Namespace Swap (Phase 1C)
                    </h3>
                    
                    <div className="mb-4">
                      <p className="font-bold mb-2 text-gray-700">1. Select Collections to Restore:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(simulationReport.manifest.collections as ({name: string} | string)[] | undefined)?.map(c => {
                          const collName = typeof c === 'string' ? c : c.name;
                          return (
                            <label key={collName} className="flex items-center space-x-2 bg-gray-50 p-2 rounded border">
                              <input 
                                type="checkbox" 
                                checked={selectedCollections.has(collName)}
                                onChange={(e) => {
                                  const newSet = new Set(selectedCollections);
                                  if (e.target.checked) newSet.add(collName);
                                  else newSet.delete(collName);
                                  setSelectedCollections(newSet);
                                }}
                              />
                              <span className="font-medium">{collName}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="font-bold mb-2 text-gray-700">2. Confirm Action:</p>
                      <p className="text-sm text-gray-500 mb-2">This will drop the current live collections and instantly swap in the backup data. An emergency snapshot of the current state will be taken first.</p>
                      <input 
                        type="text" 
                        placeholder="Type RESTORE to confirm" 
                        value={restoreConfirmation}
                        onChange={(e) => setRestoreConfirmation(e.target.value)}
                        className="w-full p-3 border border-red-300 rounded focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => setShowRestoreWizard(false)}
                        className="text-gray-500 hover:underline font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleRestore}
                        disabled={restoring || restoreConfirmation !== "RESTORE" || selectedCollections.size === 0}
                        className="px-8 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {restoring ? "Restoring..." : "Perform Atomic Restore"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline View */}
      {activeTab === "timeline" && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">Recovery Timeline</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timeline.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No recovery events recorded yet.
                    </td>
                  </tr>
                ) : (
                  timeline.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(event.timestamp), "MMM dd, HH:mm")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {event.type || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === "verified" || event.status === "Success" ? "bg-green-100 text-green-800" : 
                          event.status === "purged" ? "bg-gray-200 text-gray-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {event.status === 'purged' ? '🗑️ Purged' : event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {event.durationMs ? `${event.durationMs.toFixed(1)}s` : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {event.error ? (
                          <span className="text-red-500" title={event.error}>{event.error}</span>
                        ) : (
                          <span>{event.sizeBytes ? `${(event.sizeBytes / 1024 / 1024).toFixed(1)} MB` : ''} <span className="text-gray-300 ml-2">{event.fingerprint}</span></span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Runbook View */}
      {activeTab === "runbook" && (
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Disaster Recovery Library</h2>
          <p className="text-gray-600 mb-6">
            The raw documentation files are located in your repository at <code>docs/Recovery/</code>. 
            Ensure your team has access to these files outside of this CRM in case the server goes offline.
          </p>
          
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              How to Test the Recovery Engine
            </h3>
            <div className="space-y-4 text-blue-800">
              <div>
                <p className="font-bold">Step 1: Take a Baseline Snapshot</p>
                <p className="text-sm">Go to the <strong>Snapshot</strong> tab and click <strong>Download Recovery Snapshot</strong>. Save the <code>.enc</code> file to your computer. This file is encrypted with your AES-256-GCM key.</p>
              </div>
              
              <div>
                <p className="font-bold">Step 2: Simulate Data Loss (Optional but Recommended for Testing)</p>
                <p className="text-sm">Go to your CRM dashboard or leads list. Edit a lead, change a status, or delete a test lead. Note the changes so you can verify they revert.</p>
              </div>

              <div>
                <p className="font-bold">Step 3: Upload for Validation</p>
                <p className="text-sm">Go to the <strong>Restore</strong> tab. Upload the <code>.enc</code> file you downloaded. The system will decrypt it in-memory and compare the snapshot counts to the live database counts. You will see a &quot;Difference&quot; column highlighting exactly what changed since the snapshot.</p>
              </div>

              <div>
                <p className="font-bold">Step 4: Execute Atomic Restore</p>
                <p className="text-sm">Click <strong>Proceed to Restore</strong>. Check the box for <code>website_enquiries</code> (and any other collections you want to roll back). Type <code>RESTORE</code> in the confirmation box and click <strong>Perform Atomic Restore</strong>.</p>
              </div>

              <div>
                <p className="font-bold">Step 5: Verify Integrity</p>
                <p className="text-sm">The system will instantly take an emergency backup, extract the data, and execute the atomic namespace swap. Once complete, check the <strong>Timeline</strong> tab to see the audit logs. Return to your leads list and verify that the data has perfectly reverted to its original state.</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-3">Offline Runbook Files</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-blue-600"><AlertCircle className="w-5 h-5 mr-2" /> Runbook.md - Executive overview</li>
            <li className="flex items-center text-blue-600"><AlertCircle className="w-5 h-5 mr-2" /> Backup.md - Details on encryption and export architecture</li>
            <li className="flex items-center text-blue-600"><AlertCircle className="w-5 h-5 mr-2" /> Restore.md - Atomic swap mechanics</li>
            <li className="flex items-center text-blue-600"><AlertCircle className="w-5 h-5 mr-2" /> DisasterChecklist.md - Step-by-step crisis response</li>
            <li className="flex items-center text-blue-600"><AlertCircle className="w-5 h-5 mr-2" /> KeyRotation.md - Encryption key management</li>
            <li className="flex items-center text-blue-600"><AlertCircle className="w-5 h-5 mr-2" /> FAQ.md - Common troubleshooting</li>
          </ul>
        </div>
      )}
    </div>
  );
}
