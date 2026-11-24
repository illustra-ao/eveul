import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { Button, type buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/brand/icons";
import { buildProductWhatsAppLink, defaultWhatsAppLink } from "@/lib/site-config";

type WhatsAppButtonProps = {
  /** Se indicado, a mensagem menciona o produto (e o preço, se houver) */
  productName?: string;
  price?: number;
  intent?: "buy" | "restock";
  /** Link já construído (sobrepõe productName) */
  href?: string;
  children?: React.ReactNode;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

/** CTA de WhatsApp: abre em nova janela com a mensagem pré-preenchida. */
export function WhatsAppButton({
  productName,
  price,
  intent = "buy",
  href,
  children = "Encomendar no WhatsApp",
  size,
  className,
}: WhatsAppButtonProps) {
  const link =
    href ?? (productName ? buildProductWhatsAppLink(productName, { price, intent }) : defaultWhatsAppLink);

  return (
    <Button asChild variant="whatsapp" size={size} className={className}>
      <a href={link} target="_blank" rel="noreferrer">
        <WhatsAppIcon />
        {children}
      </a>
    </Button>
  );
}
