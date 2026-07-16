import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoClient } from "@/lib/mongodb";
import {
  ADMIN_SESSION_COOKIE,
  MFA_CHALLENGE_COOKIE,
  createAdminSessionToken,
  readSignedToken,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { verifyTotpCode } from "@/lib/totp";

export const runtime = "nodejs";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const challengeCookie = request.headers
      .get("cookie")
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${MFA_CHALLENGE_COOKIE}=`))
      ?.split("=")[1];
    const challenge = readSignedToken<{ sub: string; purpose: string; exp: number }>(challengeCookie);
    const body = (await request.json()) as Record<string, unknown>;
    const token = clean(body.token, 12);

    if (!challenge?.sub || challenge.purpose !== "setup") {
      return NextResponse.json({ message: "Authenticator setup expired. Please sign in again." }, { status: 401 });
    }

    const client = await getMongoClient();
    const database = client.db(process.env.MONGODB_DB || "adybabacrm");
    const admin = await database.collection("admin_users").findOne({
      _id: new ObjectId(challenge.sub),
      status: "active",
    });

    if (!admin?.totpSetupSecret || !verifyTotpCode(admin.totpSetupSecret as string, token)) {
      return NextResponse.json({ message: "Invalid authenticator code." }, { status: 401 });
    }

    await database.collection("admin_users").updateOne(
      { _id: admin._id },
      {
        $set: {
          totpSecret: admin.totpSetupSecret,
          totpEnabled: true,
          totpEnabledAt: new Date(),
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
        $unset: {
          totpSetupSecret: "",
          totpSetupStartedAt: "",
        },
      },
    );

    const response = NextResponse.json({ redirectTo: "/admin" });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken({
      _id: admin._id,
      email: admin.email as string,
      name: admin.name as string,
      role: admin.role as string,
      authVersion: admin.authVersion as number,
    }), sessionCookieOptions());
    response.cookies.delete(MFA_CHALLENGE_COOKIE);
    return response;
  } catch (error) {
    console.error("Authenticator setup failed", error);
    return NextResponse.json({ message: "Authenticator setup failed." }, { status: 500 });
  }
}
