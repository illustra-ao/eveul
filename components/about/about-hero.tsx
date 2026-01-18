// components/about/about-hero.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  const root = useRef<HTMLElement | null>(null);
  const left = useRef<HTMLDivElement | null>(null);
  const right = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set([left.current, right.current], { autoAlpha: 0, y: 14 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(left.current, { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
        .to(right.current, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.1);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/10 blur-[140px]" />
        <div className="absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-black/85" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 pt-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          {/* Copy */}
          <div ref={left} className="md:col-span-6">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              ABOUT EVEUL
            </div>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-6xl">
              Presença.
              <br />
              Precisão.
              <br />
              Identidade.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
              A Eveul nasce para criar relógios com acabamento premium e
              estética intencional. Menos ruído, mais detalhe — para quem
              valoriza presença e consistência no dia-a-dia.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90">
                Ver Colecção
              </Button>
              <a
                href="#process"
                className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
              >
                O NOSSO PROCESSO →
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              <Stat label="Material" value="Premium" />
              <Stat label="Edição" value="Limitada" />
              <Stat label="Suporte" value="Local" />
            </div>
          </div>

          {/* Visual */}
          <div ref={right} className="md:col-span-6">
            <div className="relative overflow-hidden rounded-4xl border border-border bg-card/20 backdrop-blur">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/feature-1.jpg"
                  alt="Eveul about hero"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/25 to-black/10" />
              </div>

              <div className="p-6 md:p-8">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                  DESIGN PHILOSOPHY
                </div>
                <div className="mt-2 font-[var(--font-display)] text-2xl tracking-tight">
                  Luxo silencioso, feito para durar.
                </div>
                <div className="mt-3 text-sm leading-7 text-muted-foreground">
                  Materiais seleccionados, detalhes visíveis e uma experiência
                  de compra simples — do primeiro clique ao pós-venda.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/15 p-4 backdrop-blur">
      <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
        {label.toUpperCase()}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
    </div>
  );
}
