import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function getAdminSetupCopy(message: string) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("could not find the table") ||
    lowerMessage.includes("schema cache") ||
    lowerMessage.includes("relation") && lowerMessage.includes("does not exist")
  ) {
    return {
      title: "Base de dados ainda sem schema.",
      body:
        "O Storage já pode estar criado, mas a área de produtos também precisa das tabelas `products`, `product_images` e `newsletter_subscribers` na base de dados. Execute `supabase/schema.sql` no SQL Editor do Supabase.",
    };
  }

  return {
    title: "Supabase ainda não configurado.",
    body:
      "O login está activo, mas a área de produtos precisa das variáveis `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`) e `SUPABASE_SECRET_KEY` (ou `SUPABASE_SERVICE_ROLE_KEY`) no ambiente.",
  };
}

function AdminSetupState({ message }: { message: string }) {
  const copy = getAdminSetupCopy(message);

  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-4xl border border-border bg-card/15 p-8 backdrop-blur md:p-10">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              ADMIN
            </div>
            <h1 className="mt-4 font-[var(--font-display)] text-4xl tracking-tight">
              {copy.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {copy.body}
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-black/15 p-4 text-sm text-muted-foreground">
              {message}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-border bg-card/10 px-5 py-3 text-xs tracking-[0.18em] text-foreground backdrop-blur hover:bg-card/20"
              >
                VOLTAR À LOJA
              </Link>
              <Link
                href="/admin/logout"
                className="rounded-full bg-primary px-5 py-3 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90"
              >
                SAIR
              </Link>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

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
  let data:
    | {
        id: string;
        slug: string;
        name: string;
        collection: string;
        price: number;
        currency: string;
        status: "active" | "draft" | "archived";
        created_at: string;
        image?: string;
      }[]
    | null = null;

  try {
    const result = await supabaseAdmin
      .from("products")
      .select("id,slug,name,collection,price,currency,status,created_at")
      .order("created_at", { ascending: false });

    if (result.error) throw new Error(result.error.message);

    const products = result.data ?? [];
    const productIds = products.map((product) => product.id);
    const firstImageByProduct = new Map<string, string>();

    if (productIds.length > 0) {
      const imagesResult = await supabaseAdmin
        .from("product_images")
        .select("product_id,url,sort_order,created_at")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (imagesResult.error) throw new Error(imagesResult.error.message);

      for (const image of imagesResult.data ?? []) {
        if (!firstImageByProduct.has(image.product_id)) {
          firstImageByProduct.set(image.product_id, image.url);
        }
      }
    }

    data = products.map((product) => ({
      ...product,
      image: firstImageByProduct.get(product.id),
    }));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao ligar ao Supabase.";
    return <AdminSetupState message={message} />;
  }

  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/products/new"
                className="rounded-full bg-primary px-5 py-3 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90"
              >
                NOVO PRODUTO
              </Link>
              <Link
                href="/admin/logout"
                className="rounded-full border border-border bg-card/10 px-5 py-3 text-xs tracking-[0.18em] text-muted-foreground backdrop-blur hover:bg-card/20 hover:text-foreground"
              >
                SAIR
              </Link>
            </div>
          </div>

          <AdminTabs active="products" />

          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card/15 backdrop-blur">
            {/* Header só em md+ */}
            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border px-5 py-3 text-[11px] tracking-[0.22em] text-muted-foreground">
              <div className="col-span-4">PRODUTO</div>
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
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-black/25">
                      <Image
                        src={p.image ?? siteConfig.fallbackProductImage}
                        alt={p.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm text-foreground">
                        {p.name}
                      </div>
                      <div className="mt-1 break-all text-[11px] tracking-[0.22em] text-muted-foreground">
                        {p.slug}
                      </div>
                    </div>
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
