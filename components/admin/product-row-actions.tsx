"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

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

  const isActive = status === "active";

  return (
    <div className="flex flex-wrap items-center gap-1 md:justify-end">
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/products/${id}`}>Editar</Link>
      </Button>

      <Button
        type="button"
        variant={isActive ? "outline" : "default"}
        size="sm"
        disabled={isPending}
        onClick={() => setStatus(isActive ? "draft" : "active")}
      >
        {isPending ? "A guardar…" : isActive ? "Despublicar" : "Publicar"}
      </Button>

      <Button asChild variant="link" size="sm" className="px-2">
        <Link href={`/watches/${slug}`} target="_blank">Ver</Link>
      </Button>

      {status !== "archived" ? (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="px-2 text-muted-foreground"
          disabled={isPending}
          onClick={() => setStatus("archived")}
        >
          Arquivar
        </Button>
      ) : null}
    </div>
  );
}
