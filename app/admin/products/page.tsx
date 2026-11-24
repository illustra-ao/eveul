import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { SetupNotice, StatusBadge } from "@/components/admin/admin-ui";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Button } from "@/components/ui/button";
import { formatKz, siteConfig } from "@/lib/site-config";

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
    <AdminShell active="products" title="Produtos">
      <SetupNotice title={copy.title} body={copy.body} message={message}>
        <Button asChild variant="outline">
          <Link href="/">Voltar à loja</Link>
        </Button>
      </SetupNotice>
    </AdminShell>
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

  const products = data ?? [];

  return (
    <AdminShell
      active="products"
      title="Produtos"
      description={`${products.length} ${products.length === 1 ? "produto" : "produtos"} · criar, editar, publicar e gerir imagens.`}
      actions={
        <Button asChild>
          <Link href="/admin/products/new">Novo produto</Link>
        </Button>
      }
    >
      {products.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-10 text-center">
          <p className="font-medium">Ainda não há produtos.</p>
          <p className="mt-1 text-muted-foreground">Cria o primeiro e depois adiciona as imagens no editor.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          {/* Cabeçalho só em md+ */}
          <div className="hidden grid-cols-12 gap-4 border-b border-border px-5 py-3 text-meta font-medium text-muted-foreground md:grid">
            <div className="col-span-5">Produto</div>
            <div className="col-span-2">Colecção</div>
            <div className="col-span-2">Preço</div>
            <div className="col-span-1">Estado</div>
            <div className="col-span-2 text-right">Acções</div>
          </div>

          <ul>
            {products.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-3 border-b border-border p-4 last:border-b-0 md:grid-cols-12 md:items-center md:px-5 md:py-3"
              >
                <div className="relative size-16 overflow-hidden rounded-sm bg-sunken md:hidden">
                  <Image src={p.image ?? siteConfig.fallbackProductImage} alt="" fill sizes="64px" className="object-cover" />
                </div>

                <div className="min-w-0 md:col-span-5 md:flex md:items-center md:gap-4">
                  <div className="relative hidden size-12 shrink-0 overflow-hidden rounded-sm bg-sunken md:block">
                    <Image src={p.image ?? siteConfig.fallbackProductImage} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/admin/products/${p.id}`} className="block truncate font-medium hover:underline">
                      {p.name}
                    </Link>
                    <p className="truncate text-meta text-muted-foreground">/{p.slug}</p>
                    <p className="mt-1 text-meta text-muted-foreground md:hidden">
                      {p.collection} · <span className="tabular text-foreground">{formatKz(p.price)}</span>
                    </p>
                  </div>
                </div>

                <div className="hidden text-sm md:col-span-2 md:block">{p.collection}</div>
                <div className="tabular hidden text-sm md:col-span-2 md:block">{formatKz(p.price)}</div>

                <div className="col-start-2 md:col-span-1 md:col-start-auto">
                  <StatusBadge status={p.status} />
                </div>

                <div className="col-span-2 md:col-span-2">
                  <ProductRowActions id={p.id} slug={p.slug} status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
