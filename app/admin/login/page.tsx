import { companyConfig } from "@/config/company";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="admin-login-page">
      <Link className="admin-login-brand" href="/">
        <Image src={companyConfig.branding.logo} alt={companyConfig.company.name} width={500} height={500} priority />
      </Link>
      <LoginForm />
    </main>
  );
}
