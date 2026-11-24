import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Botões Eveul
 * - default    → CTA principal (ouro no tom escuro, tinta no tom claro)
 * - secondary  → contorno na cor do texto
 * - ghost      → texto sublinhado com a linha de assinatura
 * - whatsapp   → compra/contacto (verde escurecido para AA com texto branco)
 * - outline / destructive / link → utilitários (admin, formulários)
 * Todas as alturas ≥ 44px (alvo de toque).
 */
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap",
    "rounded-sm font-display text-button font-semibold uppercase tracking-button",
    "transition-colors duration-200 ease-out-soft",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.125rem]",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
    "aria-invalid:outline-destructive",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        ghost:
          "bg-transparent px-1 text-foreground underline decoration-rule decoration-2 underline-offset-8 hover:decoration-foreground",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover",
        outline:
          "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "h-auto px-0 text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-11 px-4 text-sm",
        lg: "h-14 px-8",
        icon: "size-11",
        "icon-sm": "size-11",
        "icon-lg": "size-12",
      },
    },
    compoundVariants: [
      // o ghost não leva padding lateral de botão cheio
      { variant: "ghost", size: ["default", "sm", "lg"], className: "px-1" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
