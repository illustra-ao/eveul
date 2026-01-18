// components/about/about-process.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutProcess() {
  const root = useRef<HTMLElement | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(wrap.current, { autoAlpha: 0, y: 16 });

      gsap.to(wrap.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      await v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      ref={root}
      id="process"
      className="relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0">
        <div className="absolute left-1/2 -top-28 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--gold)]/8 blur-[170px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/65 to-black/90" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div ref={wrap} className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              PROCESS
            </div>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Como a Eveul garante consistência.
            </h2>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Um fluxo claro, com controlo por etapas. Menos promessas, mais
              verificabilidade.
            </p>

            <div className="mt-8 grid gap-4">
              <Step n="01" title="Selecção de materiais">
                Componentes e acabamentos alinhados com durabilidade e estética.
              </Step>
              <Step n="02" title="Montagem e verificação">
                Ajustes e controlo de qualidade em etapas críticas.
              </Step>
              <Step n="03" title="Entrega e suporte">
                Comunicação clara, garantia e assistência pós-venda.
              </Step>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative overflow-hidden rounded-4xl border border-border bg-card/20 backdrop-blur">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src="/videos/eveul-craft.mp4"
                  poster="/images/story-poster.jpg"
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/70 via-black/25 to-black/10" />

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

              <div className="p-6 md:p-8">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                  BEHIND THE PIECE
                </div>
                <div className="mt-2 font-[var(--font-display)] text-2xl tracking-tight">
                  Da intenção ao acabamento final.
                </div>
                <div className="mt-3 text-sm leading-7 text-muted-foreground">
                  Conteúdo editorial e film stills ajudam a perceber textura,
                  presença e detalhe.
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Strip title="Envio" value="24–72h (Luanda)" />
              <Strip title="Pagamentos" value="AppyPay / Ref. / TPA" />
              <Strip title="Garantia" value="12 meses" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/15 p-4 backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="mt-1 text-xs tracking-[0.22em] text-[color:var(--gold)]">
          {n}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{title}</div>
          <div className="mt-1 text-sm leading-7 text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Strip({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/15 p-4 backdrop-blur">
      <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
        {title.toUpperCase()}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
    </div>
  );
}
