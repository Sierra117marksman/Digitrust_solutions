import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AdminCrmApp } from "./AdminCrmApp";
import ForcePasswordReset from "./ForcePasswordReset";

export const metadata: Metadata = {
  title: "CRM Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  if (admin.mustResetPassword) {
    return <ForcePasswordReset admin={admin} />;
  }

  return <AdminCrmApp admin={admin} />;
}
