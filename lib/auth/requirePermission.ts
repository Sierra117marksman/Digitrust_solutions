import { NextResponse } from "next/server";
import { getCurrentAdmin, CurrentAdmin } from "./session";
import { hasPermission } from "./roles";
import { Permission } from "./permissions";

export type AuthenticatedRouteHandler = (
  req: Request,
  context: { params: Record<string, string>; admin: CurrentAdmin }
) => Promise<NextResponse> | NextResponse;

export function requirePermission(permission: Permission, handler: AuthenticatedRouteHandler) {
  return async (req: Request, context: { params: Record<string, string> }) => {
    try {
      const admin = await getCurrentAdmin();
      
      if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!hasPermission(admin.permissions, permission)) {
        return NextResponse.json({ error: "Forbidden: Missing permission " + permission }, { status: 403 });
      }

      return await handler(req, { ...context, admin });
    } catch (error) {
      console.error("[RequirePermission Error]", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}

export function requireAuthenticated(handler: AuthenticatedRouteHandler) {
  return async (req: Request, context: { params: Record<string, string> }) => {
    try {
      const admin = await getCurrentAdmin();
      
      if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return await handler(req, { ...context, admin });
    } catch (error) {
      console.error("[RequireAuthenticated Error]", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}
