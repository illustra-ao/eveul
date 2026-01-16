// components/site-navbar.tsx
"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteNavbar() {
  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Left: Brand + mobile menu */}
        <div className="flex items-center gap-4">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/40 backdrop-blur hover:bg-card/60"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="text-sm font-semibold tracking-widest">
            EVEUL
          </Link>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="#watches"
            className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            WATCHES
          </Link>
          <Link
            href="#service"
            className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            WARRANTY & SERVICE
          </Link>
          <Link
            href="#stores"
            className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            STORES
          </Link>
        </nav>

        {/* Right: selectors + icons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 rounded-full bg-card/40 px-4 text-xs backdrop-blur"
          >
            AKZ
            <span className="ml-2 text-muted-foreground">▼</span>
          </Button>

          <Button
            variant="outline"
            className="h-9 rounded-full bg-card/40 px-4 text-xs backdrop-blur"
          >
            PT
            <span className="ml-2 text-muted-foreground">▼</span>
          </Button>

          <div className="ml-2 hidden items-center gap-2 sm:flex">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/40 backdrop-blur hover:bg-card/60"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/40 backdrop-blur hover:bg-card/60"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/40 backdrop-blur hover:bg-card/60"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
