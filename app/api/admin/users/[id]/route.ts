import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { requirePermission } from "@/lib/auth/requirePermission";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { logAudit } from "@/lib/auth/audit";
import { canManageUser } from "@/lib/auth/ownership";
import { generateTempPassword, hashPassword } from "@/lib/password";
import { ObjectId } from "mongodb";

// PATCH /api/admin/users/[id] - Edit User
export const PATCH = requirePermission(PERMISSIONS.EDIT_USER, async (req, context) => {
  const admin = context.admin;
  const targetId = (await context.params).id;

  try {
    const body = await req.json();
    const { name, email, status, role, forceReset } = body;

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");
    const usersCollection = db.collection("admin_users");

    const targetUser = await usersCollection.findOne({ _id: new ObjectId(targetId) });
    if (!targetUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

    // Authorization & Ownership checks
    if (!canManageUser(admin, targetUser.role)) {
      return NextResponse.json({ error: "Forbidden: Cannot edit this user's role level." }, { status: 403 });
    }

    if (role && role !== targetUser.role && !canManageUser(admin, role)) {
       return NextResponse.json({ error: "Forbidden: Cannot promote user to this role." }, { status: 403 });
    }

    // Self protection & Owner safety locks
    if (admin.id === targetId) {
      if (role && role !== admin.role) {
        return NextResponse.json({ error: "Self-protection: Cannot change your own role." }, { status: 403 });
      }
      if (status && status !== "active") {
        return NextResponse.json({ error: "Self-protection: Cannot suspend your own account." }, { status: 403 });
      }
    }

    if (targetUser.role === "owner" && (role && role !== "owner" || status && status !== "active")) {
      // Owner safety check: Prevent demoting or suspending the last owner
      const ownerCount = await usersCollection.countDocuments({ role: "owner", status: "active" });
      if (ownerCount <= 1) {
        return NextResponse.json({ error: "Owner Safety Lock: Cannot demote or suspend the last active Owner." }, { status: 403 });
      }
    }

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (email) updates.email = String(email).toLowerCase();
    if (status) updates.status = status;
    if (role) updates.role = role;
    let tempPassword = undefined;
    if (forceReset) {
      updates.mustResetPassword = true;
      tempPassword = generateTempPassword();
      updates.passwordHash = await hashPassword(tempPassword);
    }

    // If role or status changes, or force reset, invalidate existing sessions by incrementing authVersion
    if (role || status || forceReset) {
      updates.authVersion = (targetUser.authVersion || 1) + 1;
    }

    updates.updatedAt = new Date();
    updates.updatedBy = new ObjectId(admin.id);

    await usersCollection.updateOne({ _id: new ObjectId(targetId) }, { $set: updates });

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      targetId: targetId,
      targetName: targetUser.email,
      action: "edited",
      resource: "User",
      oldValue: { role: targetUser.role, status: targetUser.status },
      newValue: { role: updates.role || targetUser.role, status: updates.status || targetUser.status }
    });

    return NextResponse.json({ success: true, tempPassword });
  } catch (error) {
    console.error("[Edit User Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

// DELETE /api/admin/users/[id] - Soft Delete User
export const DELETE = requirePermission(PERMISSIONS.DELETE_USER, async (req, context) => {
  const admin = context.admin;
  const targetId = (await context.params).id;

  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");
    const usersCollection = db.collection("admin_users");

    const targetUser = await usersCollection.findOne({ _id: new ObjectId(targetId) });
    if (!targetUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

    // Authorization checks
    if (!canManageUser(admin, targetUser.role)) {
      return NextResponse.json({ error: "Forbidden: Cannot delete this user." }, { status: 403 });
    }

    // Self protection & Owner safety locks
    if (admin.id === targetId) {
      return NextResponse.json({ error: "Self-protection: Cannot delete your own account." }, { status: 403 });
    }

    if (targetUser.role === "owner") {
      const ownerCount = await usersCollection.countDocuments({ role: "owner", status: "active" });
      if (ownerCount <= 1) {
        return NextResponse.json({ error: "Owner Safety Lock: Cannot delete the last active Owner." }, { status: 403 });
      }
    }

    // Soft delete
    await usersCollection.updateOne(
      { _id: new ObjectId(targetId) }, 
      { 
        $set: { 
          status: "inactive", 
          deletedAt: new Date(), 
          deletedBy: new ObjectId(admin.id),
          authVersion: (targetUser.authVersion || 1) + 1 // Invalidate sessions
        } 
      }
    );

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      targetId: targetId,
      targetName: targetUser.email,
      action: "deleted", // logical delete
      resource: "User",
      oldValue: { status: targetUser.status },
      newValue: { status: "inactive" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete User Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
