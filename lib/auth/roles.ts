import { PERMISSIONS, Permission } from "./permissions";

export type Role = "owner" | "manager" | "developer" | "employee";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: Object.values(PERMISSIONS),
  
  manager: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER, // Will be restricted to creating employees by ownership checks
    PERMISSIONS.EDIT_USER,   // Restricted to editing employees
    PERMISSIONS.DELETE_USER, // Restricted to deleting employees
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.EDIT_LEAD,
    PERMISSIONS.ASSIGN_LEADS,
    PERMISSIONS.EXPORT_LEADS,
  ],
  
  developer: [
    PERMISSIONS.VIEW_USERS,
  ],
  
  employee: [
    PERMISSIONS.VIEW_LEADS, // Restricted to assigned leads by ownership checks
    PERMISSIONS.EDIT_LEAD,  // Restricted to assigned leads by ownership checks
  ],
};

/**
 * Computes a user's final permissions based on their role and any user-level overrides.
 */
export function computePermissions(role: Role, customPermissions?: Permission[], deniedPermissions?: Permission[]): Set<Permission> {
  const basePermissions = ROLE_PERMISSIONS[role] || [];
  const finalPermissions = new Set<Permission>(basePermissions);
  
  if (customPermissions) {
    customPermissions.forEach(p => finalPermissions.add(p));
  }
  
  if (deniedPermissions) {
    deniedPermissions.forEach(p => finalPermissions.delete(p));
  }
  
  return finalPermissions;
}

export function hasPermission(userPermissions: Set<Permission>, required: Permission): boolean {
  return userPermissions.has(required);
}
