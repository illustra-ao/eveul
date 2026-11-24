// app/admin/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminProductEditorClient } from "@/components/admin/admin-product-editor-client";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error: pErr } = await supabaseAdmin
    .from("products")
    .select("id,slug,name,collection,price,currency,badge,description,highlights,status,category,availability,created_at,updated_at")
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
    <AdminShell active="products">
      <AdminProductEditorClient product={product} initialImages={images ?? []} />
    </AdminShell>
  );
}
