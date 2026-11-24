// components/home/final-newsletter-cta.tsx
"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/brand/section";

type Status = "idle" | "loading" | "success" | "exists" | "error";

const messages: Record<Exclude<Status, "idle" | "loading">, string> = {
  success: "Subscrição confirmada. Obrigado.",
  exists: "Este email já está na lista.",
  error: "Não foi possível subscrever. Tenta outra vez.",
};

export function FinalNewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

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
        return;
      }

      if (data.status === "exists") {
        setStatus("exists");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const message = status === "idle" || status === "loading" ? null : messages[status];

  return (
    <Section id="newsletter" tone="raised" spacing="compact" aria-labelledby="newsletter-titulo" className="border-t border-border">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <h2 id="newsletter-titulo" className="rule-top text-h2">
            Sabe primeiro dos lançamentos
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Novos modelos, edições limitadas e reposições. Poucos emails, só quando há novidade.
          </p>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-6" noValidate>
          <label htmlFor="newsletter-email" className="mb-2 block text-meta text-muted-foreground">
            Email
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@exemplo.com"
              aria-describedby="newsletter-status"
              className="h-12 flex-1 bg-background"
            />
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "A subscrever…" : "Subscrever"}
            </Button>
          </div>
          <p
            id="newsletter-status"
            aria-live="polite"
            className={cn(
              "mt-3 min-h-5 text-meta",
              status === "error" ? "text-destructive" : status === "idle" ? "text-muted-foreground" : "text-gold",
            )}
          >
            {message ?? "Podes cancelar quando quiseres."}
          </p>
        </form>
      </div>
    </Section>
  );
}
