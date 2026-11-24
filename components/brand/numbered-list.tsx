// components/brand/numbered-list.tsx
import { cn } from "@/lib/utils";

/** Lista numerada com divisores (01, 02, 03…). Substitui os cards com índice. */
export function NumberedList({
  items,
  className,
}: {
  items: { title: string; text: string }[];
  className?: string;
}) {
  return (
    <ol className={cn("border-t border-border", className)}>
      {items.map((item, i) => (
        <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-x-2 border-b border-border py-5">
          <span className="tabular font-display text-h3 text-gold" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-h3">{item.title}</h3>
            <p className="mt-1.5 text-muted-foreground">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
