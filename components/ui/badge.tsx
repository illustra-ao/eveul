import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Badges Eveul
 * Marca:  best · limited · new · last (últimas unidades) · soldout
 * Admin:  default · secondary · outline · destructive
 */
const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap",
    "rounded-sm px-2.5 pb-[5px] pt-1.5 font-display text-label font-semibold uppercase",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      variant: {
        best: "bg-primary text-primary-foreground",
        limited: "bg-rose text-ink",
        new: "text-foreground shadow-[inset_0_0_0_1px_currentColor]",
        last: "text-gold shadow-[inset_0_0_0_1px_currentColor]",
        soldout: "bg-muted text-muted-foreground",

        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "text-foreground shadow-[inset_0_0_0_1px_var(--border)]",
        destructive: "bg-destructive text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
