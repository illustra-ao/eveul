import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { defaultWhatsAppLink, siteConfig } from "@/lib/site-config";

type Stat = {
  label: string;
  value: string;
};

type InfoItem = {
  title: string;
  body: string;
};

type InfoSection = {
  eyebrow: string;
  title: string;
  body?: string;
  items?: InfoItem[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  stats: Stat[];
  sections: InfoSection[];
  finalTitle?: string;
  finalBody?: string;
};

export function InfoPage({
  eyebrow,
  title,
  intro,
  image,
  stats,
  sections,
  finalTitle = "Precisa de apoio directo?",
  finalBody = "Fale connosco para confirmar disponibilidade, entrega, garantia ou qualquer detalhe antes da compra.",
}: InfoPageProps) {
  return (
    <main className="relative">
      <SiteNavbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/10 blur-[140px]" />
          <div className="absolute -right-56 top-10 h-[620px] w-[620px] rounded-full bg-white/5 blur-[160px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/90" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                {eyebrow}
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
                {intro}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90"
                >
                  <a href={defaultWhatsAppLink} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </Button>
                <Link
                  href="/watches"
                  className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
                >
                  VER STOCK →
                </Link>
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="relative overflow-hidden rounded-4xl border border-border bg-card/20 backdrop-blur">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/25 to-black/10" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-border bg-card/15 p-5 backdrop-blur"
              >
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  {stat.label.toUpperCase()}
                </div>
                <div className="mt-2 text-sm text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/75 to-black/95" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-4xl border border-border bg-card/15 p-7 backdrop-blur md:p-8"
              >
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                  {section.eyebrow}
                </div>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl leading-[1.05] tracking-tight">
                  {section.title}
                </h2>
                {section.body ? (
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {section.body}
                  </p>
                ) : null}

                {section.items ? (
                  <div className="mt-6 divide-y divide-border/70 border-t border-border/70">
                    {section.items.map((item) => (
                      <div
                        key={item.title}
                        className="py-4"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {item.title}
                        </div>
                        <div className="mt-1 text-sm leading-7 text-muted-foreground">
                          {item.body}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-4xl border border-border bg-card/15 p-8 backdrop-blur md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  EVEUL SUPPORT
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl tracking-tight">
                  {finalTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {finalBody}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90"
                >
                  <a href={defaultWhatsAppLink} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-border bg-black/20 px-6 backdrop-blur hover:bg-black/35"
                >
                  <a href={`mailto:${siteConfig.supportEmail}`}>Email</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
