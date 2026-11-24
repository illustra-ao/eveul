import { siteConfig } from "@/lib/site-config";

export type Collection = "Signature" | "Limited" | "Classic";
export type Badge = "BEST SELLER" | "LIMITED" | "NEW";

/* ── Categoria e disponibilidade (colunas products.category / products.availability) ── */

export type Category = "watch" | "eyewear";
export type Availability = "available" | "last" | "soldout";

export const categories: Category[] = ["watch", "eyewear"];

export const categoryLabels: Record<Category, string> = {
  watch: "Relógios",
  eyewear: "Óculos",
};

/** Valor usado no URL do catálogo: /watches?categoria=oculos */
export const categoryParams: Record<Category, string> = {
  watch: "relogios",
  eyewear: "oculos",
};

export const availabilityLabels: Record<Availability, string> = {
  available: "Disponível",
  last: "Últimas unidades",
  soldout: "Esgotado",
};

export function parseCategory(value: unknown): Category {
  return value === "eyewear" ? "eyewear" : "watch";
}

export function parseAvailability(value: unknown): Availability {
  return value === "last" || value === "soldout" ? value : "available";
}

/** ?categoria=oculos → "eyewear"; ausente/inválido → null (todas) */
export function categoryFromParam(value?: string | null): Category | null {
  const match = categories.find((c) => categoryParams[c] === value?.toLowerCase());
  return match ?? null;
}

/** Esgotados vão para o fim, mantendo a ordem relativa dos restantes */
export function soldOutLast<T extends { availability?: Availability }>(list: T[]): T[] {
  return [...list].sort(
    (a, b) => Number(a.availability === "soldout") - Number(b.availability === "soldout"),
  );
}

export type ProductSpec = {
  k: string;
  v: string;
};

export type FallbackProduct = {
  id: string;
  slug: string;
  name: string;
  collection: Collection;
  price: number;
  currency: string;
  badge?: Badge;
  category?: Category;
  availability?: Availability;
  images: string[];
  description: string;
  highlights: string[];
  specs: ProductSpec[];
};

export const fallbackProducts: FallbackProduct[] = [
  {
    id: "eveul-jupiter",
    slug: "eveul-jupiter",
    name: "Eveul Jupiter",
    collection: "Signature",
    price: 189000,
    currency: "Kz",
    badge: "BEST SELLER",
    images: ["/images/eveul3.png", "/images/feature-4.webp"],
    description:
      "Uma assinatura Eveul com presença forte, mecanismo aberto e acabamento premium para uso diário.",
    highlights: ["Open Gear", "Vidro de safira", "Caixa premium"],
    specs: [
      { k: "Movimento", v: "Automático" },
      { k: "Vidro", v: "Safira" },
      { k: "Garantia", v: "12 meses" },
      { k: "Envio", v: "Luanda 24-72h" },
    ],
  },
  {
    id: "eveul-paraiba",
    slug: "eveul-paraiba",
    name: "Eveul Paraiba",
    collection: "Limited",
    price: 265000,
    currency: "Kz",
    badge: "LIMITED",
    images: ["/images/eveul2.png", "/images/feature-3.webp"],
    description:
      "Edição limitada com detalhe mecânico em destaque, criada para quem prefere uma peça rara e expressiva.",
    highlights: ["Edição limitada", "Open Gear", "Acabamento premium"],
    specs: [
      { k: "Movimento", v: "Automático" },
      { k: "Edição", v: "Limitada" },
      { k: "Garantia", v: "12 meses" },
      { k: "Envio", v: "Luanda 24-72h" },
    ],
  },
  {
    id: "eveul-noir",
    slug: "eveul-noir",
    name: "Eveul Noir",
    collection: "Classic",
    price: 149000,
    currency: "Kz",
    badge: "NEW",
    images: ["/images/feature-1.webp", "/images/watch-thumb.webp"],
    description:
      "Um modelo clássico e versátil, pensado para acompanhar dias de trabalho, eventos e presentes especiais.",
    highlights: ["Clássico", "Versátil", "Suporte local"],
    specs: [
      { k: "Movimento", v: "Quartzo premium" },
      { k: "Correia", v: "Couro / Aço" },
      { k: "Garantia", v: "12 meses" },
      { k: "Envio", v: "Luanda 24-72h" },
    ],
  },
  {
    id: "eveul-goldline",
    slug: "eveul-goldline",
    name: "Eveul Goldline",
    collection: "Signature",
    price: 210000,
    currency: "Kz",
    badge: "BEST SELLER",
    images: ["/images/feature-2.webp", "/images/eveul1.png"],
    description:
      "A linguagem Signature com tons dourados subtis, boa presença no pulso e leitura elegante.",
    highlights: ["Signature", "Dourado subtil", "Vidro de safira"],
    specs: [
      { k: "Movimento", v: "Automático" },
      { k: "Vidro", v: "Safira" },
      { k: "Garantia", v: "12 meses" },
      { k: "Envio", v: "Luanda 24-72h" },
    ],
  },
];

export function getFallbackProductBySlug(slug: string) {
  return fallbackProducts.find((product) => product.slug === slug);
}

export function getFallbackRelatedProducts(product: FallbackProduct) {
  return fallbackProducts
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => {
      if (a.collection === product.collection && b.collection !== product.collection) {
        return -1;
      }
      if (a.collection !== product.collection && b.collection === product.collection) {
        return 1;
      }
      return 0;
    })
    .slice(0, 4);
}

export function getPrimaryImage(images?: readonly string[]) {
  return images?.[0] ?? siteConfig.fallbackProductImage;
}
