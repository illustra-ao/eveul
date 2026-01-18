// app/about/page.tsx
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { AboutValues } from "@/components/about/about-values";
import { FinalNewsletterCTA } from "@/components/home/final-newsletter-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { AboutProcess } from "@/components/about/about-process";

export default function AboutPage() {
  return (
    <main className="relative">
      <SiteNavbar />
      <AboutHero />
      <AboutStory />
      <AboutProcess />
      <AboutValues />
      <FinalNewsletterCTA />
      <SiteFooter />
    </main>
  );
}
