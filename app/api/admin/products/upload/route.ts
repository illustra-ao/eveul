import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const productId = String(form.get("productId") ?? "");
    const slug = String(form.get("slug") ?? "");

    if (!file || !productId || !slug) {
      return NextResponse.json({ ok: false, message: "Dados em falta." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${slug}/${crypto.randomUUID()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: upErr } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, arrayBuffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (upErr) {
      return NextResponse.json({ ok: false, message: upErr.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from("product-images").getPublicUrl(path);
    const url = data.publicUrl;

    const { error: insErr } = await supabaseAdmin
      .from("product_images")
      .insert({ product_id: productId, path, url, sort_order: 0 });

    if (insErr) {
      return NextResponse.json({ ok: false, message: insErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, url, path });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Erro inesperado." }, { status: 500 });
  }
}
