// components/about/about-values.tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/brand/section";
import { SectionHeader } from "@/components/brand/section-header";

const values = [
  {
    title: "Consistência",
    text: "Padrões claros do desenho ao apoio. Cada peça cumpre o que promete.",
  },
  {
    title: "Transparência",
    text: "Preço, disponibilidade, prazos e políticas sem letras pequenas.",
  },
  {
    title: "Presença",
    text: "Uma peça que comunica identidade, sem exageros.",
  },
];

export function AboutValues() {
  return (
    <Section tone="raised" aria-labelledby="valores-titulo" className="border-t border-border">
      <SectionHeader id="valores-titulo" title="O que define a Eveul" />

      <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
        {values.map((v) => (
          <li key={v.title}>
            <h3 className="rule-top text-h3">{v.title}</h3>
            <p className="mt-3 text-muted-foreground">{v.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-h3 uppercase">Vê os modelos disponíveis</p>
        <Button asChild>
          <Link href="/watches">Ver relógios</Link>
        </Button>
      </div>
    </Section>
  );
}
