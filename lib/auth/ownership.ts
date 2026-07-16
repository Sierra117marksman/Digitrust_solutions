import { CurrentAdmin } from "./session";

export function canManageUser(actor: CurrentAdmin, targetRole: string): boolean {
  if (actor.role === "owner") return true;
  
  // Managers can only manage employees
  if (actor.role === "manager" && targetRole === "employee") return true;
  
  return false;
}

export function canEditLead(actor: CurrentAdmin, lead: { assignedTo?: string }): boolean {
  if (actor.role === "owner" || actor.role === "manager") return true;
  
  // Employees can only edit leads assigned to them
  if (actor.role === "employee" && lead.assignedTo === actor.id) return true;
  
  return false;
}
