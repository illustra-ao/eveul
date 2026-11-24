import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buildProductWhatsAppLink, formatKz, siteConfig } from "@/lib/site-config";
import { ProductBadge, type Availability, type ProductBadgeValue } from "@/components/brand/product-badge";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  collection?: string | null;
  badge?: ProductBadgeValue | null;
  image?: string | null;
  imageAlt?: string;
  /** Linha curta de detalhe: "Ouro rosa · 42mm" */
  detail?: string | null;
  /** Ainda não existe no Supabase; o padrão é "available" */
  availability?: Availability;
};

type ProductCardProps = {
  product: ProductCardData;
  href?: string;
  /** true para os cards visíveis sem scroll (LCP) */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Card de produto único para home, catálogo e relacionados.
 * - O card inteiro é clicável (link "esticado" no título) sem aninhar <a>.
 * - Esgotado: imagem dessaturada e link para pedir reposição no WhatsApp.
 */
export function ProductCard({
  product,
  href = `/watches/${product.slug}`,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw",
  className,
}: ProductCardProps) {
  const { name, price, collection, badge, image, imageAlt, detail, availability = "available" } = product;
  const soldOut = availability === "soldout";

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-card text-card-foreground",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-ring",
        className,
      )}
    >
      {/* linha de assinatura: cresce no hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-[0.18] bg-rule transition-transform duration-500 ease-out-soft group-hover:scale-x-100"
      />

      <div className="relative aspect-[4/5] overflow-hidden bg-sunken">
        <Image
          src={image || siteConfig.fallbackProductImage}
          alt={imageAlt ?? name}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-[1.03]",
            soldOut && "grayscale brightness-75",
          )}
        />
        <ProductBadge badge={badge} availability={availability} className="absolute left-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-5 pt-4">
        {collection ? <p className="text-meta text-muted-foreground">{collection}</p> : null}

        <h3 className="text-h3">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {name}
          </Link>
        </h3>

        <div className="mt-auto flex items-baseline justify-between gap-3 pt-2">
          {soldOut ? (
            <>
              <span className="text-meta text-muted-foreground">Esgotado</span>
              <a
                href={buildProductWhatsAppLink(name, { intent: "restock" })}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 -my-3 inline-flex min-h-touch items-center font-display text-meta font-semibold uppercase tracking-button underline decoration-rule decoration-2 underline-offset-4"
              >
                Perguntar reposição
              </a>
            </>
          ) : (
            <>
              <span className="tabular font-display text-xl font-semibold tracking-wide text-gold">
                {formatKz(price)}
              </span>
              {detail ? <span className="text-meta text-muted-foreground">{detail}</span> : null}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
