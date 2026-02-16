"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Status = "active" | "draft" | "archived";

export function ProductRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: Status;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setStatus = async (next: Status) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json?.message || "Falha ao actualizar estado.");
      return;
    }

    startTransition(() => router.refresh());
  };

  const publishLabel = status === "active" ? "DESPUBLICAR" : "PUBLICAR";

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
      <Link
        href={`/admin/products/${id}`}
        className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground px-2"
      >
        EDITAR →
      </Link>

      <button
        type="button"
        disabled={isPending}
        onClick={() => setStatus(status === "active" ? "draft" : "active")}
        className="text-xs tracking-[0.22em] text-[color:var(--gold)] cursor-pointer hover:opacity-80 disabled:opacity-40 px-2"
      >
        {isPending ? "..." : publishLabel}
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => setStatus("archived")}
        className="text-xs tracking-[0.22em] cursor-pointer text-muted-foreground hover:text-foreground disabled:opacity-40 px-2"
      >
        ARQUIVAR
      </button>
    </div>
  );
}
