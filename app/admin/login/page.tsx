import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { getAdminAuthConfig, getSafeAdminNextPath } from "@/lib/admin-auth";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login do Administrador",
  description: "Acesso reservado à área administrativa Eveul.",
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
    <main className="relative">
      <SiteNavbar />
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/10 blur-[140px]" />
          <div className="absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[160px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/90" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pb-14 pt-28 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <AdminLoginForm next={next} usesDevDefault={config.usesDevDefault} />
          </div>

          <div className="lg:col-span-7">
            <div className="h-full rounded-4xl border border-border bg-card/10 p-8 backdrop-blur md:p-10">
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                EVEUL BACKOFFICE
              </div>
              <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
                Gestão da colecção, sem expor a loja.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                Esta área permite criar produtos, publicar modelos, gerir
                imagens e organizar stock. O acesso é separado da experiência
                pública para manter a vitrine limpa e segura.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Info label="Produtos" value="Criar e editar" />
                <Info label="Imagens" value="Upload e principal" />
                <Info label="Estado" value="Draft / Active" />
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <Link
                  href="/"
                  className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
                >
                  VOLTAR À LOJA →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-black/15 p-4">
      <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
        {label.toUpperCase()}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
    </div>
  );
}
