import * as React from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: React.ReactNode;
  /** Texto de apoio, no máximo 2–3 linhas */
  intro?: React.ReactNode;
  /** Pequeno texto contextual acima do título (ex.: "Colecção Limited").
   *  Usar raramente: a linha dourada já marca o início da secção. */
  kicker?: React.ReactNode;
  /** Link ou botão alinhado à direita (desktop) / abaixo (mobile) */
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h1" | "h2";
  align?: "start" | "center";
  /** Desliga a linha dourada (ex.: quando a secção já abre com imagem) */
  rule?: boolean;
  className?: string;
  id?: string;
};

const sizeClass = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
} as const;

/**
 * Cabeçalho de secção: linha dourada + título condensado + intro opcional.
 * Substitui o padrão eyebrow (`text-xs tracking-[0.22em]` dourado) + título serif.
 */
export function SectionHeader({
  title,
  intro,
  kicker,
  action,
  as: Heading = "h2",
  size = "h2",
  align = "start",
  rule = true,
  className,
  id,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {kicker ? (
          <p className="mb-3 text-meta font-medium text-muted-foreground">{kicker}</p>
        ) : null}
        <Heading
          id={id}
          className={cn(sizeClass[size], rule && "rule-top", rule && centered && "rule-top-center")}
        >
          {title}
        </Heading>
        {intro ? (
          <p className={cn("mt-4 text-lead text-muted-foreground", centered && "mx-auto")}>
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
