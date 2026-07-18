import { NextResponse } from "next/server";
import { requireAuthenticated } from "@/lib/auth/requirePermission";
import { runBackup } from "@/lib/backup/runBackup";

export const POST = requireAuthenticated(async (req, context) => {
  const admin = context.admin;

  // Strict Owner-Only Check
  if (admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden: Only the Owner can create Recovery Snapshots." }, { status: 403 });
  }

  try {
    const { buffer, auditLog } = await runBackup({
      trigger: 'owner',
      reason: 'manual',
      label: 'manual',
      adminId: admin.id,
      adminName: admin.name
    });

    const filename = `${auditLog.id}.enc`;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/octet-stream",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("[Backup Export Error]", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
});

