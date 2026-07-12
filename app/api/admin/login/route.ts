import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoClient } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import {
  ADMIN_SESSION_COOKIE,
  MFA_CHALLENGE_COOKIE,
  challengeCookieOptions,
  createAdminSessionToken,
  createMfaChallengeToken,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { createOtpAuthUrl, createTotpSecret, verifyTotpCode } from "@/lib/totp";

export const runtime = "nodejs";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isMongoConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "MongoServerSelectionError" ||
    error.name === "MongoNetworkError" ||
    error.message.includes("SSL routines") ||
    error.message.includes("ReplicaSetNoPrimary") ||
    error.message.includes("server selection")
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = clean(body.email, 160).toLowerCase();
    const password = clean(body.password, 200);
    const token = clean(body.token, 12);

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const client = await getMongoClient();
    const database = client.db(process.env.MONGODB_DB || "adybabacrm");
    const admin = await database.collection("admin_users").findOne({ email, status: "active" });

    if (!admin || !(await verifyPassword(password, admin.passwordHash as string))) {
      return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
    }

    const adminId = admin._id as ObjectId;

    if (!admin.totpEnabled) {
      const setupSecret = (admin.totpSetupSecret as string) || createTotpSecret();
      await database.collection("admin_users").updateOne(
        { _id: adminId },
        {
          $set: {
            totpSetupSecret: setupSecret,
            totpSetupStartedAt: new Date(),
            updatedAt: new Date(),
          },
        },
      );

      const response = NextResponse.json({
        setupRequired: true,
        setupSecret,
        otpAuthUrl: createOtpAuthUrl(setupSecret, email),
        message: "Set up Google Authenticator before entering the CRM.",
      });
      response.cookies.set(MFA_CHALLENGE_COOKIE, createMfaChallengeToken(adminId, "setup"), challengeCookieOptions());
      return response;
    }

    if (!token) {
      const response = NextResponse.json({
        totpRequired: true,
        message: "Enter the 6 digit code from Google Authenticator.",
      });
      response.cookies.set(MFA_CHALLENGE_COOKIE, createMfaChallengeToken(adminId, "verify"), challengeCookieOptions());
      return response;
    }

    if (!verifyTotpCode(admin.totpSecret as string, token)) {
      return NextResponse.json({ message: "Invalid authenticator code." }, { status: 401 });
    }

    await database.collection("admin_users").updateOne(
      { _id: adminId },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } },
    );

    const response = NextResponse.json({ redirectTo: "/admin" });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken({
      _id: adminId,
      email: admin.email as string,
      name: admin.name as string,
      role: admin.role as string,
      permissions: admin.permissions as string[],
      authVersion: admin.authVersion as number,
    }), sessionCookieOptions());
    response.cookies.delete(MFA_CHALLENGE_COOKIE);
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    if (isMongoConnectionError(error)) {
      return NextResponse.json(
        {
          message:
            "CRM database connection failed. Check MongoDB Atlas Network Access and the Vercel MONGODB_URI environment variable.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ message: "Login failed. Please try again." }, { status: 500 });
  }
}
