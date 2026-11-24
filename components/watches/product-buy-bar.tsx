// components/watches/product-buy-bar.tsx
"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { formatKz } from "@/lib/site-config";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";

/**
 * Barra fixa de compra (só mobile/tablet, < lg).
 * Fica visível por omissão e esconde-se apenas enquanto o CTA principal
 * da página (#{watchId}) está no ecrã, para não haver dois botões iguais.
 */
export function ProductBuyBar({
  name,
  price,
  soldOut = false,
  watchId,
}: {
  name: string;
  price: number;
  soldOut?: boolean;
  watchId: string;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(target);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t-2 border-rule bg-card shadow-bar lg:hidden",
        "pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out-soft",
        hidden && "translate-y-full",
      )}
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
    >
      <div className="mx-auto flex h-bar max-w-site items-center gap-4 px-gutter">
        <div className="min-w-0 flex-1">
          <p className="truncate text-meta text-muted-foreground">{name}</p>
          <p className="tabular font-display text-xl font-semibold leading-tight tracking-wide text-gold">
            {soldOut ? "Esgotado" : formatKz(price)}
          </p>
        </div>
        <WhatsAppButton
          productName={name}
          price={soldOut ? undefined : price}
          intent={soldOut ? "restock" : "buy"}
          className="shrink-0"
        >
          {soldOut ? "Pedir reposição" : "Encomendar"}
        </WhatsAppButton>
      </div>
    </div>
  );
}
