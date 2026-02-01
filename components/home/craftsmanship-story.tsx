// components/home/craftsmanship-story.tsx
"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function CraftsmanshipStory() {
  const root = useRef<HTMLElement | null>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const mini1Ref = useRef<HTMLElement | null>(null);
  const mini2Ref = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // estado inicial
      gsap.set([headerRef.current, leftRef.current], { autoAlpha: 0, y: 14 });
      gsap.set(mediaRef.current, { autoAlpha: 0, y: 14, scale: 0.98 });
      gsap.set([mini1Ref.current, mini2Ref.current], { autoAlpha: 0, y: 14 });
      gsap.set(stripRef.current, { autoAlpha: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 0);
      tl.to(leftRef.current, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.05);
      tl.to(
        mediaRef.current,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.85 },
        0.1,
      );
      tl.to(
        [mini1Ref.current, mini2Ref.current],
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 },
        0.25,
      );
      tl.to(stripRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.35);
    }, root);

    return () => ctx.revert();
  }, []);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) {
        // garantir compatibilidade em mobile
        v.muted = true;
        v.playsInline = true;
        await v.play();
        setIsPlaying(true);
      } else {
        v.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      // fallback: mostra controls para o user conseguir iniciar manualmente
      console.error("Video play failed:", err);
      v.controls = true;
    }
  };

  return (
    <section
      ref={root}
      id="craftsmanship"
      className="relative overflow-hidden border-t border-border"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -left-44 top-10 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/7 blur-[150px]" />
        <div className="absolute -right-56 -top-20 h-[620px] w-[620px] rounded-full bg-white/5 blur-[170px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/85" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header line */}
        <div
          ref={headerRef}
          className="flex items-center justify-between gap-6"
        >
          <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
            CRAFTSMANSHIP
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="h-px w-24 bg-[color:var(--gold)]/40" />
            <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
              ENGINEERED TO LAST
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          {/* Left: Copy */}
          <div ref={leftRef} className="md:col-span-5">
            <h2 className="font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Detalhe visível.
              <br />
              Precisão sentida.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Cada peça Eveul nasce de um processo focado em acabamento e
              fiabilidade. A estética é intencional: menos ruído, mais presença
              — e um mecanismo que se deixa observar.
            </p>

            <div className="mt-8 grid gap-4">
              <Highlight
                index="01"
                title="Materiais premium"
                description="Aço/titânio, vidro de safira e acabamentos que resistem ao uso real."
              />
              <Highlight
                index="02"
                title="Montagem cuidada"
                description="Controlo de qualidade por etapas, com foco em precisão e consistência."
              />
              <Highlight
                index="03"
                title="Garantia e suporte"
                description="Assistência e manutenção com processos claros e transparência."
              />
            </div>

            <div className="mt-10 flex items-center gap-3">
              <Button className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90">
                Ver o Processo
              </Button>

              <button className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground">
                LEARN MORE →
              </button>
            </div>
          </div>

          {/* Right: Media */}
          <div className="md:col-span-7">
            {/* Big media card (VIDEO) */}
            <div
              ref={mediaRef}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/20 backdrop-blur"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {/* Video */}
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src="/videos/eveul-craft.mp4"
                  poster="/images/story-poster.jpg"
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Overlay (luxo) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/70 via-black/25 to-black/10" />

                {/* Play/Pause button */}
                <button
                  onClick={togglePlay}
                  className="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/15"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <span className="flex gap-1">
                      <span className="h-4 w-1.5 rounded bg-white/90" />
                      <span className="h-4 w-1.5 rounded bg-white/90" />
                    </span>
                  ) : (
                    <span className="ml-0.5 h-0 w-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white/90" />
                  )}
                </button>
              </div>

              {/* Bottom overlay content */}
              <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <div className="flex w-full items-end justify-between gap-6">
                  <div>
                    <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                      BEHIND THE DESIGN
                    </div>
                    <div className="mt-2 font-[var(--font-display)] text-2xl tracking-tight md:text-3xl">
                      O processo por trás de cada peça.
                    </div>
                  </div>

                  <div className="hidden md:block text-[11px] tracking-[0.22em] text-muted-foreground">
                    00:20 FILM
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom cards */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <MiniCard
                refEl={mini1Ref}
                title="Textura e acabamento"
                label="DETAILS"
                image="/images/feature-2.jpg"
              />
              <MiniCard
                refEl={mini2Ref}
                title="Mecânica e presença"
                label="MECHANISM"
                image="/images/feature-1.jpg"
              />
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          ref={stripRef}
          className="mt-12 grid grid-cols-1 gap-4 rounded-3xl border border-border bg-card/15 p-6 backdrop-blur md:grid-cols-3"
        >
          <StripItem title="Envio" value="24–72h (Luanda)" />
          <StripItem title="Pagamentos" value="AppyPay / Referência / TPA" />
          <StripItem title="Garantia" value="12 meses (padrão)" />
        </div>
      </div>
    </section>
  );
}

function Highlight({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/15 p-4 backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="mt-1 text-xs tracking-[0.22em] text-[color:var(--gold)]">
          {index}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{title}</div>
          <div className="mt-1 text-sm leading-7 text-muted-foreground">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  refEl,
  label,
  title,
  image,
}: {
  refEl: React.RefObject<HTMLElement | null>;
  label: string;
  title: string;
  image: string;
}) {
  return (
    <article
      ref={refEl as React.RefObject<HTMLElement>}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card/20 backdrop-blur"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
      </div>
      <div className="absolute inset-0 flex items-end p-6">
        <div>
          <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
            {label}
          </div>
          <div className="mt-2 font-[var(--font-display)] text-xl tracking-tight">
            {title}
          </div>
        </div>
      </div>
    </article>
  );
}

function StripItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-black/10 p-4">
      <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
        {title.toUpperCase()}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
    </div>
  );
}
