import { getMongoClient } from "../mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

type AuditAction = "created" | "edited" | "deleted" | "suspended" | "password_reset" | "logged_in" | "failed_login";

export type AuditLogEntry = {
  actorId: string;
  actorName: string;
  targetId?: string;
  targetName?: string;
  action: AuditAction;
  resource: "User" | "Lead" | "System";
  oldValue?: unknown;
  newValue?: unknown;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
};

export async function logAudit(entry: Omit<AuditLogEntry, "timestamp" | "ipAddress" | "userAgent">) {
  try {
    const reqHeaders = await headers();
    const ipAddress = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "Unknown IP";
    const userAgent = reqHeaders.get("user-agent") || "Unknown Browser";

    const log: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
      ipAddress,
      userAgent,
    };

    const client = await getMongoClient();
    const database = client.db(process.env.MONGODB_DB || "adybabacrm");
    
    // We do not await this to avoid blocking the main request cycle, 
    // but in serverless environments, it's safer to await it.
    await database.collection("audit_logs").insertOne(log);
  } catch (error) {
    console.error("[Audit Log Failed]", error);
  }
}
