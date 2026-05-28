// components/site-footer.tsx
"use client";

import Link from "next/link";
import {
  defaultWhatsAppLink,
  siteConfig,
} from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border mt-6">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-140px] bottom-[-180px] h-[520px] w-[520px] rounded-full bg-[color:var(--gold)]/6 blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/75 to-black/95" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-sm font-semibold tracking-widest">EVEUL</div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Relógios com presença. Acabamento premium, produção limitada e
              suporte claro do início ao pós-venda.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Tag>PREMIUM</Tag>
              <Tag>LIMITED</Tag>
              <Tag>ANGOLA</Tag>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <FooterCol title="Colecção">
                <FooterLink href="/watches">Relógios</FooterLink>
                <FooterLink href="/#best-sellers">Best Sellers</FooterLink>
                <FooterLink href="/#craftsmanship">Craftsmanship</FooterLink>
              </FooterCol>

              <FooterCol title="Apoio">
                <FooterLink href="/support">Garantia & Serviço</FooterLink>
                <FooterLink href="/shipping">Envios & Devoluções</FooterLink>
                <FooterLink href="/faq">FAQs</FooterLink>
              </FooterCol>

              <FooterCol title="Empresa">
                <FooterLink href="/about">Sobre</FooterLink>
                <FooterLink href="/watches">Stock</FooterLink>
                <FooterLink href="/contact">Contactos</FooterLink>
              </FooterCol>

              <FooterCol title="Social">
                <FooterLink href={defaultWhatsAppLink}>WhatsApp</FooterLink>
                <FooterLink href={`mailto:${siteConfig.supportEmail}`}>Email</FooterLink>
                <FooterLink href="/#newsletter">Newsletter</FooterLink>
              </FooterCol>
            </div>

            <div className="mt-10 rounded-3xl border border-border bg-card/15 p-6 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                    CONTACTO DIRECTO
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="text-foreground">
                      {siteConfig.supportEmail}
                    </span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      WhatsApp:
                    </span>{" "}
                    <span className="text-foreground">
                      {siteConfig.whatsappDisplay}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
                  STOCK UPDATES • LIMITED DROPS • NEW MODELS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-[11px] tracking-[0.22em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} EVEUL. ALL RIGHTS RESERVED.</div>
          <div className="flex flex-wrap items-center gap-4">
            <Link className="hover:text-foreground" href="/terms">
              TERMS
            </Link>
            <Link className="hover:text-foreground" href="/privacy">
              PRIVACY
            </Link>
            <Link className="hover:text-foreground" href="/cookies">
              COOKIES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.22em] text-[color:var(--gold)]">
        {title.toUpperCase()}
      </div>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "text-xs tracking-[0.14em] text-muted-foreground hover:text-foreground";

  if (href.startsWith("http") || href.startsWith("mailto:")) {
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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-border bg-card/10 px-4 py-2 text-[10px] tracking-[0.22em] text-muted-foreground backdrop-blur">
      {children}
    </div>
  );
}
