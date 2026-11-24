// components/site-navbar.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { defaultWhatsAppLink, siteConfig } from "@/lib/site-config";
import { categoryParams } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { EveulLogo, WhatsAppIcon } from "@/components/brand/icons";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  /** Para links do catálogo: activo quando ?categoria= coincide */
  categoria?: string;
};

const nav: NavItem[] = [
  { href: `/watches?categoria=${categoryParams.watch}`, label: "Relógios", categoria: categoryParams.watch },
  { href: `/watches?categoria=${categoryParams.eyewear}`, label: "Óculos", categoria: categoryParams.eyewear },
  { href: "/about", label: "Sobre" },
  { href: "/support", label: "Garantia" },
  { href: "/contact", label: "Contactos" },
];

const trust = ["Entrega em Luanda 24–72h", "Garantia 12 meses", "Pagamento AppyPay"];

function isActive(item: NavItem, pathname: string, categoria: string | null) {
  if (item.categoria) return pathname === "/watches" && categoria === item.categoria;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

type Variant = "bar" | "sheet";

const linkClass: Record<Variant, (active: boolean) => string> = {
  bar: (active) =>
    cn(
      "inline-flex min-h-touch items-center font-display text-sm font-semibold uppercase tracking-button transition-colors",
      active
        ? "text-foreground underline decoration-rule decoration-2 underline-offset-8"
        : "text-muted-foreground hover:text-foreground",
    ),
  sheet: (active) =>
    cn(
      "flex min-h-14 items-center border-b border-border font-display text-h2 uppercase",
      active ? "text-gold" : "text-foreground",
    ),
};

function NavLinks({ variant, categoria }: { variant: Variant; categoria: string | null }) {
  const pathname = usePathname();
  return (
    <>
      {nav.map((item) => {
        const active = isActive(item, pathname, categoria);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={linkClass[variant](active)}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

/** Lê ?categoria=; precisa de <Suspense> nas páginas estáticas */
function NavLinksWithParams({ variant }: { variant: Variant }) {
  const params = useSearchParams();
  return <NavLinks variant={variant} categoria={params.get("categoria")} />;
}

function Links({ variant }: { variant: Variant }) {
  return (
    <Suspense fallback={<NavLinks variant={variant} categoria={null} />}>
      <NavLinksWithParams variant={variant} />
    </Suspense>
  );
}

/**
 * Barra fixa, sólida (sem blur: barato no mobile), 64px de altura.
 * O WhatsApp está sempre visível: ícone no mobile, botão no desktop.
 */
export function SiteNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95">
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-4 px-gutter">
        <Link href="/" aria-label="Eveul, página inicial" className="-m-2 p-2">
          <EveulLogo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          <Links variant="bar" />
        </nav>

        <div className="flex items-center gap-1">
          <WhatsAppButton size="sm" className="hidden md:inline-flex">
            Falar connosco
          </WhatsAppButton>

          <a
            href={defaultWhatsAppLink}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar connosco no WhatsApp"
            className="inline-flex size-11 items-center justify-center text-foreground md:hidden"
          >
            <WhatsAppIcon className="size-6" />
          </a>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link" size="icon" aria-label="Abrir menu" className="md:hidden">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-full flex-col border-border bg-background p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border px-gutter py-4">
                <SheetTitle asChild>
                  <span><EveulLogo /></span>
                </SheetTitle>
                <SheetDescription className="sr-only">Menu de navegação</SheetDescription>
              </SheetHeader>

              <nav aria-label="Menu" className="flex flex-col px-gutter py-6">
                <Links variant="sheet" />
              </nav>

              <div className="mt-auto space-y-5 border-t border-border px-gutter py-6">
                <WhatsAppButton className="w-full">Falar connosco</WhatsAppButton>
                <ul className="space-y-1.5 text-meta text-muted-foreground">
                  {trust.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                  <li className="pt-2 text-foreground">{siteConfig.whatsappDisplay}</li>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
