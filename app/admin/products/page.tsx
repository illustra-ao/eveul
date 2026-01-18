import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

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
            <div className="grid grid-cols-12 gap-4 border-b border-border px-5 py-3 text-[11px] tracking-[0.22em] text-muted-foreground">
              <div className="col-span-4">NOME</div>
              <div className="col-span-2">COLECÇÃO</div>
              <div className="col-span-2">PREÇO</div>
              <div className="col-span-2">ESTADO</div>
              <div className="col-span-2 text-right">ACÇÕES</div>
            </div>

            {(data ?? []).map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border/60 last:border-b-0"
              >
                <div className="col-span-4">
                  <div className="text-sm text-foreground">{p.name}</div>
                  <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                    {p.slug}
                  </div>
                </div>
                <div className="col-span-2 text-sm text-foreground">
                  {p.collection}
                </div>
                <div className="col-span-2 text-sm text-foreground">
                  <span className="text-[color:var(--gold)]">{p.currency}</span>{" "}
                  {new Intl.NumberFormat("pt-PT").format(p.price)}
                </div>
                <div className="col-span-2 text-sm text-foreground">
                  {p.status}
                </div>
                <div className="col-span-2 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs tracking-[0.22em] text-muted-foreground hover:text-foreground"
                  >
                    EDITAR →
                  </Link>
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
