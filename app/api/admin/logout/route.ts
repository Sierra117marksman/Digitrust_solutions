import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, MFA_CHALLENGE_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  response.cookies.delete(MFA_CHALLENGE_COOKIE);
  return response;
}
