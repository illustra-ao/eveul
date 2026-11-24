"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";
import {
  defaultHeroCarouselSlides,
  type HeroCarouselSlide,
} from "@/lib/hero-carousel";

/**
 * Hero da home.
 * Mobile: imagem em cima, texto em baixo, sem animação (só troca de slide).
 * Desktop: texto à esquerda, relógio grande à direita; transição GSAP curta.
 */
export function EveulHeroCarousel({
  slides = defaultHeroCarouselSlides,
}: {
  slides?: HeroCarouselSlide[];
}) {
  const root = useRef<HTMLElement | null>(null);
  const copy = useRef<HTMLDivElement | null>(null);
  const watchWrap = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const current = slides[index] ?? defaultHeroCarouselSlides[0];
  const hasMany = slides.length > 1;

  const canAnimate = () =>
    typeof window !== "undefined" &&
    !window.matchMedia("(max-width: 767px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const goTo = (nextIndex: number, dir: 1 | -1) => {
    if (isAnimating || nextIndex === index) return;

    if (!root.current || !canAnimate()) {
      setIndex(nextIndex);
      return;
    }

    setIsAnimating(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => setIsAnimating(false),
      });

      tl.to(copy.current, { autoAlpha: 0, y: 8, duration: 0.28 }, 0);
      tl.to(watchWrap.current, { autoAlpha: 0, x: dir * 24, duration: 0.3 }, 0);
      tl.add(() => setIndex(nextIndex));
      tl.set(copy.current, { y: -8 });
      tl.set(watchWrap.current, { x: -dir * 24 });
      tl.to(copy.current, { autoAlpha: 1, y: 0, duration: 0.45 }, ">");
      tl.to(watchWrap.current, { autoAlpha: 1, x: 0, duration: 0.55 }, "<");
    }, root);

    setTimeout(() => ctx.revert(), 1100);
  };

  const go = (dir: 1 | -1) => {
    if (!hasMany) return;
    goTo((index + dir + slides.length) % slides.length, dir);
  };

  // Entrada inicial (só desktop, sem reduced-motion).
  // Só a imagem entra com fade: o título é o LCP e nunca começa escondido.
  useLayoutEffect(() => {
    if (!root.current || !canAnimate()) return;

    const ctx = gsap.context(() => {
      gsap.from(watchWrap.current, { autoAlpha: 0, y: 16, duration: 0.9, ease: "power3.out" });
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
      aria-roledescription="carrossel"
      aria-label="Modelos em destaque"
      className="relative bg-background pt-16"
    >
      <div className="mx-auto grid w-full max-w-site md:min-h-[min(calc(88svh-4rem),52rem)] md:grid-cols-12 md:px-gutter">
        {/* Relógio */}
        <div className="relative md:order-2 md:col-span-7">
          <div className="relative aspect-[5/4] w-full overflow-hidden bg-sunken md:absolute md:inset-0 md:aspect-auto md:my-8">
            <div ref={watchWrap} className="absolute inset-6 md:inset-12">
              <Image
                key={current.image}
                src={current.image}
                alt={current.titleLines.join(" ")}
                fill
                priority={index === 0}
                sizes="(min-width: 768px) 55vw, 100vw"
                quality={78}
                className="object-contain"
              />
            </div>

            {/* Etiqueta da colecção, canto inferior */}
            {current.collection ? (
              <p className="absolute bottom-4 right-4 text-meta text-muted-foreground">
                Colecção {current.collection}
              </p>
            ) : null}
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-end px-gutter pb-10 pt-8 md:order-1 md:col-span-5 md:px-0 md:py-16 md:pr-10">
          <div ref={copy} aria-live="polite">
            <p className="text-meta font-medium text-gold">{current.badge}</p>

            <h1 className="mt-4 text-display">
              {current.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            {current.specs ? (
              <p className="mt-5 max-w-sm text-muted-foreground">{current.specs}</p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={current.href}>Ver o modelo</Link>
            </Button>
            <WhatsAppButton
              productName={current.titleLines.join(" ")}
              size="lg"
              className="w-full sm:w-auto"
            >
              Encomendar
            </WhatsAppButton>
          </div>

          {hasMany ? (
            <div className="mt-10 flex items-center gap-4">
              <div className="flex">
                <Button variant="outline" size="icon" onClick={() => go(-1)} disabled={isAnimating} aria-label="Modelo anterior">
                  <ArrowLeft />
                </Button>
                <Button variant="outline" size="icon" onClick={() => go(1)} disabled={isAnimating} aria-label="Modelo seguinte" className="-ml-px">
                  <ArrowRight />
                </Button>
              </div>

              <ol className="flex items-center" aria-label="Escolher modelo">
                {slides.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i, i > index ? 1 : -1)}
                      aria-label={`Modelo ${i + 1} de ${slides.length}`}
                      aria-current={i === index ? "true" : undefined}
                      className="flex h-11 items-center px-1"
                    >
                      <span
                        className={cn(
                          "block h-0.5 transition-all duration-300",
                          i === index ? "w-12 bg-gold" : "w-6 bg-foreground/30",
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ol>

              <p className="ml-auto text-meta tabular text-muted-foreground">
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
