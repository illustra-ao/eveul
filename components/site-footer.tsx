// components/site-footer.tsx
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { EveulLogo } from "@/components/brand/icons";
import { WhatsAppButton } from "@/components/brand/whatsapp-button";

const columns = [
  {
    title: "Colecção",
    links: [
      { href: "/watches", label: "Relógios" },
      { href: "/#mais-vendidos", label: "Mais vendidos" },
      { href: "/#atelier", label: "O processo" },
    ],
  },
  {
    title: "Apoio",
    links: [
      { href: "/support", label: "Garantia e serviço" },
      { href: "/shipping", label: "Envios e devoluções" },
      { href: "/faq", label: "Perguntas frequentes" },
    ],
  },
  {
    title: "Eveul",
    links: [
      { href: "/about", label: "Sobre a marca" },
      { href: "/contact", label: "Contactos" },
      { href: "https://www.instagram.com/_eveul/", label: "Instagram" },
    ],
  },
];

const legal = [
  { href: "/terms", label: "Termos" },
  { href: "/privacy", label: "Privacidade" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-site px-gutter py-section-sm">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <EveulLogo />
            <p className="mt-6 font-display text-h2 uppercase">{siteConfig.slogan}.</p>
            <p className="mt-3 max-w-sm text-muted-foreground">
              Relógios e óculos de marca angolana. Encomendas e apoio directo pelo WhatsApp.
            </p>
            <div className="mt-6 flex flex-col items-start gap-2">
              <WhatsAppButton>Falar connosco</WhatsAppButton>
              <p className="text-meta text-muted-foreground">
                {siteConfig.whatsappDisplay} · {siteConfig.supportEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="rule-top text-label font-semibold tracking-[0.14em] text-muted-foreground">
                  {col.title}
                </h2>
                <ul className="mt-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-meta text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Eveul · Luanda, Angola</p>
          <ul className="flex gap-6">
            {legal.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} small>
                  {link.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  small,
}: {
  href: string;
  children: React.ReactNode;
  small?: boolean;
}) {
  const className = small
    ? "inline-flex min-h-touch items-center hover:text-foreground"
    : "inline-flex min-h-touch items-center text-foreground/85 hover:text-foreground hover:underline hover:decoration-rule hover:underline-offset-4";

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
