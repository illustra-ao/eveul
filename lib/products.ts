import { siteConfig } from "@/lib/site-config";

export type Collection = "Signature" | "Limited" | "Classic";
export type Badge = "BEST SELLER" | "LIMITED" | "NEW";

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
      "Uma assinatura Eveul com presenca forte, mecanismo aberto e acabamento premium para uso diario.",
    highlights: ["Open Gear", "Vidro de safira", "Caixa premium"],
    specs: [
      { k: "Movimento", v: "Automatico" },
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
      "Edicao limitada com detalhe mecanico em destaque, criada para quem prefere uma peca rara e expressiva.",
    highlights: ["Edicao limitada", "Open Gear", "Acabamento premium"],
    specs: [
      { k: "Movimento", v: "Automatico" },
      { k: "Edicao", v: "Limitada" },
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
      "Um modelo classico e versatil, pensado para acompanhar dias de trabalho, eventos e presentes especiais.",
    highlights: ["Classico", "Versatil", "Suporte local"],
    specs: [
      { k: "Movimento", v: "Quartzo premium" },
      { k: "Correia", v: "Couro / Aco" },
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
      "A linguagem Signature com tons dourados subtis, boa presenca no pulso e leitura elegante.",
    highlights: ["Signature", "Dourado subtil", "Vidro de safira"],
    specs: [
      { k: "Movimento", v: "Automatico" },
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
