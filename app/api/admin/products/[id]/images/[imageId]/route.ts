// app/api/admin/products/images/[imageId]/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "product-images";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await ctx.params;
    const body = (await req.json()) as {
      makePrimary?: boolean;
      productId?: string;
    };

    if (!body.makePrimary || !body.productId) {
      return NextResponse.json(
        { ok: false, message: "Pedido inválido." },
        { status: 400 }
      );
    }

    // buscar imagem alvo
    const { data: target, error: tErr } = await supabaseAdmin
      .from("product_images")
      .select("id,product_id,sort_order")
      .eq("id", imageId)
      .single<{ id: string; product_id: string; sort_order: number }>();

    if (tErr || !target) {
      return NextResponse.json(
        { ok: false, message: "Imagem não encontrada." },
        { status: 404 }
      );
    }

    if (target.product_id !== body.productId) {
      return NextResponse.json(
        { ok: false, message: "Produto não corresponde." },
        { status: 400 }
      );
    }

    // imagens do produto
    const { data: imgs, error: iErr } = await supabaseAdmin
      .from("product_images")
      .select("id,sort_order")
      .eq("product_id", body.productId)
      .order("sort_order", { ascending: true })
      .returns<{ id: string; sort_order: number }[]>();

    if (iErr) {
      return NextResponse.json(
        { ok: false, message: iErr.message },
        { status: 500 }
      );
    }

    const list = imgs ?? [];
    const picked = list.find((x) => x.id === imageId);
    if (!picked) {
      return NextResponse.json(
        { ok: false, message: "Imagem não pertence ao produto." },
        { status: 400 }
      );
    }

    // reorder: picked vira 0; restantes mantêm ordem relativa começando em 1
    const reordered = [
      picked,
      ...list.filter((x) => x.id !== imageId),
    ].map((x, idx) => ({ id: x.id, sort_order: idx }));

    // update em batch (sequencial simples)
    for (const row of reordered) {
      const { error } = await supabaseAdmin
        .from("product_images")
        .update({ sort_order: row.sort_order })
        .eq("id", row.id);

      if (error) {
        return NextResponse.json(
          { ok: false, message: error.message },
          { status: 500 }
        );
      }
    }

    // devolve lista completa
    const { data: updated, error: uErr } = await supabaseAdmin
      .from("product_images")
      .select("id,product_id,url,path,sort_order,created_at")
      .eq("product_id", body.productId)
      .order("sort_order", { ascending: true });

    if (uErr) {
      return NextResponse.json(
        { ok: false, message: uErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, images: updated ?? [] });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Erro inesperado." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await ctx.params;

    // buscar imagem
    const { data: img, error: gErr } = await supabaseAdmin
      .from("product_images")
      .select("id,product_id,path")
      .eq("id", imageId)
      .single<{ id: string; product_id: string; path: string }>();

    if (gErr || !img) {
      return NextResponse.json(
        { ok: false, message: "Imagem não encontrada." },
        { status: 404 }
      );
    }

    // remover do storage
    if (img.path) {
      await supabaseAdmin.storage.from(BUCKET).remove([img.path]);
    }

    // remover da tabela
    const { error: dErr } = await supabaseAdmin
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (dErr) {
      return NextResponse.json(
        { ok: false, message: dErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Erro inesperado." },
      { status: 500 }
    );
  }
}
