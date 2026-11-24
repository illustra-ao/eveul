// components/about/about-story.tsx
import Image from "next/image";

import { Section } from "@/components/brand/section";
import { SectionHeader } from "@/components/brand/section-header";

const points = [
  {
    title: "Estética intencional",
    text: "Desenho limpo, detalhe à vista e o produto sempre em primeiro plano.",
  },
  {
    title: "Qualidade que se vê",
    text: "Materiais e acabamentos pensados para o uso de todos os dias.",
  },
  {
    title: "Compra simples",
    text: "Pelo WhatsApp, com resposta directa de quem conhece cada peça.",
  },
];

/** Faixa clara: a parte humana da marca. */
export function AboutStory() {
  return (
    <Section tone="light" aria-labelledby="historia-titulo">
      <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
        <div className="md:col-span-5">
          <SectionHeader
            id="historia-titulo"
            title="Uma marca construída à volta do detalhe"
            intro="A Eveul nasceu para quem quer uma peça com presença e acabamento cuidado, sem complicar a compra. Criamos poucas referências, com identidade própria e apoio próximo."
            className="mb-8"
          />

          <dl className="border-t border-border">
            {points.map((p) => (
              <div key={p.title} className="border-b border-border py-4">
                <dt className="font-display text-lg font-semibold uppercase tracking-wide">{p.title}</dt>
                <dd className="mt-1 text-muted-foreground">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative aspect-[4/5] bg-sunken md:col-span-7 md:aspect-[5/4]">
          {/* PROVISÓRIO: substituir por fotografia lifestyle real */}
          <Image
            src="/images/story-poster.webp"
            alt="Relógio Eveul em detalhe"
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            quality={72}
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}
