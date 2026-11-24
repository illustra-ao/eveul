// components/about/about-process.tsx
import { Section } from "@/components/brand/section";
import { SectionHeader } from "@/components/brand/section-header";
import { InlineVideo } from "@/components/brand/inline-video";
import { NumberedList } from "@/components/brand/numbered-list";

const steps = [
  {
    title: "Selecção de materiais",
    text: "Componentes e acabamentos escolhidos pela durabilidade e pela estética.",
  },
  {
    title: "Montagem e verificação",
    text: "Ajustes e controlo de qualidade nas etapas críticas.",
  },
  {
    title: "Entrega e apoio",
    text: "Comunicação clara, garantia de 12 meses e assistência depois da compra.",
  },
];

export function AboutProcess() {
  return (
    <Section id="process" aria-labelledby="processo-titulo" className="scroll-mt-16">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <SectionHeader
            id="processo-titulo"
            title="Como garantimos cada peça"
            intro="Um processo claro, com controlo por etapas. Menos promessas, mais verificação."
            className="mb-8 md:mb-10"
          />
          <NumberedList items={steps} />
        </div>

        <figure className="md:col-span-7">
          <InlineVideo
            src="/videos/eveul-craft.mp4"
            poster="/images/story-poster.webp"
            label="Vídeo: da intenção ao acabamento final"
            className="aspect-video md:sticky md:top-24"
          />
          <figcaption className="mt-3 text-meta text-muted-foreground">
            Da intenção ao acabamento final
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
