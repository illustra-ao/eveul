// components/site-navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  { href: "/watches", label: "Relógios" },
  { href: "/about", label: "Sobre" },
  { href: "/#service", label: "Garantia & Serviço" },
  { href: "/#stores", label: "Lojas" },
];

export function SiteNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      {/* top bar */}
      <div className="absolute inset-0 border-b border-border bg-black/25 backdrop-blur supports-[backdrop-filter]:bg-black/20" />
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/25 backdrop-blur hover:bg-card/40"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="border-border bg-black/80 text-foreground backdrop-blur"
            >
              <SheetHeader>
                <SheetTitle className="text-left tracking-widest">
                  EVEUL
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-2">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-2xl border border-border/60 bg-card/10 px-4 py-3 text-sm tracking-[0.12em] hover:bg-card/20",
                      pathname === item.href
                        ? "text-[color:var(--gold)]"
                        : "text-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-border/60 bg-card/10 p-4 text-xs leading-6 text-muted-foreground">
                ENVIO 24–72H (LUANDA) • GARANTIA 12 MESES • PAGAMENTO APPYPAY
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-sm font-semibold tracking-widest">
            EVEUL
          </Link>
        </div>

        {/* Center */}
        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-xs tracking-[0.22em] transition",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <IconBtn label="Pesquisar">
            <Search className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Conta">
            <User className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Carrinho">
            <ShoppingBag className="h-4 w-4" />
          </IconBtn>

          <Button className="ml-2 hidden h-10 rounded-full bg-primary px-5 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90 sm:inline-flex">
            Comprar agora
          </Button>
        </div>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/25 backdrop-blur hover:bg-card/40"
      aria-label={label}
    >
      {children}
    </button>
  );
}
