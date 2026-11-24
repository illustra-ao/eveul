// components/admin/admin-shell.tsx
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EveulMark } from "@/components/brand/icons";

const tabs = [
  { href: "/admin/products", label: "Produtos", value: "products" },
  { href: "/admin/carousel", label: "Carrossel", value: "carousel" },
] as const;

type AdminSection = (typeof tabs)[number]["value"];

/**
 * Estrutura de todas as páginas do admin.
 * Sem navbar/footer da loja; tipografia neutra via .admin-ui (globals.css).
 */
export function AdminShell({
  active,
  title,
  description,
  actions,
  narrow = false,
  hideNav = false,
  children,
}: {
  active?: AdminSection;
  title?: string;
  description?: string;
  /** Botões alinhados à direita do título */
  actions?: React.ReactNode;
  narrow?: boolean;
  /** Login: só a marca, sem separadores nem "Sair" */
  hideNav?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-ui min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-site flex-wrap items-center gap-x-8 px-gutter">
          <Link href={hideNav ? "/" : "/admin/products"} className="flex h-14 items-center gap-2.5">
            <EveulMark className="h-4 w-5 text-gold" />
            <span className="text-sm font-semibold">Eveul Admin</span>
          </Link>

          {!hideNav ? (
            <>
              <nav aria-label="Admin" className="order-last -mx-gutter flex w-[calc(100%+2*var(--spacing-gutter))] border-t border-border px-gutter md:order-none md:mx-0 md:w-auto md:border-t-0 md:px-0">
                {tabs.map((tab) => {
                  const isActive = tab.value === active;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "-mb-px inline-flex h-12 items-center border-b-2 px-3 text-sm font-medium transition-colors md:h-14",
                        isActive
                          ? "border-gold text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="ml-auto flex items-center gap-2">
                <Button asChild variant="link" size="sm">
                  <a href="/" target="_blank" rel="noreferrer">Ver site</a>
                </Button>
                {/* <a> e não <Link>: o prefetch de um Link faria logout sozinho */}
                <Button asChild variant="outline" size="sm">
                  <a href="/admin/logout">Sair</a>
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </header>

      <main className={cn("mx-auto px-gutter py-8 md:py-10", narrow ? "max-w-3xl" : "max-w-site")}>
        {title ? (
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl">{title}</h1>
              {description ? <p className="mt-1.5 text-muted-foreground">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
