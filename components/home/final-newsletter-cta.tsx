// components/home/final-newsletter-cta.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

gsap.registerPlugin(ScrollTrigger);

export function FinalNewsletterCTA() {
  const root = useRef<HTMLElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const left = useRef<HTMLDivElement | null>(null);
  const form = useRef<HTMLFormElement | null>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "exists" | "error"
  >("idle");

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set([box.current, left.current, form.current], {
        autoAlpha: 0,
        y: 14,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(box.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0);
      tl.to(left.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.05);
      tl.to(form.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.12);
    }, root);

    return () => ctx.revert();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 2400);
        return;
      }

      if (data.status === "exists") {
        setStatus("exists");
        // opcional: manter o email no input, ou limpar
        // setEmail("");
        setTimeout(() => setStatus("idle"), 2600);
        return;
      }

      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 2600);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2400);
    }
  };

  return (
    <section
      ref={root}
      id="newsletter"
      className="relative overflow-hidden border-t border-border"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-[-120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--gold)]/8 blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/90" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div
          ref={box}
          className="relative overflow-hidden rounded-4xl border border-border bg-card/15 p-8 backdrop-blur md:p-12"
        >
          {/* Inner glow line */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-10 top-10 h-px w-44 bg-[color:var(--gold)]/35" />
            <div className="absolute right-10 bottom-10 h-px w-44 bg-[color:var(--gold)]/20" />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
            {/* Left copy */}
            <div ref={left} className="md:col-span-6">
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                NEWSLETTER
              </div>

              <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight md:text-5xl">
                Receba lançamentos, edições limitadas e avisos de stock.
              </h2>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Actualizações curtas e relevantes. Sem spam. Pode cancelar a
                subscrição a qualquer momento.
              </p>

              {/* Trust microcopy */}
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniTag>Novos lançamentos</MiniTag>
                <MiniTag>Edições limitadas</MiniTag>
                <MiniTag>Reposição de stock</MiniTag>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-6">
              <form
                ref={form}
                onSubmit={onSubmit}
                className="rounded-3xl border border-border bg-black/20 p-5 backdrop-blur"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="O seu email"
                    className="h-12 rounded-2xl bg-black/25 text-foreground placeholder:text-muted-foreground"
                  />

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-12 rounded-2xl bg-primary px-6 text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "loading" ? "A subscrever..." : "Subscrever"}
                  </Button>
                </div>

                <div className="mt-3 flex flex-col justify-between gap-2 text-[11px] tracking-[0.18em] text-muted-foreground sm:flex-row">
                  <span>
                    Ao subscrever, concorda em receber comunicações da Eveul.
                  </span>

                  <span
                    className={[
                      "transition",
                      status === "success" ? "text-[color:var(--gold)]" : "",
                      status === "exists" ? "text-[color:var(--gold)]/85" : "",
                      status === "error" ? "text-red-300/90" : "",
                    ].join(" ")}
                  >
                    {status === "success"
                      ? "Subscrição confirmada. Bem-vindo."
                      : status === "exists"
                        ? "Já está na lista. Avisaremos em novos lançamentos."
                        : status === "error"
                          ? "Não foi possível. Tente novamente."
                          : "Privacidade respeitada."}
                  </span>
                </div>

                {/* Quick links */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <QuickLink
                    href="https://wa.me/244943670112"
                    label="WHATSAPP"
                  />
                  <QuickLink href="#" label="SUPORTE" />
                  <QuickLink href="#" label="VER STOCK" />
                </div>

                <div
                  className={[
                    "mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] tracking-[0.22em] backdrop-blur transition",
                    status === "success"
                      ? "border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 text-foreground"
                      : status === "exists"
                        ? "border-border bg-card/15 text-muted-foreground"
                        : status === "error"
                          ? "border-red-400/30 bg-red-400/10 text-red-200/90"
                          : "border-border bg-card/10 text-muted-foreground",
                    status !== "idle"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1",
                  ].join(" ")}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]/80" />
                  {status === "success"
                    ? "SUBSCRIÇÃO CONFIRMADA"
                    : status === "exists"
                      ? "JÁ INSCRITO"
                      : status === "error"
                        ? "FALHA AO SUBSCREVER"
                        : "—"}
                </div>
              </form>

              {/* Secondary CTA line */}
              <div className="mt-6 text-[11px] tracking-[0.22em] text-muted-foreground">
                OU FALE CONNOSCO PARA ENCOMENDAS CORPORATIVAS E PRESENTES.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/15 px-4 py-3 text-[11px] tracking-[0.22em] text-muted-foreground backdrop-blur">
      {children}
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-full border border-border bg-card/10 px-4 py-2 text-[11px] tracking-[0.22em] text-muted-foreground backdrop-blur hover:bg-card/25 hover:text-foreground"
    >
      {label} →
    </a>
  );
}
