import { SiteNavbar } from "@/components/site-navbar";
import { EveulHero } from "@/components/hero/eveul-hero";
import { EveulHeroCarousel } from "@/components/hero/eveul-hero-carousel";
import { FeaturedCollection } from "@/components/home/featured-collection";

export default function Home() {
  return (
    <main className="relative">
      <SiteNavbar />
      <EveulHeroCarousel />
      <FeaturedCollection />

    </main>
  );
}
