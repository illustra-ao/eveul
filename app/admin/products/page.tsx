import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { ProductRowActions } from "@/components/admin/product-row-actions";

function Meta({
  label,
  value,
  gold,
}: {
  label: string;
  value: string;
  gold?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-black/10 p-3">
      <div className="text-[10px] tracking-[0.22em] text-muted-foreground">
        {label.toUpperCase()}
      </div>
      <div
        className={[
          "mt-1 text-sm",
          gold ? "text-[color:var(--gold)]" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

export default async function AdminProductsPage() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id,slug,name,collection,price,currency,status,created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                ADMIN
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-4xl tracking-tight">
                Produtos
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Criar, editar, publicar e gerir imagens dos produtos.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="rounded-full bg-primary px-5 py-3 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90"
            >
              NOVO PRODUTO
            </Link>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card/15 backdrop-blur">
            {/* Header só em md+ */}
            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border px-5 py-3 text-[11px] tracking-[0.22em] text-muted-foreground">
              <div className="col-span-4">NOME</div>
              <div className="col-span-2">COLECÇÃO</div>
              <div className="col-span-2">PREÇO</div>
              <div className="col-span-2">ESTADO</div>
              <div className="col-span-2 text-right">ACÇÕES</div>
            </div>

            {(data ?? []).map((p) => (
              <div
                key={p.id}
                className={[
                  // mobile: card; md+: linha de tabela
                  "border-b border-border/60 last:border-b-0",
                  "p-5 md:p-0",
                  "md:grid md:grid-cols-12 md:gap-4 md:px-5 md:py-4",
                ].join(" ")}
              >
                {/* Nome / slug */}
                <div className="md:col-span-4">
                  <div className="text-sm text-foreground">{p.name}</div>
                  <div className="mt-1 text-[11px] tracking-[0.22em] text-muted-foreground break-all">
                    {p.slug}
                  </div>

                  {/* Mobile: mini info */}
                  <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
                    <Meta label="Colecção" value={p.collection} />
                    <Meta
                      label="Preço"
                      value={`${p.currency} ${new Intl.NumberFormat("pt-PT").format(p.price)}`}
                      gold
                    />
                  </div>
                </div>

                {/* Desktop: colecção */}
                <div className="hidden md:block md:col-span-2 text-sm text-foreground">
                  {p.collection}
                </div>

                {/* Desktop: preço */}
                <div className="hidden md:block md:col-span-2 text-sm text-foreground">
                  <span className="text-[color:var(--gold)]">{p.currency}</span>{" "}
                  {new Intl.NumberFormat("pt-PT").format(p.price)}
                </div>

                {/* Estado */}
                <div className="mt-4 md:mt-0 md:col-span-2 text-sm text-foreground">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-[10px] tracking-[0.22em] backdrop-blur",
                      p.status === "active"
                        ? "border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 text-foreground"
                        : p.status === "draft"
                          ? "border-border bg-black/20 text-muted-foreground"
                          : "border-border bg-black/30 text-muted-foreground",
                    ].join(" ")}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </div>

                {/* Acções */}
                <div className="mt-5 md:mt-0 md:col-span-2 md:text-right">
                  {/* no mobile, alinha à esquerda e permite quebrar */}
                  <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 md:justify-end">
                    <ProductRowActions
                      id={p.id}
                      slug={p.slug}
                      status={p.status}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
