import crypto from "crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getMongoClient } from "../mongodb";
import { computePermissions, Role } from "./roles";
import { Permission } from "./permissions";

export const ADMIN_SESSION_COOKIE = "digitrust_admin_session";
export const MFA_CHALLENGE_COOKIE = "digitrust_mfa_challenge";

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const CHALLENGE_TTL_SECONDS = 60 * 10;

type SignedPayload = {
  exp: number;
  [key: string]: unknown;
};

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
  role: string;
  authVersion: number;
};

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Set<Permission>;
  mustResetPassword?: boolean;
};

function base64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.MONGODB_URI;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }
  return "digitrust-local-development-secret-change-me";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function createSignedToken(payload: SignedPayload) {
  const encodedPayload = base64Url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readSignedToken<T extends SignedPayload>(token?: string) {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  const provided = Buffer.from(signature);
  const trusted = Buffer.from(expected);
  if (provided.length !== trusted.length || !crypto.timingSafeEqual(provided, trusted)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as T;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createAdminSessionToken(admin: {
  _id: ObjectId;
  email: string;
  name: string;
  role: string;
  authVersion?: number;
}) {
  return createSignedToken({
    sub: admin._id.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
    authVersion: admin.authVersion || 1,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
}

export function createMfaChallengeToken(adminId: ObjectId, purpose: "setup" | "verify") {
  return createSignedToken({
    sub: adminId.toString(),
    purpose,
    exp: Math.floor(Date.now() / 1000) + CHALLENGE_TTL_SECONDS,
  });
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function challengeCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CHALLENGE_TTL_SECONDS,
  };
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const cookieStore = await cookies();
  const session = readSignedToken<AdminSession & SignedPayload>(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );
  if (!session?.sub) return null;

  const client = await getMongoClient();
  const database = client.db(process.env.MONGODB_DB || "adybabacrm");
  const admin = await database.collection("admin_users").findOne({
    _id: new ObjectId(session.sub),
    email: session.email,
    status: "active",
    // authVersion checks ensure sessions are invalidated if authVersion is incremented
    authVersion: session.authVersion,
  });

  if (!admin) return null;

  const role = admin.role as Role;
  const permissions = computePermissions(
    role, 
    admin.customPermissions as Permission[], 
    admin.deniedPermissions as Permission[]
  );

  return {
    id: admin._id.toString(),
    email: admin.email as string,
    name: admin.name as string,
    role,
    permissions,
    mustResetPassword: admin.mustResetPassword === true,
  };
}
