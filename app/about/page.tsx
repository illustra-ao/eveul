// app/about/page.tsx
import type { Metadata } from "next";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { AboutProcess } from "@/components/about/about-process";
import { AboutValues } from "@/components/about/about-values";
import { FinalNewsletterCTA } from "@/components/home/final-newsletter-cta";

export const metadata: Metadata = {
  title: "Sobre",
  description: "A Eveul é uma marca angolana de relógios e óculos. As horas não são as mesmas.",
};

export default function AboutPage() {
  return (
    <>
      <SiteNavbar />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutProcess />
        <AboutValues />
        <FinalNewsletterCTA />
      </main>
      <SiteFooter />
    </>
  );
}
