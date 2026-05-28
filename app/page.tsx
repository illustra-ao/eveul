import { SiteNavbar } from "@/components/site-navbar";
import { EveulHeroCarousel } from "@/components/hero/eveul-hero-carousel";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { BestSellers } from "@/components/home/best-sellers";
import { CraftsmanshipStory } from "@/components/home/craftsmanship-story";
import { FinalNewsletterCTA } from "@/components/home/final-newsletter-cta";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="relative">
      <SiteNavbar />
      <EveulHeroCarousel />
      <FeaturedCollection />
      <BestSellers />
      <CraftsmanshipStory />
      <FinalNewsletterCTA />
      <SiteFooter />
    </main>
  );
}
