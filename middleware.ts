import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() || "";

  // Enforce canonical non-www domain with 308 Permanent Redirect
  if (
    host === "www.digitrustsolutions.com" ||
    host === "www.digitrustsolutions.in" ||
    host === "digitrustsolutions.in"
  ) {
    const canonicalUrl = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      "https://digitrustsolutions.com"
    );
    return NextResponse.redirect(canonicalUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - image / media files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)).*)",
  ],
};
