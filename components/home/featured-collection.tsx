// components/home/featured-collection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturedCollection() {
  return (
    <section className="relative border-t border-border">
      {/* background subtle */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--gold)]/6 blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        {/* Header row */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              FEATURED COLLECTION
            </div>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Relógios desenhados para marcar presença, não apenas horas.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Materiais premium, acabamentos de precisão e uma estética que
              valoriza o detalhe. Explore as peças em destaque e descubra a
              colecção Eveul.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Button className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90">
                Ver Colecção
              </Button>

              <Link
                href="#"
                className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
              >
                EXPLORE DETAILS →
              </Link>
            </div>
          </div>

          {/* Mini “stats” (opcional, mas fica bem neste estilo) */}
          <div className="grid w-full max-w-md grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur">
              <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                MATERIAL
              </div>
              <div className="mt-2 text-sm text-foreground">Aço / Titânio</div>
            </div>
            <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur">
              <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                VIDRO
              </div>
              <div className="mt-2 text-sm text-foreground">Safira</div>
            </div>
            <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur">
              <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                EDIÇÃO
              </div>
              <div className="mt-2 text-sm text-foreground">Limitada</div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Large card */}
          <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/30 backdrop-blur md:col-span-7">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-black/0" />
            <div className="relative p-8 md:p-10">
              <div className="text-xs tracking-[0.22em] text-muted-foreground">
                EVEUL SIGNATURE
              </div>
              <h3 className="mt-3 font-[var(--font-display)] text-3xl tracking-tight md:text-4xl">
                Engenharia visível. Elegância silenciosa.
              </h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                Uma assinatura estética que privilegia mecanismos e textura.
                Pensado para quem aprecia o detalhe e a presença.
              </p>

              <div className="mt-7">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-border bg-card/20 px-6 backdrop-blur hover:bg-card/40"
                >
                  Ver Modelo
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[320px] w-full md:h-[360px]">
              <Image
                src="/images/feature-2.jpg"
                alt="Featured watch macro"
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </article>

          {/* Right column cards */}
          <div className="grid grid-cols-1 gap-6 md:col-span-5">
            <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/30 backdrop-blur">
              <div className="relative p-8">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                  CRAFTSMANSHIP
                </div>
                <h4 className="mt-3 font-[var(--font-display)] text-2xl tracking-tight">
                  Acabamento, textura e precisão.
                </h4>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Materiais seleccionados e montagem cuidada para uma
                  experiência premium.
                </p>
              </div>

              <div className="relative h-[220px]">
                <Image
                  src="/images/eveul3.png"
                  alt="Craftsmanship"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/30 backdrop-blur">
              <div className="relative p-8">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                  LIMITED EDITION
                </div>
                <h4 className="mt-3 font-[var(--font-display)] text-2xl tracking-tight">
                  Peças limitadas, impacto garantido.
                </h4>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Produção reduzida para manter exclusividade e valor ao longo
                  do tempo.
                </p>
              </div>

              <div className="relative h-[220px]">
                <Image
                  src="/images/feature-1.jpg"
                  alt="Limited edition"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </article>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card/20 p-6 backdrop-blur md:grid-cols-4">
          <Spec label="Movimento" value="Automático" />
          <Spec label="Resistência" value="5 ATM" />
          <Spec label="Correia" value="Couro / Aço" />
          <Spec label="Garantia" value="12 meses" />
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-black/10 p-4">
      <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
        {label.toUpperCase()}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
    </div>
  );
}
