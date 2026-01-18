// components/watches/watch-product-page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Spec = { k: string; v: string };

export type WatchProduct = {
  id: string;
  slug: string; // ✅ novo
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

function formatKz(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value);
}

export function WatchProductPage({
  product,
  related,
}: {
  product: WatchProduct;
  related: WatchProduct[];
}) {
  const [active, setActive] = useState(0);

  const mainImage = useMemo(() => {
    const imgs = product.images?.length
      ? product.images
      : ["/images/placeholder.jpg"];
    return imgs[Math.min(active, imgs.length - 1)];
  }, [active, product.images]);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/8 blur-[150px]" />
        <div className="absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/90" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            INÍCIO
          </Link>{" "}
          <span className="mx-2">/</span>
          <Link href="/watches" className="hover:text-foreground">
            RELÓGIOS
          </Link>{" "}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name.toUpperCase()}</span>
        </div>

        {/* Top */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="rounded-4xl border border-border bg-card/15 p-4 backdrop-blur">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/60" />

                {product.badge && (
                  <div className="absolute left-4 top-4 rounded-full border border-border bg-black/30 px-3 py-1 text-[10px] tracking-[0.22em] text-[color:var(--gold)] backdrop-blur">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Thumbs */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={[
                      "relative aspect-square overflow-hidden rounded-2xl border backdrop-blur transition",
                      i === active
                        ? "border-[color:var(--gold)]/45 bg-[color:var(--gold)]/10"
                        : "border-border bg-card/10 hover:bg-card/20",
                    ].join(" ")}
                    aria-label={`Ver imagem ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </button>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {product.highlights.slice(0, 3).map((h) => (
                <MiniStat key={h} title={h} value="Premium" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <div className="rounded-4xl border border-border bg-card/15 p-8 backdrop-blur">
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                {product.collection.toUpperCase()}
              </div>

              <h1 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
                {product.name}
              </h1>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-7 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                    PREÇO
                  </div>
                  <div className="mt-2 font-[var(--font-display)] text-3xl tracking-tight">
                    <span className="text-[color:var(--gold)]">
                      {product.currency ?? "Kz"}
                    </span>{" "}
                    {formatKz(product.price)}
                  </div>
                </div>

                <div className="rounded-full border border-border bg-black/20 px-4 py-2 text-[11px] tracking-[0.22em] text-muted-foreground backdrop-blur">
                  {product.stockLabel ?? "DISPONÍVEL"}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90"
                  onClick={() => {
                    // TODO: ligar ao carrinho global
                    console.log("add_to_cart", product.id);
                  }}
                >
                  Adicionar ao carrinho
                </Button>

                <Button
                  variant="outline"
                  className="h-12 rounded-full border-border bg-black/20 px-6 backdrop-blur hover:bg-black/35"
                  onClick={() => {
                    // TODO: WhatsApp link real
                    console.log("whatsapp_interest", product.id);
                  }}
                >
                  Falar no WhatsApp
                </Button>
              </div>

              {/* Trust line */}
              <div className="mt-8 text-[11px] tracking-[0.22em] text-muted-foreground">
                ENVIO 24–72H (LUANDA) • GARANTIA 12 MESES • PAGAMENTO APPYPAY
              </div>

              {/* Specs */}
              <div className="mt-8 border-t border-border pt-6">
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  ESPECIFICAÇÕES
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-3">
                  {product.specs.map((s) => (
                    <div
                      key={s.k}
                      className="flex items-center justify-between rounded-2xl border border-border bg-black/15 px-4 py-3"
                    >
                      <dt className="text-xs tracking-[0.14em] text-muted-foreground">
                        {s.k.toUpperCase()}
                      </dt>
                      <dd className="text-xs tracking-[0.14em] text-foreground">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Shipping / warranty mini */}
            <div className="mt-6 rounded-4xl border border-border bg-card/10 p-6 backdrop-blur">
              <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                ENVIO & GARANTIA
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Envio rápido em Luanda e assistência no pós-venda. Em caso de
                dúvida, fale connosco antes da compra para recomendação por
                estilo e orçamento.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <QuickLink href="/watches" label="Ver outros modelos" />
                <QuickLink href="/about" label="Sobre a Eveul" />
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-14 border-t border-border pt-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                RECOMENDADOS
              </div>
              <h2 className="mt-4 font-[var(--font-display)] text-3xl tracking-tight">
                Outros modelos da colecção.
              </h2>
            </div>

            <Link
              href="/watches"
              className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
            >
              VER TODOS →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <RelatedCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card/10 p-5 backdrop-blur">
      <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
        {title.toUpperCase()}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-border bg-card/10 px-4 py-2 text-[11px] tracking-[0.22em] text-muted-foreground backdrop-blur hover:bg-card/25 hover:text-foreground"
    >
      {label} →
    </Link>
  );
}

function RelatedCard({ p }: { p: WatchProduct }) {
  const img = p.images?.[0] ?? "/images/placeholder.jpg";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/15 backdrop-blur">
      {p.badge && (
        <div className="absolute left-4 top-4 z-10 rounded-full border border-border bg-black/30 px-3 py-1 text-[10px] tracking-[0.22em] text-[color:var(--gold)] backdrop-blur">
          {p.badge}
        </div>
      )}

      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/65" />
        <Image
          src={img}
          alt={p.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
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
              {p.currency ?? "Kz"}
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
      </div>
    </article>
  );
}
