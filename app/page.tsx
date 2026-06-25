import { Suspense } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { EveulHeroCarousel } from "@/components/hero/eveul-hero-carousel";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { BestSellers } from "@/components/home/best-sellers";
import { CraftsmanshipStory } from "@/components/home/craftsmanship-story";
import { FinalNewsletterCTA } from "@/components/home/final-newsletter-cta";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

function BestSellersLoading() {
  return (
    <section
      id="best-sellers"
      className="relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/80" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="h-3 w-32 rounded-full bg-[color:var(--gold)]/25" />
        <div className="mt-5 h-10 w-full max-w-xl rounded-2xl bg-white/10" />
        <div className="mt-4 h-4 w-full max-w-md rounded-full bg-white/10" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-3xl border border-border bg-card/15"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative">
      <SiteNavbar />
      <EveulHeroCarousel />
      <FeaturedCollection />
      <Suspense fallback={<BestSellersLoading />}>
        <BestSellers />
      </Suspense>
      <CraftsmanshipStory />
      <FinalNewsletterCTA />
      <SiteFooter />
    </main>
  );
}
