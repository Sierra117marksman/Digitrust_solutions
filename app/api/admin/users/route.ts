import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { requirePermission } from "@/lib/auth/requirePermission";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { logAudit } from "@/lib/auth/audit";
import { hashPassword, generateTempPassword } from "@/lib/password";
import { ObjectId } from "mongodb";

// GET /api/admin/users - List users
export const GET = requirePermission(PERMISSIONS.VIEW_USERS, async (req, context) => {
  const admin = context.admin;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  
  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || "adybabacrm");

  // Construct query based on PBAC ownership rules
  const query: any = { status: { $ne: "deleted" } }; // or we can use $in: ["active", "inactive", "suspended"]

  if (admin.role === "manager") {
    // Managers can only see employees
    query.role = "employee";
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await db.collection("admin_users")
    .find(query)
    .project({ passwordHash: 0, _id: 1 }) // Exclude password hash
    .sort({ createdAt: -1 })
    .toArray();

  const formattedUsers = users.map(u => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status || "active",
    lastLogin: u.lastLogin,
    mustResetPassword: u.mustResetPassword,
    totpEnabled: !!u.totpSecret
  }));

  return NextResponse.json({ users: formattedUsers });
});

// Simple in-memory rate limiting for user creation
const createRateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

// POST /api/admin/users - Create User
export const POST = requirePermission(PERMISSIONS.CREATE_USER, async (req, context) => {
  const admin = context.admin;

  // Rate Limiting
  const now = Date.now();
  const timestamps = createRateLimit.get(admin.id) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (validTimestamps.length >= MAX_REQUESTS) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }
  validTimestamps.push(now);
  createRateLimit.set(admin.id, validTimestamps);

  try {
    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Ownership/Authorization check
    if (admin.role === "manager" && role !== "employee") {
      return NextResponse.json({ error: "Managers can only create Employee accounts." }, { status: 403 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");

    // Check if user exists
    const existingUser = await db.collection("admin_users").findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    const newUser = {
      name,
      email: email.toLowerCase(),
      role,
      passwordHash,
      status: "active",
      mustResetPassword: true,
      authVersion: 1,
      createdAt: new Date(),
      createdBy: new ObjectId(admin.id),
      failedLoginAttempts: 0
    };

    const result = await db.collection("admin_users").insertOne(newUser);

    // Audit Log
    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      targetId: result.insertedId.toString(),
      targetName: email,
      action: "created",
      resource: "User",
      newValue: { role },
    });

    return NextResponse.json({
      success: true,
      tempPassword,
      message: "User created successfully. Temporary password is provided below."
    });
  } catch (error) {
    console.error("[Create User Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
