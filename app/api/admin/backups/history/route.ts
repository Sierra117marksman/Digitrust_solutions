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
      backupId: log.backupId,
      fingerprint: log.fingerprint,
      type: log.backupType,
      status: log.status,
      timestamp: log.startedAt || log.createdAt,
      durationMs: log.durationMs,
      sizeBytes: log.sizeBytes,
      error: log.error
    }));

    // Calculate Recovery Score based on the formula
    let score = 0;
    
    // Check 1: Last backup < 24h (+25)
    const latestManual = timeline.find(l => l.type === 'manual' && l.status === 'Success');
    let lastSnapshot = "Never";
    if (latestManual) {
      const msSince = Date.now() - new Date(latestManual.timestamp).getTime();
      if (msSince < 24 * 60 * 60 * 1000) {
        score += 25;
        lastSnapshot = "Today";
      } else {
        lastSnapshot = Math.floor(msSince / (24 * 60 * 60 * 1000)) + " Days Ago";
      }
    }

    // Check 2: Last Restore Test < 30d (+20)
    const latestTest = timeline.find(l => l.type === 'restore_test' && l.status === 'Success');
    let restoreTested = "Never";
    if (latestTest) {
      const msSinceTest = Date.now() - new Date(latestTest.timestamp).getTime();
      if (msSinceTest < 30 * 24 * 60 * 60 * 1000) {
        score += 20;
      }
      restoreTested = Math.floor(msSinceTest / (24 * 60 * 60 * 1000)) + " Days Ago";
    }

    // Phase 1A defaults
    // Google/Dropbox not yet implemented, assume 0 for now or skip
    // Encryption Enabled (+15)
    const hasKey = !!process.env.BACKUP_ENCRYPTION_KEY;
    if (hasKey) score += 15;
    
    // Manifest Valid (+10) - Assumed true if latest backup is success
    if (latestManual) score += 10;
    
    // Since Phase 2 isn't live, let's normalize the score out of 70 points for Phase 1A to hit 100%
    // Max Phase 1A score = 25 + 20 + 15 + 10 = 70.
    // If we want it to be /100, let's just use fixed points:
    const finalScore = Math.min(100, Math.round((score / 70) * 100));
    
    const readiness = finalScore >= 90 ? "PASS" : (finalScore >= 50 ? "WARNING" : "FAIL");

    return NextResponse.json({
      timeline,
      health: {
        score: finalScore,
        readiness,
        lastSnapshot,
        restoreTested,
        encryptionEnabled: hasKey
      }
    });

  } catch (error: unknown) {
    console.error("[Backup History Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
