// components/watches/watch-product-page.tsx
// Componente de servidor: só a galeria e a barra fixa correm no cliente.
import Link from "next/link";

import { formatKz, siteConfig } from "@/lib/site-config";
import { getPrimaryImage } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/brand/section";
import { SectionHeader } from "@/components/brand/section-header";
import { ProductCard } from "@/components/brand/product-card";
import { ProductBadge, type ProductBadgeValue } from "@/components/brand/product-badge";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";
import { EveulMark } from "@/components/brand/icons";
import { ProductGallery } from "@/components/watches/product-gallery";
import { ProductBuyBar } from "@/components/watches/product-buy-bar";

type Spec = { k: string; v: string };

export type WatchProduct = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  price: number;
  currency?: string;
  badge?: string;
  images: readonly string[];
  description: string;
  highlights: readonly string[];
  specs: Spec[];
  stockLabel?: string;
};

const BUY_CTA_ID = "comprar";

const reassurance = [
  { k: "Entrega", v: "Luanda, 24 a 72 horas" },
  { k: "Garantia", v: "12 meses" },
  { k: "Pagamento", v: "AppyPay, referência ou TPA" },
];

function asBadge(value?: string): ProductBadgeValue | undefined {
  return value === "BEST SELLER" || value === "LIMITED" || value === "NEW" ? value : undefined;
}

export function WatchProductPage({
  product,
  related,
}: {
  product: WatchProduct;
  related: WatchProduct[];
}) {
  const images = product.images?.length ? product.images : [siteConfig.fallbackProductImage];
  const badge = asBadge(product.badge);
  // Garantia e envio já aparecem no bloco de confiança; não repetir nas especificações.
  const specs = product.specs.filter((s) => !["Garantia", "Envio"].includes(s.k));

  return (
    <>
      <Section spacing="none" className="pb-section pt-4 lg:pt-10">
        {/* Caminho */}
        <nav aria-label="Caminho" className="mb-4 hidden text-meta text-muted-foreground lg:block">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Início</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/watches" className="hover:text-foreground">Relógios</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ProductGallery
              images={images}
              name={product.name}
              badge={<ProductBadge badge={badge} />}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="text-meta text-muted-foreground">Colecção {product.collection}</p>
              <h1 className="mt-2 text-h1">{product.name}</h1>

              <p className="tabular mt-4 font-display text-[2rem] font-semibold leading-none tracking-wide text-gold">
                {formatKz(product.price)}
              </p>

              {product.description ? (
                <p className="mt-6 text-lead text-muted-foreground">{product.description}</p>
              ) : null}

              {product.highlights.length > 0 ? (
                <ul className="mt-6 space-y-2.5">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3">
                      <EveulMark className="h-2.5 w-3 shrink-0 text-gold" strokeWidth={10} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* CTA principal: a barra fixa do mobile esconde-se enquanto este bloco está visível */}
              <div id={BUY_CTA_ID} className="mt-8 flex flex-col gap-3">
                <WhatsAppButton productName={product.name} price={product.price} size="lg" className="w-full" />
                <p className="text-center text-meta text-muted-foreground">
                  Respondemos no WhatsApp com disponibilidade e formas de pagamento.
                </p>
              </div>

              <dl className="mt-8 border-t border-border">
                {reassurance.map((r) => (
                  <div key={r.k} className="flex justify-between gap-4 border-b border-border py-3.5">
                    <dt className="text-muted-foreground">{r.k}</dt>
                    <dd className="text-right">{r.v}</dd>
                  </div>
                ))}
              </dl>

              {specs.length > 0 ? (
                <section aria-labelledby="specs-titulo" className="mt-10">
                  <h2 id="specs-titulo" className="rule-top text-h3">Especificações</h2>
                  <dl className="mt-4 border-t border-border">
                    {specs.map((s) => (
                      <div key={s.k} className="flex justify-between gap-4 border-b border-border py-3.5">
                        <dt className="text-muted-foreground">{s.k}</dt>
                        <dd className="text-right">{s.v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="raised" aria-labelledby="relacionados-titulo" className="mobile-content-auto border-t border-border">
          <SectionHeader
            id="relacionados-titulo"
            title={`Mais da colecção ${product.collection}`}
            action={
              <Button asChild variant="ghost">
                <Link href="/watches">Ver todos os modelos</Link>
              </Button>
            }
          />
          <ul className="-mx-gutter flex snap-x snap-mandatory gap-3 overflow-x-auto px-gutter pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug} className="w-[72vw] shrink-0 snap-start sm:w-auto">
                <ProductCard
                  className="h-full bg-background"
                  product={{
                    slug: p.slug,
                    name: p.name,
                    price: p.price,
                    collection: p.collection,
                    badge: asBadge(p.badge),
                    image: getPrimaryImage(p.images),
                  }}
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <ProductBuyBar name={product.name} price={product.price} watchId={BUY_CTA_ID} />
    </>
  );
}
