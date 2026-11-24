// components/home/on-the-wrist.tsx
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/brand/section";
import { SectionHeader } from "@/components/brand/section-header";

const instagramUrl = "https://www.instagram.com/_eveul/";

// PROVISÓRIO: substituir por fotografias lifestyle reais (clientes, pulsos, retratos).
const photos = [
  { src: "/images/story-poster.webp", alt: "Relógio Eveul no pulso" },
  { src: "/images/feature-1.webp", alt: "Detalhe do mostrador" },
  { src: "/images/feature-3.webp", alt: "Relógio Eveul sobre a mesa" },
];

/**
 * Faixa clara (tom "lifestyle" do Instagram). Quebra o ritmo escuro da home
 * e dá lugar às pessoas.
 */
export function OnTheWrist() {
  return (
    <Section tone="light" aria-labelledby="no-pulso-titulo" className="mobile-content-auto">
      <SectionHeader
        id="no-pulso-titulo"
        title="No pulso"
        intro="Clientes e amigos da casa, em Luanda e não só. Partilha o teu com @_eveul."
        action={
          <Button asChild variant="secondary">
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              Seguir no Instagram
            </a>
          </Button>
        }
      />

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-[2fr_1fr_1fr] md:gap-4">
        {photos.map((photo, i) => (
          <li
            key={photo.src}
            className={i === 0 ? "col-span-2 md:col-span-1" : undefined}
          >
            <div className={`relative overflow-hidden bg-sunken ${i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[26rem]" : "aspect-[3/4]"}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                quality={70}
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
