"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  badge: string;
  code: string;
  titleLines: string[];
  image: string;
  availableLabel?: string;

  // novos campos (opcionais)
  collection?: string;
  priceKz?: number;
  specs?: string;
  nextLabel?: string;
};

function formatKz(value?: number) {
  if (!value) return "";
  return new Intl.NumberFormat("pt-PT").format(value);
}

export function EveulHeroCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        id: "jupiter",
        badge: "EDIÇÃO LIMITADA • 50 PEÇAS",
        code: "EV-2043-02",
        titleLines: ["SPACE", "TIMER", "JUPITER"],
        image: "/images/eveul3.png",
        availableLabel: "DISPONÍVEL",
        nextLabel: "SEGUINTE: EVEUL PARAÍBA",
        collection: "Signature",
        priceKz: 189000,
        specs: "Open Gear • Caixa em titânio • Vidro de safira",
      },
      {
        id: "paraiba",
        badge: "EDIÇÃO LIMITADA • 15 PEÇAS",
        code: "EV-3123-PABL",
        titleLines: ["OPEN GEAR", "FLYING", "TOURBILLON", "PARAÍBA"],
        image: "/images/eveul2.png",
        availableLabel: "DISPONÍVEL",
        nextLabel: "SEGUINTE: EVEUL JUPITER",
        collection: "Limited Edition",
        priceKz: 265000,
        specs: "Open Gear • Tourbillon • Vidro de safira",
      },
    ],
    [],
  );

  const root = useRef<HTMLElement | null>(null);
  const leftCol = useRef<HTMLDivElement | null>(null);
  const watchWrap = useRef<HTMLDivElement | null>(null);
  const rightCol = useRef<HTMLDivElement | null>(null);

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const current = slides[index];

  const go = (dir: 1 | -1) => {
    if (isAnimating) return;
    const nextIndex = (index + dir + slides.length) % slides.length;
    animateTo(nextIndex, dir);
  };

  const animateTo = (nextIndex: number, dir: 1 | -1) => {
    if (!root.current) return;
    setIsAnimating(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => setIsAnimating(false),
      });

      // Exit current
      tl.to(leftCol.current, { autoAlpha: 0, x: -12, duration: 0.32 }, 0);
      tl.to(
        watchWrap.current,
        { autoAlpha: 0, x: dir * 22, duration: 0.32 },
        0,
      );
      tl.to(rightCol.current, { autoAlpha: 0, x: 12, duration: 0.32 }, 0);

      // Swap
      tl.add(() => setIndex(nextIndex));

      // Enter next
      tl.set([leftCol.current, rightCol.current], { x: 0 });
      tl.set(watchWrap.current, { x: -dir * 22 });

      tl.to(leftCol.current, { autoAlpha: 1, x: 0, duration: 0.45 }, 0.05);
      tl.to(watchWrap.current, { autoAlpha: 1, x: 0, duration: 0.55 }, 0.05);
      tl.to(rightCol.current, { autoAlpha: 1, x: 0, duration: 0.45 }, 0.1);
    }, root);

    setTimeout(() => ctx.revert(), 1100);
  };

  // Animação inicial
  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set([leftCol.current, rightCol.current], { autoAlpha: 0, y: 12 });
      gsap.set(watchWrap.current, { autoAlpha: 0, scale: 0.985, y: 18 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to([leftCol.current, rightCol.current], {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
        })
        .to(
          watchWrap.current,
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.9 },
          0.1,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[92vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/10 blur-[120px]" />
        <div className="absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Left */}
          <div
            ref={leftCol}
            className="col-span-12 flex flex-col justify-center md:col-span-4"
          >
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-border bg-card/35 px-4 py-2 text-[11px] tracking-[0.22em] text-muted-foreground backdrop-blur">
              {current.badge}
            </div>

            <div className="text-xs tracking-[0.22em] text-muted-foreground">
              {current.code}
            </div>

            <h1 className="mt-4 font-[var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-6xl">
              {current.titleLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h1>

            <div className="mt-6 text-sm leading-7 text-muted-foreground">
              {current.specs ?? "Open Gear • Caixa premium • Vidro de safira"}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90">
                Ver detalhes
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-full border-border bg-card/20 px-6 backdrop-blur hover:bg-card/35"
                onClick={() => go(1)}
                disabled={isAnimating}
              >
                Próximo modelo
              </Button>

              {/* Prev/Next compacto para desktop */}
              <div className="hidden items-center gap-2 md:flex">
                <button
                  onClick={() => go(-1)}
                  disabled={isAnimating}
                  className="h-11 w-11 rounded-full border border-border bg-card/35 text-sm backdrop-blur hover:bg-card/55 disabled:opacity-50"
                  aria-label="Anterior"
                >
                  ←
                </button>
                <button
                  onClick={() => go(1)}
                  disabled={isAnimating}
                  className="h-11 w-11 rounded-full border border-border bg-card/35 text-sm backdrop-blur hover:bg-card/55 disabled:opacity-50"
                  aria-label="Seguinte"
                >
                  →
                </button>
              </div>
            </div>

            <div className="mt-10 text-[11px] tracking-[0.22em] text-muted-foreground">
              ENVIO 24–72H (LUANDA) • GARANTIA 12 MESES • PAGAMENTO APPYPAY
            </div>
          </div>

          {/* Watch */}
          <div className="relative col-span-12 flex items-center justify-center md:col-span-6">
            <div
              ref={watchWrap}
              className="relative h-[380px] w-[380px] sm:h-[420px] sm:w-[420px] md:h-[560px] md:w-[560px]"
            >
              <div className="absolute inset-0 rounded-full bg-[color:var(--gold)]/10 blur-[84px]" />
              <Image
                src={current.image}
                alt={`Eveul ${current.id}`}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Right (sem thumb) */}
          <div
            ref={rightCol}
            className="col-span-12 flex flex-col justify-between md:col-span-2 md:items-end"
          >
            <div className="flex w-full flex-col items-start gap-3 md:items-end">
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                {current.availableLabel ?? "DISPONÍVEL"}
              </div>

              <div className="w-full rounded-2xl border border-border bg-card/30 p-4 backdrop-blur md:max-w-[240px]">
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  COLECÇÃO
                </div>
                <div className="mt-2 text-sm text-foreground">
                  {current.collection ?? "EVEUL"}
                </div>

                <div className="mt-4 h-px w-full bg-border/60" />

                <div className="mt-4 text-[11px] tracking-[0.22em] text-muted-foreground">
                  PREÇO
                </div>
                <div className="mt-2 font-[var(--font-display)] text-2xl tracking-tight">
                  <span className="text-[color:var(--gold)]">Kz</span>{" "}
                  {formatKz(current.priceKz)}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]/80" />
                  <span className="text-[11px] tracking-[0.22em] text-muted-foreground">
                    STOCK LIMITADO
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-[11px] tracking-[0.22em] text-muted-foreground md:text-right">
              {current.nextLabel ?? ""}
            </div>
          </div>
        </div>
      </div>

      {/* Indicador */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={[
                "h-[2px] transition-all",
                i === index ? "w-16 bg-[color:var(--gold)]" : "w-8 bg-white/25",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
