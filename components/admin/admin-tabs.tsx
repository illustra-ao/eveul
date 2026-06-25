import Link from "next/link";

const tabs = [
  { href: "/admin/products", label: "Produtos", value: "products" },
  { href: "/admin/carousel", label: "Carrossel", value: "carousel" },
];

export function AdminTabs({ active }: { active: "products" | "carousel" }) {
  return (
    <nav className="mt-8 flex flex-wrap gap-2" aria-label="Admin">
      {tabs.map((tab) => {
        const isActive = tab.value === active;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              "inline-flex h-10 items-center rounded-full border px-5 text-xs tracking-[0.18em] backdrop-blur transition",
              isActive
                ? "border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 text-foreground"
                : "border-border bg-card/10 text-muted-foreground hover:bg-card/20 hover:text-foreground",
            ].join(" ")}
          >
            {tab.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
