// components/hero/eveul-hero-carousel.tsx
"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  badge: string;
  code: string;
  titleLines: string[];
  image: string;
  thumb: string;
  availableLabel?: string;
  nextLabel?: string;
};

export function EveulHeroCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        id: "jupiter",
        badge: "LIMITED TO 50 PIECES",
        code: "EV-2043-02",
        titleLines: ["SPACE", "TIMER", "JUPITER"],
        image: "/images/eveul3.png",
        thumb: "/images/watch-thumb.png",
        availableLabel: "AVAILABLE",
        nextLabel: "NEXT: EVEUL PARAIBA",
      },
      {
        id: "paraiba",
        badge: "LIMITED TO 15 PIECES",
        code: "EV-3123-PABL",
        titleLines: ["OPEN GEAR", "FLYING", "TOURBILLON", "PARAIBA"],
        image: "/images/eveul2.png",
        thumb: "/images/watch-thumb.png",
        availableLabel: "AVAILABLE",
        nextLabel: "NEXT: EVEUL JUPITER",
      },
    ],
    []
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
      tl.to(leftCol.current, { autoAlpha: 0, x: -10, duration: 0.35 }, 0);
      tl.to(
        watchWrap.current,
        { autoAlpha: 0, x: dir * 18, duration: 0.35 },
        0
      );
      tl.to(rightCol.current, { autoAlpha: 0, x: 10, duration: 0.35 }, 0);

      // Swap slide
      tl.add(() => setIndex(nextIndex));

      // Enter next
      tl.set([leftCol.current, rightCol.current], { x: 0 });
      tl.set(watchWrap.current, { x: -dir * 18 });

      tl.to(leftCol.current, { autoAlpha: 1, x: 0, duration: 0.45 }, 0.05);
      tl.to(watchWrap.current, { autoAlpha: 1, x: 0, duration: 0.55 }, 0.05);
      tl.to(rightCol.current, { autoAlpha: 1, x: 0, duration: 0.45 }, 0.1);
    }, root);

    // limpa o contexto desta animação ao final
    // (GSAP context revert aqui é opcional; mantemos simples)
    setTimeout(() => ctx.revert(), 1200);
  };

  // Animação inicial
  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set([leftCol.current, rightCol.current], { autoAlpha: 0, y: 10 });
      gsap.set(watchWrap.current, { autoAlpha: 0, scale: 0.98, y: 16 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(
          [leftCol.current, rightCol.current],
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
          0
        )
        .to(
          watchWrap.current,
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.9 },
          0.1
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[92vh] overflow-hidden">
      {/* Background fixed black */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/10 blur-[120px]" />
        <div className="absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6 pb-10 pt-28">
        {/* Left */}
        <div
          ref={leftCol}
          className="col-span-12 flex flex-col justify-center md:col-span-4"
        >
          <div className="mb-6 inline-flex w-fit items-center rounded-full border border-border bg-card/40 px-4 py-2 text-[11px] tracking-[0.18em] text-muted-foreground backdrop-blur">
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

          <div className="mt-8 flex items-center gap-3">
            <Button className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90">
              FIND OUT MORE
            </Button>

            {/* Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                disabled={isAnimating}
                className="h-11 w-11 rounded-full border border-border bg-card/40 text-sm backdrop-blur hover:bg-card/60 disabled:opacity-50"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={() => go(1)}
                disabled={isAnimating}
                className="h-11 w-11 rounded-full border border-border bg-card/40 text-sm backdrop-blur hover:bg-card/60 disabled:opacity-50"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-10 text-[11px] tracking-[0.22em] text-muted-foreground">
            OPEN GEAR • TITANIUM CASE • SAPPHIRE GLASS
          </div>
        </div>

        {/* Watch */}
        <div className="relative col-span-12 flex items-center justify-center md:col-span-6">
          <div
            ref={watchWrap}
            className="relative h-[420px] w-[420px] md:h-[560px] md:w-[560px]"
          >
            <div className="absolute inset-0 rounded-full bg-[color:var(--gold)]/10 blur-[80px]" />
            <Image
              src={current.image}
              alt={`Eveul hero ${current.id}`}
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Right */}
        <div
          ref={rightCol}
          className="col-span-12 flex flex-col items-end justify-between md:col-span-2"
        >
          <div className="mt-2 text-xs tracking-[0.22em] text-[color:var(--gold)]">
            {current.availableLabel ?? "AVAILABLE"}
          </div>

          <div className="mt-16 w-full max-w-[220px] rounded-2xl border border-border bg-card/40 p-3 backdrop-blur">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={current.thumb}
                alt="Media thumb"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
              <button
                className="absolute left-1/2 top-1/2 inline-flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur hover:bg-white/15"
                aria-label="Play video"
              >
                <span className="ml-0.5 h-0 w-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white/90" />
              </button>
            </div>
          </div>

          <div className="mt-6 text-[11px] tracking-[0.22em] text-muted-foreground">
            {current.nextLabel ?? ""}
          </div>
        </div>
      </div>

      {/* Indicador simples */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6">
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
