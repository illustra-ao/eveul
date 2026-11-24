import type { Metadata } from "next";
import { getAdminAuthConfig, getSafeAdminNextPath } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login do Administrador",
  description: "Acesso reservado à área administrativa Eveul.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = getSafeAdminNextPath(params?.next ?? null);
  const config = getAdminAuthConfig();

  return (
    <AdminShell hideNav>
      <div className="mx-auto max-w-sm py-6 md:py-16">
        <AdminLoginForm next={next} usesDevDefault={config.usesDevDefault} />
      </div>
    </AdminShell>
  );
}
