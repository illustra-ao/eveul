import { supabaseClient } from "@/lib/supabase/client";
import { WatchesCatalogClient } from "./watches-catalog.client";

export type ProductRow = {
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

export type ProductCardVM = {
  id: string;
  slug: string;
  name: string;
  collection: ProductRow["collection"];
  price: number;
  currency: string;
  badge?: ProductRow["badge"] | undefined;
  image?: string | undefined;
};

export async function WatchesCatalogSupabase() {
  const { data: products, error } = await supabaseClient
    .from("products")
    .select("id,slug,name,collection,price,currency,badge,status")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    // em produção: renderizar fallback elegante
    throw new Error(error.message);
  }

  const ids = (products ?? []).map((p) => p.id);

  const { data: images } = await supabaseClient
    .from("product_images")
    .select("product_id,url,sort_order")
    .in("product_id", ids)
    .order("sort_order", { ascending: true });

  const firstImageByProduct = new Map<string, string>();
  (images ?? []).forEach((img) => {
    if (!firstImageByProduct.has(img.product_id))
      firstImageByProduct.set(img.product_id, img.url);
  });

  const cards: ProductCardVM[] =
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
