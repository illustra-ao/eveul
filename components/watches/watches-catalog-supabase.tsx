// components/watches/watches-catalog-supabase.tsx
import { supabaseAdmin } from "@/lib/supabase/admin";
import { WatchesCatalogClient } from "./watches-catalog.client";

export async function WatchesCatalogSupabase() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id,slug,name,collection,price,currency,badge,status,created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const ids = (products ?? []).map((p) => p.id);

  // Evita .in([]) quando não há produtos
  let images: { product_id: string; url: string; sort_order: number }[] = [];
  if (ids.length > 0) {
    const res = await supabaseAdmin
      .from("product_images")
      .select("product_id,url,sort_order")
      .in("product_id", ids)
      .order("sort_order", { ascending: true });

    if (res.error) throw new Error(res.error.message);
    images = res.data ?? [];
  }

  const firstImageByProduct = new Map<string, string>();
  for (const img of images) {
    if (!firstImageByProduct.has(img.product_id)) {
      firstImageByProduct.set(img.product_id, img.url);
    }
  }

  const cards =
    (products ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      collection: p.collection,
      price: p.price,
      currency: p.currency,
      badge: p.badge ?? undefined,
      image: firstImageByProduct.get(p.id),
    })) ?? [];

  return <WatchesCatalogClient initialProducts={cards} />;
}
