// components/hero/eveul-hero.tsx
"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

export function EveulHero() {
  const root = useRef<HTMLElement | null>(null);

  const watchWrap = useRef<HTMLDivElement | null>(null);
  const watchGlow = useRef<HTMLDivElement | null>(null);

  const leftCol = useRef<HTMLDivElement | null>(null);
  const rightCol = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // Estado inicial (evita flash)
      gsap.set([leftCol.current, rightCol.current], { autoAlpha: 0, y: 12 });
      gsap.set(watchWrap.current, { autoAlpha: 0, scale: 0.96, y: 18 });
      gsap.set(watchGlow.current, { autoAlpha: 0, scale: 0.9 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(
        [leftCol.current, rightCol.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
        },
        0
      );

      tl.to(
        watchGlow.current,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.1,
        },
        0.1
      );

      tl.to(
        watchWrap.current,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
        },
        0.15
      );

      // Micro-movimento final (muito subtil)
      tl.to(
        watchWrap.current,
        {
          y: -4,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        1.0
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

      <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6 pb-10 pt-28">
        {/* Left */}
        <div
          ref={leftCol}
          className="col-span-12 flex flex-col justify-center md:col-span-4"
        >
          <div className="mb-6 inline-flex w-fit items-center rounded-full border border-border bg-card/40 px-4 py-2 text-[11px] tracking-[0.18em] text-muted-foreground backdrop-blur">
            LIMITED TO 50 PIECES
          </div>

          <div className="text-xs tracking-[0.22em] text-muted-foreground">
            EV-2043-02
          </div>

          <h1 className="mt-4 font-[var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-6xl">
            SPACE
            <br />
            TIMER
            <br />
            JUPITER
          </h1>

          <div className="mt-8">
            <Button className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90">
              FIND OUT MORE
            </Button>
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
            <div
              ref={watchGlow}
              className="absolute inset-0 rounded-full bg-[color:var(--gold)]/10 blur-[80px]"
            />
            <Image
              src="/images/watch-thumb.png"
              alt="Eveul watch hero"
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
            AVAILABLE
          </div>

          <div className="mt-16 w-full max-w-[220px] rounded-2xl border border-border bg-card/40 p-3 backdrop-blur">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src="/images/watch-thumb.png"
                alt="Behind the scenes"
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
            NEXT: EVEUL GRAND REGULATOR
          </div>
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6">
          <div className="h-[2px] w-10 bg-white/25" />
          <div className="h-[2px] w-16 bg-[color:var(--gold)]" />
          <div className="h-[2px] w-10 bg-white/25" />
        </div>
      </div>
    </section>
  );
}
