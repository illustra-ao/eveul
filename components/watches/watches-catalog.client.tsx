"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductCardVM } from "./watches-catalog-supabase";

type Filter = "Todos" | "Signature" | "Limited" | "Classic";
type Sort = "Relevância" | "Preço: menor" | "Preço: maior" | "Nome";

function formatKz(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value);
}

export function WatchesCatalogClient({
  initialProducts,
}: {
  initialProducts: ProductCardVM[];
}) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [sort, setSort] = useState<Sort>("Relevância");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = initialProducts.filter((p) => {
      const matchesFilter = filter === "Todos" ? true : p.collection === filter;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      if (sort === "Preço: menor") return a.price - b.price;
      if (sort === "Preço: maior") return b.price - a.price;
      if (sort === "Nome") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [filter, sort, q, initialProducts]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/8 blur-[150px]" />
        <div className="absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/90" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              COLECÇÃO
            </div>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-6xl">
              Relógios Eveul.
              <br />
              Presença em cada detalhe.
            </h1>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Explore as referências disponíveis. Edições limitadas, acabamento
              premium e compra simples — com suporte local.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:max-w-[520px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Pesquisar modelos..."
                className="h-11 rounded-full bg-black/25 text-foreground placeholder:text-muted-foreground"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 rounded-full border border-border bg-card/20 px-4 text-xs tracking-[0.18em] text-foreground backdrop-blur"
              >
                <option>Relevância</option>
                <option>Preço: menor</option>
                <option>Preço: maior</option>
                <option>Nome</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Pill
                active={filter === "Todos"}
                onClick={() => setFilter("Todos")}
              >
                Todos
              </Pill>
              <Pill
                active={filter === "Signature"}
                onClick={() => setFilter("Signature")}
              >
                Signature
              </Pill>
              <Pill
                active={filter === "Limited"}
                onClick={() => setFilter("Limited")}
              >
                Limited
              </Pill>
              <Pill
                active={filter === "Classic"}
                onClick={() => setFilter("Classic")}
              >
                Classic
              </Pill>
            </div>
          </div>
        </div>

        <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/15 backdrop-blur"
            >
              {p.badge && (
                <div className="absolute left-4 top-4 z-10 rounded-full border border-border bg-black/30 px-3 py-1 text-[10px] tracking-[0.22em] text-[color:var(--gold)] backdrop-blur">
                  {p.badge}
                </div>
              )}

              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/65" />
                <Image
                  src={p.image ?? "/images/placeholder.jpg"}
                  alt={p.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  unoptimized
                />
              </div>

              <div className="p-5">
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  {p.collection.toUpperCase()}
                </div>
                <h3 className="mt-2 font-[var(--font-display)] text-xl tracking-tight">
                  {p.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-foreground">
                    <span className="text-[color:var(--gold)]">
                      {p.currency}
                    </span>{" "}
                    {formatKz(p.price)}
                  </div>
                  <Link
                    href={`/watches/${p.slug}`}
                    className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
                  >
                    VER →
                  </Link>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 flex-1 rounded-full border-border bg-black/20 backdrop-blur hover:bg-black/35"
                  >
                    <Link href={`/watches/${p.slug}`}>Detalhes</Link>
                  </Button>
                  <Button className="h-11 rounded-full bg-primary px-5 text-primary-foreground hover:opacity-90">
                    + Carrinho
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl border border-border bg-card/15 p-8 text-sm text-muted-foreground backdrop-blur">
            Nenhum modelo encontrado. Ajuste o filtro ou a pesquisa.
          </div>
        )}
      </div>
    </section>
  );
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 rounded-full border px-5 text-xs tracking-[0.18em] backdrop-blur transition",
        active
          ? "border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 text-foreground"
          : "border-border bg-card/15 text-muted-foreground hover:bg-card/25 hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
