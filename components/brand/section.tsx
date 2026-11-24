import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "raised" | "light";
type Spacing = "default" | "compact" | "none";
type Width = "site" | "prose" | "full";

const toneClass: Record<Tone, string> = {
  dark: "bg-background text-foreground",
  raised: "bg-card text-card-foreground",
  // .tone-light redefine os tokens semânticos: tudo o que está dentro adapta-se
  light: "tone-light",
};

const spacingClass: Record<Spacing, string> = {
  default: "py-section",
  compact: "py-section-sm",
  none: "",
};

const widthClass: Record<Width, string> = {
  site: "mx-auto w-full max-w-site px-gutter",
  prose: "mx-auto w-full max-w-prose px-gutter",
  full: "w-full",
};

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "header" | "footer" | "aside";
  /** dark (padrão) · raised (cartão) · light (faixa clara, estilo lifestyle) */
  tone?: Tone;
  spacing?: Spacing;
  width?: Width;
  /** classes do contentor interno */
  innerClassName?: string;
};

/**
 * Contentor e ritmo vertical de todas as secções.
 * Substitui os `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20` repetidos.
 */
export function Section({
  as: Comp = "section",
  tone = "dark",
  spacing = "default",
  width = "site",
  className,
  innerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <Comp className={cn(toneClass[tone], spacingClass[spacing], className)} {...props}>
      <div className={cn(widthClass[width], innerClassName)}>{children}</div>
    </Comp>
  );
}
