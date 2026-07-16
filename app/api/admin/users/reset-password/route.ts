import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { requireAuthenticated } from "@/lib/auth/requirePermission";
import { logAudit } from "@/lib/auth/audit";
import { hashPassword, validatePasswordPolicy } from "@/lib/password";
import { ObjectId } from "mongodb";

export const POST = requireAuthenticated(async (req, context) => {
  const admin = context.admin;

  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const policyCheck = validatePasswordPolicy(password);
    if (!policyCheck.valid) {
      return NextResponse.json({ error: policyCheck.reason }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");
    
    const passwordHash = await hashPassword(password);

    await db.collection("admin_users").updateOne(
      { _id: new ObjectId(admin.id) },
      { 
        $set: { 
          passwordHash, 
          mustResetPassword: false, 
          passwordChangedAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      targetId: admin.id,
      targetName: admin.email,
      action: "password_reset",
      resource: "User"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Password Reset Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
