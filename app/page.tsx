import { Suspense } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { EveulHeroCarousel } from "@/components/hero/eveul-hero-carousel";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { BestSellers } from "@/components/home/best-sellers";
import { BestSellersSkeleton } from "@/components/home/best-sellers-client";
import { OnTheWrist } from "@/components/home/on-the-wrist";
import { CraftsmanshipStory } from "@/components/home/craftsmanship-story";
import { FinalNewsletterCTA } from "@/components/home/final-newsletter-cta";
import { SiteFooter } from "@/components/site-footer";
import { getHeroCarouselSlides } from "@/lib/hero-carousel-data";

export const dynamic = "force-dynamic";

/*
 * Ritmo da home (escuro → claro → escuro):
 * Hero · Condições · Slogan + colecções · Mais vendidos · No pulso (claro)
 * · Processo (vídeo) · Newsletter · Footer
 */
export default async function Home() {
  const heroSlides = await getHeroCarouselSlides();

  return (
    <>
      <SiteNavbar />
      <main id="conteudo">
        <EveulHeroCarousel slides={heroSlides} />
        <FeaturedCollection />
        <Suspense fallback={<BestSellersSkeleton />}>
          <BestSellers />
        </Suspense>
        <OnTheWrist />
        <CraftsmanshipStory />
        <FinalNewsletterCTA />
      </main>
      <SiteFooter />
    </>
  );
}
