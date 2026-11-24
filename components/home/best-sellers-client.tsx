// components/home/best-sellers-client.tsx
// Apresentação apenas (sem estado): pode ser renderizado no servidor.
import Link from "next/link";

import type { Availability, Category } from "@/lib/products";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/brand/section";
import { SectionHeader } from "@/components/brand/section-header";
import { ProductCard } from "@/components/brand/product-card";

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
  category?: Category;
  availability?: Availability;
};

const gridClass =
  "-mx-gutter flex snap-x snap-mandatory gap-3 overflow-x-auto px-gutter pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4";

const itemClass = "w-[72vw] shrink-0 snap-start sm:w-auto";

export function BestSellersClient({ products }: { products: ProductCardVM[] }) {
  return (
    <Section id="mais-vendidos" aria-labelledby="mais-vendidos-titulo" className="mobile-content-auto scroll-mt-16">
      <SectionHeader
        id="mais-vendidos-titulo"
        title="Mais vendidos"
        action={
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href="/watches">Ver todos os modelos</Link>
          </Button>
        }
      />

      {products.length === 0 ? (
        <p className="border border-border p-8 text-muted-foreground">
          Ainda não há produtos publicados.
        </p>
      ) : (
        <ul className={gridClass}>
          {products.map((p) => (
            <li key={p.id} className={itemClass}>
              <ProductCard
                className="h-full"
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

      <Button asChild variant="secondary" className="mt-8 w-full md:hidden">
        <Link href="/watches">Ver todos os modelos</Link>
      </Button>
    </Section>
  );
}

/** Esqueleto usado pelo <Suspense> da home */
export function BestSellersSkeleton() {
  return (
    <Section aria-hidden="true" className="mobile-content-auto">
      <div className="mb-10 h-10 w-56 animate-pulse bg-muted md:mb-14" />
      <ul className={gridClass}>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className={itemClass}>
            <div className="aspect-[4/5] animate-pulse bg-card" />
            <div className="mt-4 h-5 w-2/3 animate-pulse bg-muted" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
