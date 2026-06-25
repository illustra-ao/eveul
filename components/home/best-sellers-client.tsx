// components/home/best-sellers.client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildProductWhatsAppLink } from "@/lib/site-config";

export type ProductCardVM = {
  id: string;
  slug: string;
  name: string;
  collection?: string;
  price: number;
  currency?: string;
  badge?: "BEST SELLER" | "LIMITED" | "NEW";
  image: string;
  imageHover?: string;
};

function formatKz(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value);
}

export function BestSellersClient({ products }: { products: ProductCardVM[] }) {
  return (
    <section
      id="best-sellers"
      className="mobile-content-auto relative overflow-hidden border-t border-border"
    >
      {/* fundo subtil */}
      <div className="absolute inset-0">
        <div className="hidden absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-[color:var(--gold)]/6 blur-[120px] md:-right-44 md:-top-32 md:block md:h-[520px] md:w-[520px] md:blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/80" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              BEST SELLERS
            </div>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              As peças mais procuradas da Eveul.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Selecção das referências mais vendidas — equilíbrio entre
              presença, acabamento e valor.
            </p>
          </div>

          {/* filtro estético */}
          <div className="-mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <Pill active>Todos</Pill>
            <Pill>Signature</Pill>
            <Pill>Limited</Pill>
            <Pill>Classic</Pill>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-border bg-card/15 p-8 text-sm text-muted-foreground backdrop-blur">
            Ainda não há produtos publicados (status: <b>active</b>).
          </div>
        ) : (
          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card/20 p-6 md:mt-12 md:flex-row md:items-center md:p-8 md:backdrop-blur">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
              QUER VER A COLECÇÃO COMPLETA?
            </div>
            <div className="mt-2 font-[var(--font-display)] text-2xl tracking-tight">
              Explore todas as referências disponíveis.
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              asChild
              className="h-11 w-full rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90 sm:w-auto"
            >
              <Link href="/watches">Ver Todos os Relógios</Link>
            </Button>

            <Link
              href="/watches"
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

function ProductCard({ product }: { product: ProductCardVM }) {
  const { slug, name, collection, price, currency = "Kz", image, imageHover, badge } =
    product;

  return (
    <article className="group relative min-w-[78vw] snap-start overflow-hidden rounded-3xl border border-border bg-card/20 sm:min-w-0 md:backdrop-blur">
      {badge && (
        <div className="absolute left-4 top-4 z-10 rounded-full border border-border bg-black/30 px-3 py-1 text-[10px] tracking-[0.22em] text-[color:var(--gold)] backdrop-blur">
          {badge}
        </div>
      )}

      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/60" />

        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          quality={72}
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />

        {imageHover && (
          <Image
            src={imageHover}
            alt={`${name} hover`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            quality={68}
            className="hidden object-cover opacity-0 transition duration-700 group-hover:opacity-100 sm:block"
          />
        )}

        <div className="absolute bottom-4 left-4 right-4 translate-y-0 opacity-100 transition duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-full border-border bg-black/30 text-foreground backdrop-blur hover:bg-black/45"
              asChild
            >
              <Link href={`/watches/${slug}`}>Ver detalhes</Link>
            </Button>

            <Button
              asChild
              className="h-11 rounded-full bg-primary px-5 text-primary-foreground hover:opacity-90"
            >
              <a
                href={buildProductWhatsAppLink(name)}
                target="_blank"
                rel="noreferrer"
              >
                Reservar
              </a>
            </Button>
          </div>
        </div>
      </div>

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
            href={`/watches/${slug}`}
            className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            VER →
          </Link>
        </div>
      </div>
    </article>
  );
}
