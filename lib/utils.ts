import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
 * Ensina o tailwind-merge sobre os tokens próprios do globals.css.
 * Sem isto, `text-h2` ou `text-label` seriam tratados como cor e
 * apagariam (ou seriam apagados por) `text-foreground`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "lead", "body", "meta", "label", "button"],
      spacing: ["section", "section-sm", "gutter", "touch", "bar"],
      container: ["site", "prose"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
