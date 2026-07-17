import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";

export const runtime = "nodejs";

function activity(action: string, type: string, performedBy: string) {
  return { action, type, performedBy, timestamp: new Date() };
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const { action, leadIds, assignedTo } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ message: "No leads selected." }, { status: 400 });
    }

    const objectIds = leadIds.map(id => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      try { return new ObjectId(id); } catch (e) { return null; }
    }).filter(id => id !== null) as ObjectId[];

    if (objectIds.length === 0) {
      return NextResponse.json({ message: "Invalid lead IDs." }, { status: 400 });
    }

    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "adybabacrm").collection("website_enquiries");

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    const logs: unknown[] = [];
    const query = { $or: [{ _id: { $in: objectIds } }, { _id: { $in: leadIds } }] };

    if (action === "assign") {
      const { computePermissions, hasPermission } = await import("@/lib/auth/roles");
      const { PERMISSIONS } = await import("@/lib/auth/permissions");
      type Role = import("@/lib/auth/roles").Role;
      const permissions = computePermissions(admin.role as Role);
      
      if (!hasPermission(permissions, PERMISSIONS.ASSIGN_LEADS)) {
        return NextResponse.json({ message: "Forbidden. Cannot assign leads." }, { status: 403 });
      }

      const nextAssignedTo = typeof assignedTo === "string" ? assignedTo.trim() : "";
      updates.assignedTo = nextAssignedTo;
      updates.assignedBy = admin.id;
      updates.lastAssignedAt = new Date();
      // reassignedCount will just be incremented via $inc
      
      logs.push(activity(`Bulk assigned to ${nextAssignedTo === "unassigned" || !nextAssignedTo ? "Unassigned" : "Employee"}`, "assignment", admin.email));

      await collection.updateMany(
        query as unknown as Parameters<typeof collection.updateMany>[0],
        { 
          $set: updates,
          $inc: { reassignedCount: 1 },
          $push: { events: { $each: logs } }
        } as unknown as Parameters<typeof collection.updateMany>[1]
      );
    } else if (action === "archive" || action === "unarchive") {
      // Must be owner or manager
      if (admin.role !== "owner" && admin.role !== "manager") {
         return NextResponse.json({ message: `Forbidden. Cannot ${action} leads.` }, { status: 403 });
      }
      
      updates.status = action === "archive" ? "Archived" : "New";
      logs.push(activity(`Lead ${action}d in bulk operation`, "system", admin.name));
      
      await collection.updateMany(
        query as unknown as Parameters<typeof collection.updateMany>[0],
        { 
          $set: updates,
          $push: { events: { $each: logs } }
        } as unknown as Parameters<typeof collection.updateMany>[1]
      );
    } else if (action === "delete") {
      if (admin.role !== "owner") {
         return NextResponse.json({ message: "Forbidden. Only owners can delete leads." }, { status: 403 });
      }
      await collection.deleteMany(query as unknown as Parameters<typeof collection.deleteMany>[0]);
    } else {
      return NextResponse.json({ message: "Invalid bulk action." }, { status: 400 });
    }

    return NextResponse.json({ success: true, updatedCount: objectIds.length });
  } catch (error) {
    console.error("Bulk operation failed", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
