// components/admin/admin-ui.tsx
// Peças pequenas e neutras do admin (sem estética de "luxo").
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type ProductStatus = "active" | "draft" | "archived";

const statusMap: Record<ProductStatus, { label: string; variant: "default" | "outline" | "secondary" }> = {
  active: { label: "Publicado", variant: "default" },
  draft: { label: "Rascunho", variant: "outline" },
  archived: { label: "Arquivado", variant: "secondary" },
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const { label, variant } = statusMap[status] ?? statusMap.draft;
  return <Badge variant={variant} className="text-xs">{label}</Badge>;
}

/** Classe para <select> nativos, igual ao <Input> */
export const selectClass =
  "h-11 w-full rounded-sm border border-input bg-transparent px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Classe para <textarea> nativos */
export const textareaClass =
  "w-full rounded-sm border border-input bg-transparent p-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Campo de formulário: etiqueta + ajuda + controlo */
export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-meta text-muted-foreground">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** Caixa com borda, para agrupar conteúdo */
export function Panel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-md border border-border bg-card p-5 md:p-6", className)}>
      {title ? (
        <header className="mb-5">
          <h2 className="text-lg">{title}</h2>
          {description ? <p className="mt-1 text-meta text-muted-foreground">{description}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/** Aviso de configuração (Supabase sem tabelas/variáveis) */
export function SetupNotice({
  title,
  body,
  message,
  children,
}: {
  title: string;
  body: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <Panel className="border-gold/40">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{body}</p>
      <pre className="mt-5 overflow-x-auto rounded-sm border border-border bg-background p-4 text-meta whitespace-pre-wrap text-muted-foreground">
        {message}
      </pre>
      {children ? <div className="mt-6 flex flex-wrap gap-2">{children}</div> : null}
    </Panel>
  );
}
