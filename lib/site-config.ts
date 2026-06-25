export const siteConfig = {
  name: "Eveul",
  supportEmail: "support@eveul.ao",
  whatsappNumber: "244943670112",
  whatsappDisplay: "+244 943 670 112",
  fallbackProductImage: "/images/watch-thumb.webp",
};

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppLink(productName: string) {
  return buildWhatsAppLink(
    `Ola, tenho interesse no relogio ${productName}. Podem ajudar-me com disponibilidade e compra?`,
  );
}

export const defaultWhatsAppLink = buildWhatsAppLink(
  "Ola, quero falar com a Eveul sobre os relogios disponiveis.",
);
