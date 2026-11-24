// components/home/featured-collection.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Section } from "@/components/brand/section";

const trust = [
  { title: "Entrega em Luanda", text: "24 a 72 horas após confirmação" },
  { title: "Garantia de 12 meses", text: "Assistência local no pós-venda" },
  { title: "Encomenda simples", text: "Pelo WhatsApp, com AppyPay, referência ou TPA" },
];

// Imagens provisórias: substituir por fotografia real de cada colecção.
const collections = [
  {
    name: "Signature",
    text: "A assinatura da casa. Mecanismo à vista, presença no pulso.",
    image: "/images/feature-2.webp",
  },
  {
    name: "Limited",
    text: "Edições curtas. Quando esgotam, não voltam.",
    image: "/images/feature-1.webp",
  },
  {
    name: "Classic",
    text: "Linhas simples para todos os dias e para oferecer.",
    image: "/images/feature-3.webp",
  },
];

export function FeaturedCollection() {
  return (
    <>
      {/* Faixa de confiança: logo abaixo do hero, responde às dúvidas de compra */}
      <section aria-label="Condições" className="border-y border-border bg-card">
        <ul className="mx-auto grid w-full max-w-site divide-y divide-border px-gutter sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {trust.map((item) => (
            <li key={item.title} className="py-5 sm:px-6 sm:first:pl-0">
              <p className="font-display text-base font-semibold uppercase tracking-wide">{item.title}</p>
              <p className="mt-1 text-meta text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <Section aria-labelledby="colecoes-titulo" className="mobile-content-auto">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h2 id="colecoes-titulo" className="rule-top text-display md:col-span-8">
            {siteConfig.slogan}.
          </h2>
          <p className="text-lead text-muted-foreground md:col-span-4">
            Relógios desenhados em Angola para quem marca o próprio tempo. Três
            colecções, poucas peças de cada.
          </p>
        </div>

        <ul className="-mx-gutter mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-gutter pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {collections.map((c) => (
            <li key={c.name} className="w-[78vw] shrink-0 snap-start md:w-auto">
              <Link
                href={`/watches?colecao=${c.name.toLowerCase()}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-sunken"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 78vw"
                  quality={70}
                  className="object-cover transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-[1.03]"
                />
                {/* gradiente só onde está o texto */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-h2 text-ivory">{c.name}</h3>
                    <ArrowUpRight className="mb-1 size-6 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                  <p className="mt-2 max-w-xs text-meta text-ivory/80">{c.text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
