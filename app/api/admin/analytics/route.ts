import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AnalyticsService } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role === "employee") {
    // Only owners and managers can access full analytics for now
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";

  try {
    const metrics = await AnalyticsService.getDashboardMetrics(force);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Analytics fetch failed", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
