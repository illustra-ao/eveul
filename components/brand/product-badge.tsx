import { Badge } from "@/components/ui/badge";

export type ProductBadgeValue = "BEST SELLER" | "LIMITED" | "NEW";
export type Availability = "available" | "last" | "soldout";

const badgeMap = {
  "BEST SELLER": { variant: "best", label: "Best seller" },
  LIMITED: { variant: "limited", label: "Limited" },
  NEW: { variant: "new", label: "New" },
} as const;

/**
 * Escolhe UM badge por produto. A disponibilidade tem prioridade sobre o
 * badge comercial: "Esgotado" > "Últimas unidades" > BEST SELLER/LIMITED/NEW.
 */
export function ProductBadge({
  badge,
  availability = "available",
  className,
}: {
  badge?: ProductBadgeValue | null;
  availability?: Availability;
  className?: string;
}) {
  if (availability === "soldout") {
    return <Badge variant="soldout" className={className}>Esgotado</Badge>;
  }
  if (availability === "last") {
    return <Badge variant="last" className={className}>Últimas unidades</Badge>;
  }
  if (!badge) return null;

  const { variant, label } = badgeMap[badge];
  return <Badge variant={variant} className={className}>{label}</Badge>;
}
