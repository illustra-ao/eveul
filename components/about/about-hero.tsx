// components/about/about-hero.tsx
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <section aria-labelledby="sobre-titulo" className="pt-16">
      <div className="mx-auto grid w-full max-w-site md:grid-cols-12 md:px-gutter">
        <div className="relative aspect-[5/4] bg-sunken md:order-2 md:col-span-6 md:my-8 md:aspect-auto md:min-h-[34rem]">
          {/* PROVISÓRIO: substituir por fotografia da marca (atelier, equipa, Luanda) */}
          <Image
            src="/images/feature-1.webp"
            alt="Detalhe de um relógio Eveul"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={76}
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-end px-gutter py-10 md:order-1 md:col-span-6 md:px-0 md:py-16 md:pr-12">
          <p className="text-meta font-medium text-gold">Sobre a Eveul</p>
          <h1 id="sobre-titulo" className="mt-4 text-display">
            Presença.
            <br />
            Precisão.
            <br />
            Identidade.
          </h1>
          <p className="mt-6 max-w-md text-lead text-muted-foreground">
            Uma marca angolana de relógios e óculos com acabamento cuidado e
            estética intencional. {siteConfig.slogan}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/watches">Ver a colecção</Link>
            </Button>
            <Button asChild variant="ghost">
              <a href="#process">O nosso processo</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
