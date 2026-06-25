"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import {
  defaultHeroCarouselSlides,
  type HeroCarouselSlide,
} from "@/lib/hero-carousel";

export function EveulHeroCarousel({
  slides = defaultHeroCarouselSlides,
}: {
  slides?: HeroCarouselSlide[];
}) {
  const root = useRef<HTMLElement | null>(null);
  const leftCol = useRef<HTMLDivElement | null>(null);
  const watchWrap = useRef<HTMLDivElement | null>(null);
  const rightCol = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const current = slides[index] ?? defaultHeroCarouselSlides[0];
  const canAnimate = () =>
    typeof window === "undefined" ||
    (!window.matchMedia("(max-width: 767px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const go = (dir: 1 | -1) => {
    if (isAnimating || slides.length <= 1) return;
    const nextIndex = (index + dir + slides.length) % slides.length;
    animateTo(nextIndex, dir);
  };

  const animateTo = (nextIndex: number, dir: 1 | -1) => {
    if (!root.current) return;

    if (!canAnimate()) {
      setIndex(nextIndex);
      return;
    }

    setIsAnimating(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => setIsAnimating(false),
      });

      tl.to(leftCol.current, { autoAlpha: 0, x: -12, duration: 0.32 }, 0);
      tl.to(
        watchWrap.current,
        { autoAlpha: 0, x: dir * 22, duration: 0.32 },
        0,
      );
      tl.to(rightCol.current, { autoAlpha: 0, x: 12, duration: 0.32 }, 0);

      tl.add(() => setIndex(nextIndex));

      tl.set([leftCol.current, rightCol.current], { x: 0 });
      tl.set(watchWrap.current, { x: -dir * 22 });

      tl.to(leftCol.current, { autoAlpha: 1, x: 0, duration: 0.45 }, 0.05);
      tl.to(watchWrap.current, { autoAlpha: 1, x: 0, duration: 0.55 }, 0.05);
      tl.to(rightCol.current, { autoAlpha: 1, x: 0, duration: 0.45 }, 0.1);
    }, root);

    setTimeout(() => ctx.revert(), 1100);
  };

  useLayoutEffect(() => {
    if (!root.current) return;

    if (!canAnimate()) return;

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

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 44) return;
    go(distance < 0 ? 1 : -1);
  };

  return (
    <section
      ref={root}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-[100svh] overflow-hidden md:min-h-[92vh]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0">
        <div className="absolute -left-24 -top-24 h-[300px] w-[300px] rounded-full bg-[color:var(--gold)]/8 blur-[90px] md:-left-40 md:-top-40 md:h-[520px] md:w-[520px] md:bg-[color:var(--gold)]/10 md:blur-[120px]" />
        <div className="hidden absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[140px] md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <div className="grid grid-cols-12 gap-5 md:gap-8">
          {/* Left */}
          <div
            ref={leftCol}
            className="col-span-12 flex flex-col justify-center md:col-span-4"
          >
            <div className="mb-5 inline-flex w-fit items-center rounded-full border border-border bg-card/35 px-3 py-2 text-[10px] tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em] md:backdrop-blur">
              {current.badge}
            </div>

            <div className="text-xs tracking-[0.22em] text-muted-foreground">
              {current.code}
            </div>

            <h1 className="mt-4 font-[var(--font-display)] text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
              {current.titleLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h1>

            <div className="mt-5 text-sm leading-7 text-muted-foreground md:mt-6">
              {current.specs ?? "Open Gear • Caixa premium • Vidro de safira"}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-8">
              <Button
                asChild
                className="h-11 w-full rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90 sm:w-auto"
              >
                <Link href={current.href}>Ver detalhes</Link>
              </Button>

              <Button
                variant="outline"
                className="h-11 w-full rounded-full border-border bg-card/20 px-6 hover:bg-card/35 sm:w-auto md:backdrop-blur"
                onClick={() => go(1)}
                disabled={isAnimating}
              >
                Próximo modelo
              </Button>

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

            <div className="mt-7 text-[10px] leading-5 tracking-[0.18em] text-muted-foreground md:mt-10 md:text-[11px] md:tracking-[0.22em]">
              ENVIO 24–72H (LUANDA) • GARANTIA 12 MESES • PAGAMENTO APPYPAY
            </div>
          </div>

          {/* Watch */}
          <div className="relative col-span-12 flex items-center justify-center md:col-span-6">
            <div
              ref={watchWrap}
              className="relative h-[72vw] min-h-[230px] w-[72vw] min-w-[230px] max-h-[320px] max-w-[320px] sm:h-[420px] sm:w-[420px] sm:max-h-none sm:max-w-none md:h-[560px] md:w-[560px]"
            >
              <div className="absolute inset-0 rounded-full bg-[color:var(--gold)]/8 blur-[64px] md:bg-[color:var(--gold)]/10 md:blur-[84px]" />
              <Image
                src={current.image}
                alt={`Eveul ${current.id}`}
                fill
                sizes="(min-width: 768px) 560px, (min-width: 640px) 420px, 72vw"
                quality={76}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Right (discreto) */}
          <div
            ref={rightCol}
            className="hidden flex-col justify-between md:col-span-2 md:flex md:items-end"
          >
            <div className="flex w-full flex-col items-start gap-3 md:items-end">
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                {current.availableLabel ?? "DISPONÍVEL"}
              </div>

              <div className="w-full rounded-2xl border border-border bg-card/25 p-4 backdrop-blur md:max-w-[240px]">
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  COLECÇÃO
                </div>
                <div className="mt-2 text-sm text-foreground">
                  {current.collection ?? "EVEUL"}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]/70" />
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
