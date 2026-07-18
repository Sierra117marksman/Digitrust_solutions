import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { requireAuthenticated } from "@/lib/auth/requirePermission";

export const GET = requireAuthenticated(async (req, context) => {
  const admin = context.admin;

  if (admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");

    // Fetch up to 50 most recent backup logs
    const logs = await db.collection("backup_logs")
      .find({})
      .sort({ startedAt: -1 })
      .limit(50)
      .toArray();

    // Map to a clean timeline format
    const timeline = logs.map(log => ({
      id: log._id.toString(),
      backupId: log.backupId || log.id,
      fingerprint: log.fingerprint || log.checksum,
      type: log.backupType,
      status: log.status,
      timestamp: log.startedAt || log.createdAt,
      durationMs: log.durationMs,
      sizeBytes: log.sizeBytes,
      error: log.error,
      label: log.label
    }));

    // Checklist Evaluation
    const latestCron = timeline.find(l => l.type === 'cron' || l.label === 'daily');
    const latestAny = timeline.find(l => l.status === 'verified' || l.status === 'Success');
    
    let lastSnapshot = "Never";
    if (latestAny) {
      const msSince = Date.now() - new Date(latestAny.timestamp).getTime();
      if (msSince < 24 * 60 * 60 * 1000) {
        lastSnapshot = Math.floor(msSince / (60 * 60 * 1000)) + " hours ago";
        if (lastSnapshot === "0 hours ago") lastSnapshot = "Just now";
      } else {
        lastSnapshot = Math.floor(msSince / (24 * 60 * 60 * 1000)) + " days ago";
      }
    }

    // Last Verification
    let lastVerification = "Never";
    const latestVerifiable = timeline.find(l => l.status === 'verified' || l.status === 'failed');
    if (latestVerifiable) {
      lastVerification = latestVerifiable.status === 'verified' ? 'Passed' : 'Failed';
    }

    // Last Restore Test
    const latestTest = timeline.find(l => l.type === 'restore_test' && l.status === 'Success');
    let restoreTested = "Never";
    if (latestTest) {
      const msSinceTest = Date.now() - new Date(latestTest.timestamp).getTime();
      restoreTested = Math.floor(msSinceTest / (24 * 60 * 60 * 1000)) + " days ago";
      if (restoreTested === "0 days ago") restoreTested = "Today";
    }

    // Encryption
    const encryptionEnabled = !!process.env.BACKUP_ENCRYPTION_KEY;

    // Cloud Sync
    let cloudSync = "Unknown";
    if (latestCron) {
      cloudSync = latestCron.status === 'verified' ? 'Healthy' : 'Failing';
    }

    // Overall Status
    const isReady = encryptionEnabled && lastVerification === 'Passed' && cloudSync !== 'Failing';

    // Retention Metrics
    const verifiedLogs = logs.filter(l => l.status === 'verified');
    const verifiedCount = verifiedLogs.length;
    let oldestVerified = "None";
    if (verifiedCount > 0) {
      const oldest = verifiedLogs[verifiedCount - 1]; // Because it's sorted descending
      const oldestDate = new Date(oldest.createdAt || oldest.startedAt);
      oldestVerified = oldestDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });
    }

    return NextResponse.json({
      timeline,
      health: {
        status: isReady ? 'Ready' : 'Attention Needed',
        lastSnapshot,
        lastVerification,
        restoreTested,
        encryptionEnabled,
        cloudSync,
        retentionDays: Number(process.env.BACKUP_RETENTION_DAYS || 30),
        retentionCount: Number(process.env.BACKUP_RETENTION_COUNT || 30),
        verifiedCount,
        oldestVerified
      }
    });

  } catch (error: unknown) {
    console.error("[Backup History Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
