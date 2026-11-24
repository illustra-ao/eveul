"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Section } from "@/components/brand/section";
import { ProductCard } from "@/components/brand/product-card";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";
import { Button } from "@/components/ui/button";
import {
  categories,
  categoryFromParam,
  categoryLabels,
  categoryParams,
  soldOutLast,
  type Category,
} from "@/lib/products";
import type { ProductCardVM } from "./watches-catalog-supabase";

const collections = ["Signature", "Limited", "Classic"] as const;
type Collection = (typeof collections)[number];
type Filter = "Todos" | Collection;
type CategoryFilter = "all" | Category;
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

const chipClass = (active: boolean) =>
  cn(
    "inline-flex h-11 shrink-0 items-center gap-2 rounded-sm border px-4 font-display text-sm font-semibold uppercase tracking-button transition-colors",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
  );

const rowClass =
  "-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] md:mx-0 md:px-0";

function Count({ n, active }: { n: number; active: boolean }) {
  return (
    <span className={cn("tabular text-meta font-medium", active ? "text-background/70" : "text-muted-foreground")}>
      {n}
    </span>
  );
}

export function WatchesCatalogClient({
  initialProducts,
  initialCollection,
  initialCategory,
}: {
  initialProducts: ProductCardVM[];
  /** valor de ?colecao= lido no servidor */
  initialCollection?: string | null;
  /** valor de ?categoria= lido no servidor */
  initialCategory?: string | null;
}) {
  const [filter, setFilter] = useState<Filter>(() => parseCollection(initialCollection));
  const [category, setCategory] = useState<CategoryFilter>(() => categoryFromParam(initialCategory) ?? "all");
  const [sort, setSort] = useState<Sort>("recentes");

  // Só mostra o filtro de categoria quando já há óculos publicados
  const hasEyewear = useMemo(() => initialProducts.some((p) => p.category === "eyewear"), [initialProducts]);
  const activeCategory: CategoryFilter = hasEyewear ? category : "all";

  const inCategory = useMemo(
    () => (activeCategory === "all" ? initialProducts : initialProducts.filter((p) => p.category === activeCategory)),
    [activeCategory, initialProducts],
  );

  const categoryCounts = useMemo(() => {
    const map = new Map<CategoryFilter, number>([["all", initialProducts.length]]);
    for (const c of categories) map.set(c, initialProducts.filter((p) => p.category === c).length);
    return map;
  }, [initialProducts]);

  const collectionCounts = useMemo(() => {
    const map = new Map<Filter, number>([["Todos", inCategory.length]]);
    for (const c of collections) map.set(c, inCategory.filter((p) => p.collection === c).length);
    return map;
  }, [inCategory]);

  const visible = useMemo(() => {
    const list = filter === "Todos" ? inCategory : inCategory.filter((p) => p.collection === filter);
    const sorted =
      sort === "preco-asc"
        ? [...list].sort((a, b) => a.price - b.price)
        : sort === "preco-desc"
          ? [...list].sort((a, b) => b.price - a.price)
          : list; // já vem ordenado por data (servidor)
    return soldOutLast(sorted);
  }, [filter, sort, inCategory]);

  // Mantém os filtros no URL (partilhável; o "voltar" do browser repõe o estado)
  const syncUrl = (nextCategory: CategoryFilter, nextFilter: Filter) => {
    const url = new URL(window.location.href);
    if (nextCategory === "all") url.searchParams.delete("categoria");
    else url.searchParams.set("categoria", categoryParams[nextCategory]);
    if (nextFilter === "Todos") url.searchParams.delete("colecao");
    else url.searchParams.set("colecao", nextFilter.toLowerCase());
    window.history.replaceState(null, "", url);
  };

  const selectFilter = (next: Filter) => {
    setFilter(next);
    syncUrl(activeCategory, next);
  };

  const selectCategory = (next: CategoryFilter) => {
    setCategory(next);
    syncUrl(next, filter);
  };

  const filters: Filter[] = ["Todos", ...collections];
  const title =
    activeCategory !== "all" ? categoryLabels[activeCategory] : hasEyewear ? "Relógios e óculos" : "Relógios";

  return (
    <>
      <Section spacing="compact" className="pb-8 md:pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="rule-top text-h1">{title}</h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Poucas peças de cada modelo. Encomenda pelo WhatsApp e recebe em Luanda em 24 a 72 horas.
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

        <div className="mt-8 space-y-2">
          {hasEyewear ? (
            <div role="group" aria-label="Filtrar por categoria" className={rowClass}>
              {(["all", ...categories] as CategoryFilter[]).map((c) => {
                const active = activeCategory === c;
                return (
                  <button key={c} type="button" aria-pressed={active} onClick={() => selectCategory(c)} className={chipClass(active)}>
                    {c === "all" ? "Tudo" : categoryLabels[c]}
                    <Count n={categoryCounts.get(c) ?? 0} active={active} />
                  </button>
                );
              })}
            </div>
          ) : null}

          <div role="group" aria-label="Filtrar por colecção" className={rowClass}>
            {filters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectFilter(f)}
                  className={chipClass(active)}
                >
                  {f === "Todos" && hasEyewear ? "Todas as colecções" : f}
                  <Count n={collectionCounts.get(f) ?? 0} active={active} />
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section spacing="none" className="pb-section">
        <p aria-live="polite" className="sr-only">
          {visible.length} {visible.length === 1 ? "modelo" : "modelos"}
        </p>

        {visible.length === 0 ? (
          <div className="border border-border px-6 py-12 text-center">
            <p className="text-h3">Sem modelos aqui, por agora</p>
            <p className="mt-2 text-muted-foreground">Pergunta-nos pelas próximas edições.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilter("Todos");
                  setCategory("all");
                  syncUrl("all", "Todos");
                }}
              >
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
                    availability: p.availability,
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
