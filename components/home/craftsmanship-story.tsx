// components/home/craftsmanship-story.tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/brand/section";
import { SectionHeader } from "@/components/brand/section-header";
import { InlineVideo } from "@/components/brand/inline-video";
import { NumberedList } from "@/components/brand/numbered-list";

const points = [
  {
    title: "Materiais escolhidos",
    text: "Aço inoxidável, vidro de safira e acabamentos que aguentam o uso real.",
  },
  {
    title: "Montagem cuidada",
    text: "Controlo de qualidade em cada etapa, peça a peça.",
  },
  {
    title: "Apoio depois da compra",
    text: "Garantia de 12 meses e assistência local, sem intermediários.",
  },
];

export function CraftsmanshipStory() {
  return (
    <Section id="atelier" aria-labelledby="atelier-titulo" className="mobile-content-auto scroll-mt-16">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <SectionHeader
            id="atelier-titulo"
            title={
              <>
                Detalhe visível.
                <br />
                Precisão sentida.
              </>
            }
            intro="Cada peça Eveul nasce de um processo focado em acabamento e fiabilidade. Menos ruído, mais presença, e um mecanismo que se deixa observar."
            className="mb-8 md:mb-10"
          />

          <NumberedList items={points} />

          <Button asChild variant="ghost" className="mt-8">
            <Link href="/about#process">Conhecer o processo</Link>
          </Button>
        </div>

        <figure className="md:col-span-7">
          <InlineVideo
            src="/videos/eveul-craft.mp4"
            poster="/images/story-poster.webp"
            label="Vídeo: o processo por trás de cada peça Eveul"
            className="aspect-[4/5] sm:aspect-video md:sticky md:top-24 md:aspect-[4/5] lg:aspect-[5/6]"
          />
          <figcaption className="mt-3 text-meta text-muted-foreground">
            O processo por trás de cada peça
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
