// components/watches/product-gallery.tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Galeria de produto.
 * - Mobile: faixa em scroll-snap nativo (desliza com o dedo, zero JS de carrossel).
 * - Desktop: imagem principal + miniaturas.
 * Só a primeira imagem é `priority`; as restantes carregam em lazy.
 */
export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: readonly string[];
  name: string;
  badge?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLUListElement | null>(null);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };

  const scrollTo = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const many = images.length > 1;

  return (
    <div>
      {/* Mobile */}
      <div className="relative -mx-gutter lg:hidden">
        <ul
          ref={track}
          onScroll={onScroll}
          aria-label={`Fotografias de ${name}`}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <li key={src + i} className="relative aspect-square w-full shrink-0 snap-center bg-sunken">
              <Image
                src={src}
                alt={`${name}, fotografia ${i + 1} de ${images.length}`}
                fill
                priority={i === 0}
                sizes="100vw"
                quality={78}
                className="object-cover"
              />
            </li>
          ))}
        </ul>

        {badge ? <div className="absolute left-gutter top-4">{badge}</div> : null}

        {many ? (
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Ver fotografia ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className="flex h-11 items-center px-1"
              >
                <span className={cn("block h-0.5 transition-all", i === active ? "w-8 bg-gold" : "w-4 bg-ivory/40")} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="relative aspect-square overflow-hidden bg-sunken">
          <Image
            key={images[active]}
            src={images[active] ?? images[0]}
            alt={`${name}, fotografia ${active + 1} de ${images.length}`}
            fill
            priority
            sizes="(min-width: 1280px) 720px, 58vw"
            quality={80}
            className="object-cover"
          />
          {badge ? <div className="absolute left-4 top-4">{badge}</div> : null}
        </div>

        {many ? (
          <ul className="mt-3 grid grid-cols-5 gap-3" aria-label="Miniaturas">
            {images.slice(0, 5).map((src, i) => (
              <li key={src + i}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Ver fotografia ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  className={cn(
                    "relative block aspect-square w-full overflow-hidden bg-sunken transition-opacity",
                    i === active
                      ? "outline-2 -outline-offset-2 outline-gold"
                      : "opacity-60 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="140px" quality={60} className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
