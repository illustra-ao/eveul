// app/watches/[slug]/page.tsx
import { notFound } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { supabaseClient } from "@/lib/supabase/client";
import { WatchProductPage } from "@/components/watches/watch-product-page";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  collection: "Signature" | "Limited" | "Classic";
  price: number;
  currency: string;
  badge: "BEST SELLER" | "LIMITED" | "NEW" | null;
  description: string | null;
  highlights: string[];
  status: "active" | "draft" | "archived";
};

type ImageRow = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
};

export default async function WatchSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1) produto pelo slug (apenas active)
  const { data: product, error: pErr } = await supabaseClient
    .from("products")
    .select(
      "id,slug,name,collection,price,currency,badge,description,highlights,status",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single<ProductRow>();

  if (pErr || !product) return notFound();

  // 2) imagens ordenadas
  const { data: images, error: iErr } = await supabaseClient
    .from("product_images")
    .select("id,product_id,url,sort_order")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true })
    .returns<ImageRow[]>();

  if (iErr) {
    // se falhar imagens, ainda assim renderiza o produto
    // mas podes lançar erro se preferires
  }

  // 3) related (mesma colecção, exclui o produto actual)
  const { data: related } = await supabaseClient
    .from("products")
    .select(
      "id,slug,name,collection,price,currency,badge,description,highlights,status",
    )
    .eq("status", "active")
    .eq("collection", product.collection)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(4)
    .returns<ProductRow[]>();

  const vmProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    collection: product.collection,
    price: product.price,
    currency: product.currency,
    badge: product.badge ?? undefined,
    images: (images ?? []).map((x) => x.url),
    description: product.description ?? "",
    highlights: product.highlights ?? [],
    specs: [
      { k: "Garantia", v: "12 meses" },
      { k: "Envio", v: "Luanda 24–72h" },
    ],
    stockLabel: "Disponível",
  };

  const vmRelated =
    (related ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      collection: p.collection,
      price: p.price,
      currency: p.currency,
      badge: p.badge ?? undefined,
      images: [], // o componente RelatedCard usa images[0]; podes carregar imagens também se quiseres
      description: p.description ?? "",
      highlights: p.highlights ?? [],
      specs: [],
    })) ?? [];

  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <WatchProductPage product={vmProduct} related={vmRelated} />
      </div>
      <SiteFooter />
    </main>
  );
}
