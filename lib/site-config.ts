export const siteConfig = {
  name: "Eveul",
  slogan: "As horas não são as mesmas",
  supportEmail: "support@eveul.ao",
  whatsappNumber: "244941960596",
  whatsappDisplay: "+244 941 960 596",
  fallbackProductImage: "/images/watch-thumb.webp",
};

export function formatKz(value: number) {
  // pt-PT agrupa milhares com espaço: 385 000
  return `${new Intl.NumberFormat("pt-PT").format(value)} Kz`;
}

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensagem pré-preenchida para um produto.
 * `price` é opcional para manter compatibilidade com as chamadas existentes.
 */
export function buildProductWhatsAppLink(
  productName: string,
  options: { price?: number; intent?: "buy" | "restock" } = {},
) {
  const { price, intent = "buy" } = options;
  const priceText = price ? ` (${formatKz(price)})` : "";

  const message =
    intent === "restock"
      ? `Olá! O ${productName} aparece como esgotado. Há previsão de reposição?`
      : `Olá! Tenho interesse no ${productName}${priceText}. Está disponível?`;

  return buildWhatsAppLink(message);
}

export const defaultWhatsAppLink = buildWhatsAppLink(
  "Olá! Gostava de saber mais sobre os relógios e óculos Eveul.",
);
