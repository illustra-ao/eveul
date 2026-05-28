// components/home/best-sellers.tsx
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fallbackProducts, getPrimaryImage } from "@/lib/products";
import { BestSellersClient, type ProductCardVM } from "./best-sellers-client";

type Badge = "BEST SELLER" | "LIMITED" | "NEW" | null;
type Collection = "Signature" | "Limited" | "Classic";
type Status = "active" | "draft" | "archived";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  collection: Collection;
  price: number;
  currency: string;
  badge: Badge;
  status: Status;
  created_at: string;
};

type ProductImageRow = {
  product_id: string;
  url: string;
  sort_order: number;
  created_at?: string;
};

export async function BestSellers() {
  try {
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id,slug,name,collection,price,currency,badge,status,created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(8);

    if (pErr) throw new Error(pErr.message);

    const ids = (products ?? []).map((p) => p.id);

    let images: ProductImageRow[] = [];
    if (ids.length > 0) {
      const { data, error: iErr } = await supabaseAdmin
        .from("product_images")
        .select("product_id,url,sort_order,created_at")
        .in("product_id", ids)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!iErr) images = data ?? [];
    }

    const firstImageByProduct = new Map<string, string>();
    const secondImageByProduct = new Map<string, string>();

    for (const img of images) {
      if (!firstImageByProduct.has(img.product_id)) {
        firstImageByProduct.set(img.product_id, img.url);
      } else if (!secondImageByProduct.has(img.product_id)) {
        secondImageByProduct.set(img.product_id, img.url);
      }
    }

    const cards: ProductCardVM[] = (products ?? []).map((p: ProductRow) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      collection: p.collection,
      price: p.price,
      currency: p.currency || "Kz",
      badge: (p.badge ?? undefined) as Exclude<Badge, null> | undefined,
      image: firstImageByProduct.get(p.id) ?? getPrimaryImage(),
      imageHover: secondImageByProduct.get(p.id) ?? undefined,
    }));

    return <BestSellersClient products={cards.slice(0, 4)} />;
  } catch {
    const cards: ProductCardVM[] = fallbackProducts.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      collection: product.collection,
      price: product.price,
      currency: product.currency,
      badge: product.badge,
      image: getPrimaryImage(product.images),
      imageHover: product.images[1],
    }));

    return <BestSellersClient products={cards.slice(0, 4)} />;
  }
}
