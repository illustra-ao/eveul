"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Section } from "@/components/brand/section";
import { ProductCard } from "@/components/brand/product-card";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";
import { Button } from "@/components/ui/button";
import type { ProductCardVM } from "./watches-catalog-supabase";

const collections = ["Signature", "Limited", "Classic"] as const;
type Collection = (typeof collections)[number];
type Filter = "Todos" | Collection;
type Sort = "recentes" | "preco-asc" | "preco-desc";

const sortLabels: Record<Sort, string> = {
  recentes: "Mais recentes",
  "preco-asc": "Preço: mais baixo",
  "preco-desc": "Preço: mais alto",
};

/** "signature" → "Signature"; qualquer outro valor → "Todos" */
export function parseCollection(value?: string | null): Filter {
  const match = collections.find((c) => c.toLowerCase() === value?.toLowerCase());
  return match ?? "Todos";
}

export function WatchesCatalogClient({
  initialProducts,
  initialCollection,
}: {
  initialProducts: ProductCardVM[];
  /** valor de ?colecao= lido no servidor */
  initialCollection?: string | null;
}) {
  const [filter, setFilter] = useState<Filter>(() => parseCollection(initialCollection));
  const [sort, setSort] = useState<Sort>("recentes");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["Todos", initialProducts.length]]);
    for (const c of collections) {
      map.set(c, initialProducts.filter((p) => p.collection === c).length);
    }
    return map;
  }, [initialProducts]);

  const visible = useMemo(() => {
    const list = filter === "Todos" ? initialProducts : initialProducts.filter((p) => p.collection === filter);
    if (sort === "preco-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "preco-desc") return [...list].sort((a, b) => b.price - a.price);
    return list; // já vem ordenado por data (servidor)
  }, [filter, sort, initialProducts]);

  // Mantém o filtro no URL (partilhável, e o "voltar" do browser volta ao mesmo filtro)
  const selectFilter = (next: Filter) => {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "Todos") url.searchParams.delete("colecao");
    else url.searchParams.set("colecao", next.toLowerCase());
    window.history.replaceState(null, "", url);
  };

  const filters: Filter[] = ["Todos", ...collections];

  return (
    <>
      <Section spacing="compact" className="pb-8 md:pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="rule-top text-h1">Relógios</h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Três colecções, poucas peças de cada. Encomenda pelo WhatsApp e recebe em Luanda em 24 a 72 horas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="ordenar" className="text-meta text-muted-foreground">
              Ordenar
            </label>
            <select
              id="ordenar"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-11 rounded-sm border border-input bg-background px-3 text-base text-foreground"
            >
              {(Object.keys(sortLabels) as Sort[]).map((s) => (
                <option key={s} value={s}>
                  {sortLabels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          role="group"
          aria-label="Filtrar por colecção"
          className="-mx-gutter mt-8 flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] md:mx-0 md:px-0"
        >
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => selectFilter(f)}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-sm border px-4 font-display text-sm font-semibold uppercase tracking-button transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
              >
                {f}
                <span className={cn("tabular text-meta font-medium", active ? "text-background/70" : "text-muted-foreground")}>
                  {counts.get(f) ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section spacing="none" className="pb-section">
        <p aria-live="polite" className="sr-only">
          {visible.length} {visible.length === 1 ? "modelo" : "modelos"}
        </p>

        {visible.length === 0 ? (
          <div className="border border-border px-6 py-12 text-center">
            <p className="text-h3">Sem modelos nesta colecção, por agora</p>
            <p className="mt-2 text-muted-foreground">Pergunta-nos pelas próximas edições.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={() => selectFilter("Todos")}>
                Ver todos
              </Button>
              <WhatsAppButton>Perguntar no WhatsApp</WhatsAppButton>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p, i) => (
              <li key={p.id}>
                <ProductCard
                  className="h-full"
                  priority={i < 2}
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                  product={{
                    slug: p.slug,
                    name: p.name,
                    price: p.price,
                    collection: p.collection,
                    badge: p.badge,
                    image: p.image,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section tone="raised" spacing="compact" className="border-t border-border">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-h2">Não sabes qual escolher?</h2>
            <p className="mt-2 text-muted-foreground">
              Diz-nos o estilo e o orçamento. Sugerimos o modelo certo, também para oferecer.
            </p>
          </div>
          <WhatsAppButton className="w-full md:w-auto">Pedir uma sugestão</WhatsAppButton>
        </div>
      </Section>
    </>
  );
}
