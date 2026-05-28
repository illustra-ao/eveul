// app/watches/[slug]/page.tsx
import { notFound } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { supabaseClient } from "@/lib/supabase/client";
import { WatchProductPage } from "@/components/watches/watch-product-page";
import {
  getFallbackProductBySlug,
  getFallbackRelatedProducts,
  type FallbackProduct,
} from "@/lib/products";

export const dynamic = "force-dynamic";

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

function toWatchProduct(product: FallbackProduct) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    collection: product.collection,
    price: product.price,
    currency: product.currency,
    badge: product.badge,
    images: product.images,
    description: product.description,
    highlights: product.highlights,
    specs: product.specs,
    stockLabel: "Disponivel",
  };
}

function renderProductPage(
  product: Parameters<typeof WatchProductPage>[0]["product"],
  related: Parameters<typeof WatchProductPage>[0]["related"],
) {
  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <WatchProductPage product={product} related={related} />
      </div>
      <SiteFooter />
    </main>
  );
}

function renderFallbackProduct(slug: string) {
  const fallback = getFallbackProductBySlug(slug);
  if (!fallback) return null;

  return renderProductPage(
    toWatchProduct(fallback),
    getFallbackRelatedProducts(fallback).map(toWatchProduct),
  );
}

export default async function WatchSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    // 1) produto pelo slug (apenas active)
    const { data: product, error: pErr } = await supabaseClient
      .from("products")
      .select(
        "id,slug,name,collection,price,currency,badge,description,highlights,status",
      )
      .eq("slug", slug)
      .eq("status", "active")
      .single<ProductRow>();

    if (pErr || !product) {
      const fallback = renderFallbackProduct(slug);
      return fallback ?? notFound();
    }

    // 2) imagens ordenadas
    const { data: images, error: iErr } = await supabaseClient
      .from("product_images")
      .select("id,product_id,url,sort_order")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true })
      .returns<ImageRow[]>();

    const productImages = iErr ? [] : (images ?? []).map((x) => x.url);

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

    const relatedIds = (related ?? []).map((p) => p.id);
    const relatedImagesByProduct = new Map<string, string[]>();

    if (relatedIds.length > 0) {
      const { data: relatedImages } = await supabaseClient
        .from("product_images")
        .select("product_id,url,sort_order")
        .in("product_id", relatedIds)
        .order("sort_order", { ascending: true })
        .returns<Omit<ImageRow, "id">[]>();

      for (const image of relatedImages ?? []) {
        const list = relatedImagesByProduct.get(image.product_id) ?? [];
        list.push(image.url);
        relatedImagesByProduct.set(image.product_id, list);
      }
    }

    const vmProduct = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      collection: product.collection,
      price: product.price,
      currency: product.currency,
      badge: product.badge ?? undefined,
      images: productImages,
      description: product.description ?? "",
      highlights: Array.isArray(product.highlights) ? product.highlights : [],
      specs: [
        { k: "Garantia", v: "12 meses" },
        { k: "Envio", v: "Luanda 24-72h" },
      ],
      stockLabel: "Disponivel",
    };

    const vmRelated = (related ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      collection: p.collection,
      price: p.price,
      currency: p.currency,
      badge: p.badge ?? undefined,
      images: relatedImagesByProduct.get(p.id) ?? [],
      description: p.description ?? "",
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      specs: [],
    }));

    return renderProductPage(vmProduct, vmRelated);
  } catch {
    const fallback = renderFallbackProduct(slug);
    return fallback ?? notFound();
  }
}
