// app/api/admin/products/images/[imageId]/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const body = await req.json();

    const makePrimary = Boolean(body.makePrimary);
    const productId = String(body.productId ?? "");

    if (!makePrimary || !productId) {
      return NextResponse.json({ ok: false, message: "Pedido inválido." }, { status: 400 });
    }

    // 1) colocar a imagem escolhida com sort_order = 0
    const { error: u1 } = await supabaseAdmin
      .from("product_images")
      .update({ sort_order: 0 })
      .eq("id", imageId)
      .eq("product_id", productId);

    if (u1) {
      return NextResponse.json({ ok: false, message: u1.message }, { status: 500 });
    }

    // 2) empurrar as restantes para baixo (sort_order >=0) excepto a escolhida
    // (simples e suficiente para MVP)
    const { data: others, error: e2 } = await supabaseAdmin
      .from("product_images")
      .select("id,sort_order")
      .eq("product_id", productId)
      .neq("id", imageId)
      .order("sort_order", { ascending: true });

    if (e2) {
      return NextResponse.json({ ok: false, message: e2.message }, { status: 500 });
    }

    // reatribuir 1..N
    const updates =
      (others ?? []).map((img, idx) => ({
        id: img.id,
        sort_order: idx + 1,
      })) ?? [];

    if (updates.length) {
      const { error: e3 } = await supabaseAdmin.from("product_images").upsert(updates);
      if (e3) {
        return NextResponse.json({ ok: false, message: e3.message }, { status: 500 });
      }
    }

    const { data: images, error: e4 } = await supabaseAdmin
      .from("product_images")
      .select("id,product_id,url,path,sort_order,created_at")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (e4) {
      return NextResponse.json({ ok: false, message: e4.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, images });
  } catch {
    return NextResponse.json({ ok: false, message: "Erro inesperado." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;

    // buscar path + product_id antes de apagar
    const { data: img, error: rErr } = await supabaseAdmin
      .from("product_images")
      .select("id,product_id,path")
      .eq("id", imageId)
      .single();

    if (rErr || !img) {
      return NextResponse.json({ ok: false, message: "Imagem não encontrada." }, { status: 404 });
    }

    // 1) apagar no storage
    const { error: sErr } = await supabaseAdmin.storage.from("product-images").remove([img.path]);
    if (sErr) {
      return NextResponse.json({ ok: false, message: sErr.message }, { status: 500 });
    }

    // 2) apagar na DB
    const { error: dErr } = await supabaseAdmin.from("product_images").delete().eq("id", imageId);
    if (dErr) {
      return NextResponse.json({ ok: false, message: dErr.message }, { status: 500 });
    }

    // 3) (opcional) reordenar restantes para manter 0..N
    const { data: remaining, error: e2 } = await supabaseAdmin
      .from("product_images")
      .select("id")
      .eq("product_id", img.product_id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!e2 && remaining?.length) {
      const updates = remaining.map((x, idx) => ({ id: x.id, sort_order: idx }));
      await supabaseAdmin.from("product_images").upsert(updates);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Erro inesperado." }, { status: 500 });
  }
}
