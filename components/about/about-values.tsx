// components/about/about-values.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function AboutValues() {
  const root = useRef<HTMLElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(box.current, { autoAlpha: 0, y: 14 });

      gsap.to(box.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/75 to-black/95" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div
          ref={box}
          className="rounded-4xl border border-border bg-card/15 p-8 backdrop-blur md:p-12"
        >
          <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
            VALUES
          </div>
          <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
            O que define a Eveul.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card title="Consistência">
              Produtos e experiência com padrões claros, do design ao suporte.
            </Card>
            <Card title="Transparência">
              Informação directa: preço, stock, prazos e políticas sem ruído.
            </Card>
            <Card title="Presença">
              Uma peça que comunica identidade — sem exageros.
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-black/15 p-6">
            <div>
              <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                PRONTO PARA EXPLORAR A COLECÇÃO?
              </div>
              <div className="mt-2 font-[var(--font-display)] text-2xl tracking-tight">
                Veja os modelos disponíveis agora.
              </div>
            </div>

            <Link
              href="/"
              className="rounded-full border border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 px-6 py-3 text-xs tracking-[0.22em] text-foreground hover:bg-[color:var(--gold)]/15"
            >
              VER RELÓGIOS →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card/10 p-6">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-2 text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
