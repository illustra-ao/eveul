// components/about/about-story.tsx
"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutStory() {
  const root = useRef<HTMLElement | null>(null);
  const a = useRef<HTMLDivElement | null>(null);
  const b = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set([a.current, b.current], { autoAlpha: 0, y: 14 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(a.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0)
        .to(b.current, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div ref={a} className="md:col-span-5">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              THE STORY
            </div>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Uma marca construída à volta do detalhe.
            </h2>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              A Eveul foi desenhada para clientes que querem uma peça com
              presença e acabamento premium, sem complicar a experiência. A
              nossa visão é simples: criar referências consistentes, com
              identidade própria e transparência no suporte.
            </p>

            <div className="mt-8 grid gap-4">
              <Point title="Estética intencional">
                Tipografia limpa, composição editorial e foco no produto.
              </Point>
              <Point title="Qualidade verificável">
                Materiais e acabamento pensados para uso real.
              </Point>
              <Point title="Compra simples">
                Checkout objectivo, comunicação clara e suporte directo.
              </Point>
            </div>
          </div>

          <div ref={b} className="md:col-span-7">
            <div className="relative overflow-hidden rounded-4xl border border-border bg-card/20 backdrop-blur">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/feature-2.jpg"
                  alt="Eveul story"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/25 to-black/10" />
              </div>
              <div className="p-6 md:p-8">
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  INSPIRED BY CRAFT • BUILT FOR DAILY WEAR
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Point({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/15 p-4 backdrop-blur">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-1 text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
