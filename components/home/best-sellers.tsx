// components/home/best-sellers.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Product = {
  id: string; // interno (carrinho, tracking)
  slug: string; // ✅ público (rota)
  name: string;
  collection?: string;
  price: number;
  currency?: string;
  image: string;
  imageHover?: string;
  badge?: "BEST SELLER" | "LIMITED" | "NEW";
};

const products: Product[] = [
  {
    id: "prod_jupiter", // podes manter como quiseres
    slug: "eveul-jupiter",
    name: "Eveul Jupiter",
    collection: "Signature",
    price: 189000,
    currency: "Kz",
    image: "/images/feature-4.jpg",
    imageHover: "/images/feature-4.jpg",
    badge: "BEST SELLER",
  },
  {
    id: "prod_paraiba",
    slug: "eveul-paraiba",
    name: "Eveul Paraíba",
    collection: "Limited Edition",
    price: 265000,
    currency: "Kz",
    image: "/images/feature-3.jpg",
    imageHover: "/images/feature-3.jpg",
    badge: "LIMITED",
  },
  {
    id: "prod_noir",
    slug: "eveul-noir",
    name: "Eveul Noir",
    collection: "Classic",
    price: 149000,
    currency: "Kz",
    image: "/images/feature-1.jpg",
    imageHover: "/images/feature-1.jpg",
    badge: "NEW",
  },
  {
    id: "prod_goldline",
    slug: "eveul-goldline",
    name: "Eveul Goldline",
    collection: "Signature",
    price: 210000,
    currency: "Kz",
    image: "/images/feature-2.jpg",
    imageHover: "/images/feature-2.jpg",
    badge: "BEST SELLER",
  },
];

export function BestSellers() {
  return (
    <section
      id="watches"
      className="relative overflow-hidden border-t border-border"
    >
      {/* fundo subtil */}
      <div className="absolute inset-0">
        <div className="absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-[color:var(--gold)]/6 blur-[120px] md:-right-44 md:-top-32 md:h-[520px] md:w-[520px] md:blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/80" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              BEST SELLERS
            </div>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
              As peças mais procuradas da Eveul.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Selecção das referências mais vendidas — equilíbrio entre
              presença, acabamento e valor. Prontas para envio e compra
              imediata.
            </p>
          </div>

          {/* “Filtro” simples (estético) */}
          <div className="flex items-center gap-2">
            <Pill active>Todos</Pill>
            <Pill>Signature</Pill>
            <Pill>Limited</Pill>
            <Pill>Classic</Pill>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card/20 p-8 backdrop-blur md:flex-row md:items-center">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
              QUER VER A COLECÇÃO COMPLETA?
            </div>
            <div className="mt-2 font-[var(--font-display)] text-2xl tracking-tight">
              Explore todas as referências disponíveis.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90"
            >
              <Link href="/watches">Ver Todos os Relógios</Link>
            </Button>

            <Link
              href="#"
              className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
            >
              CONSULTAR STOCK →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={[
        "h-9 rounded-full border px-4 text-xs tracking-[0.18em] backdrop-blur transition",
        active
          ? "border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 text-foreground"
          : "border-border bg-card/20 text-muted-foreground hover:bg-card/35 hover:text-foreground",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function ProductCard({ product }: { product: Product }) {
  const {
    id,
    slug,
    name,
    collection,
    price,
    currency = "Kz",
    image,
    imageHover,
    badge,
  } = product;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/20 backdrop-blur">
      {/* Badge */}
      {badge && (
        <div className="absolute left-4 top-4 z-10 rounded-full border border-border bg-black/30 px-3 py-1 text-[10px] tracking-[0.22em] text-[color:var(--gold)] backdrop-blur">
          {badge}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/60" />

        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />

        {imageHover && (
          <Image
            src={imageHover}
            alt={`${name} hover`}
            fill
            className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
          />
        )}

        {/* Quick actions */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-full border-border bg-black/30 text-foreground backdrop-blur hover:bg-black/45"
              asChild
            >
              <Link href={`/watches/${slug}`}>Ver detalhes</Link>
            </Button>

            <Button
              className="h-11 rounded-full bg-primary px-5 text-primary-foreground hover:opacity-90"
              onClick={() => {
                // TODO: integrar com carrinho
                console.log("add to cart", id);
              }}
            >
              + Carrinho
            </Button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
          {collection?.toUpperCase() ?? "EVEUL"}
        </div>

        <h3 className="mt-2 font-[var(--font-display)] text-xl tracking-tight">
          {name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-foreground">
            <span className="text-[color:var(--gold)]">{currency}</span>{" "}
            {formatKz(price)}
          </div>

          <Link
            href={`/watches/${slug}`} // ✅ slug
            className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            VER →
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatKz(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value);
}
