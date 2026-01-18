// app/admin/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminProductEditorClient } from "@/components/admin/admin-product-editor-client";


export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error: pErr } = await supabaseAdmin
    .from("products")
    .select("id,slug,name,collection,price,currency,badge,description,highlights,status,created_at,updated_at")
    .eq("id", id)
    .single();

  if (pErr || !product) return notFound();

  const { data: images, error: iErr } = await supabaseAdmin
    .from("product_images")
    .select("id,product_id,url,path,sort_order,created_at")
    .eq("product_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (iErr) throw new Error(iErr.message);

  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <AdminProductEditorClient product={product} initialImages={images ?? []} />
      </div>
      <SiteFooter />
    </main>
  );
}
