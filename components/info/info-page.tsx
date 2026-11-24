import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { Section } from "@/components/brand/section";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";

type Stat = {
  label: string;
  value: string;
};

type InfoItem = {
  title: string;
  body: string;
};

type InfoSection = {
  /** Etiqueta curta: usada no índice lateral (desktop) */
  eyebrow: string;
  title: string;
  body?: string;
  items?: InfoItem[];
};

type InfoPageProps = {
  /** Mantido por compatibilidade; o título já identifica a página */
  eyebrow?: string;
  title: string;
  intro: string;
  /** Mantido por compatibilidade; páginas de texto não mostram imagem (mais leve no mobile) */
  image?: string;
  stats: Stat[];
  sections: InfoSection[];
  finalTitle?: string;
  finalBody?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Remove o ponto final decorativo dos títulos ("Perguntas frequentes." → "Perguntas frequentes") */
function cleanTitle(value: string) {
  return value.replace(/\.$/, "");
}

/**
 * Template das páginas informativas (contactos, FAQ, envios, apoio, termos,
 * privacidade, cookies). Texto em primeiro lugar, índice lateral no desktop.
 */
export function InfoPage({
  title,
  intro,
  stats,
  sections,
  finalTitle = "Precisa de apoio directo?",
  finalBody = "Fale connosco para confirmar disponibilidade, entrega, garantia ou qualquer detalhe antes da compra.",
}: InfoPageProps) {
  const toc = sections.map((s) => ({ ...s, id: slugify(s.eyebrow || s.title) }));

  return (
    <>
      <SiteNavbar />
      <main className="pt-16">
        <Section spacing="compact" aria-labelledby="info-titulo">
          <h1 id="info-titulo" className="rule-top max-w-3xl text-h1">
            {cleanTitle(title)}
          </h1>
          <p className="mt-5 max-w-2xl text-lead text-muted-foreground">{intro}</p>

          {stats.length > 0 ? (
            <dl className="mt-10 grid border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
              {stats.map((stat) => (
                <div key={stat.label} className="border-b border-border py-4 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0">
                  <dt className="text-meta text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 font-display text-lg font-semibold uppercase tracking-wide">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Section>

        <Section spacing="none" className="pb-section">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <nav aria-label="Nesta página" className="hidden lg:col-span-3 lg:block">
              <ol className="sticky top-24 border-l border-border">
                {toc.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px flex min-h-touch items-center border-l-2 border-transparent pl-4 text-muted-foreground transition-colors hover:border-rule hover:text-foreground"
                    >
                      {cleanTitle(s.title)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="lg:col-span-8 lg:col-start-5">
              {toc.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-titulo`}
                  className={i === 0 ? "scroll-mt-24" : "mt-14 scroll-mt-24 md:mt-16"}
                >
                  <h2 id={`${section.id}-titulo`} className="rule-top text-h2">
                    {cleanTitle(section.title)}
                  </h2>
                  {section.body ? (
                    <p className="mt-4 max-w-prose text-muted-foreground">{section.body}</p>
                  ) : null}

                  {section.items?.length ? (
                    <dl className="mt-6 border-t border-border">
                      {section.items.map((item) => (
                        <div key={item.title} className="border-b border-border py-5 md:grid md:grid-cols-[14rem_1fr] md:gap-6">
                          <dt className="font-display text-lg font-semibold uppercase leading-tight tracking-wide">
                            {item.title}
                          </dt>
                          <dd className="mt-1.5 text-muted-foreground md:mt-0">{item.body}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </Section>

        <Section tone="raised" spacing="compact" className="border-t border-border">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-h2">{cleanTitle(finalTitle)}</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">{finalBody}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton>Falar no WhatsApp</WhatsAppButton>
              <Button asChild variant="secondary">
                <a href={`mailto:${siteConfig.supportEmail}`}>Enviar email</a>
              </Button>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
