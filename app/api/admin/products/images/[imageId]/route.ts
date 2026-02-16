// app/api/admin/products/images/[imageId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  path: string;
  sort_order: number;
  created_at?: string;
};

async function listImages(productId: string) {
  const { data, error } = await supabaseAdmin
    .from("product_images")
    .select("id,product_id,url,path,sort_order,created_at")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProductImageRow[];
}

async function reorderImages(productId: string, primaryImageId: string) {
  const images = await listImages(productId);

  const picked = images.find((x) => x.id === primaryImageId);
  if (!picked) throw new Error("Imagem não encontrada para este produto.");

  const reordered = [picked, ...images.filter((x) => x.id !== primaryImageId)].map(
    (img, idx) => ({ id: img.id, sort_order: idx }),
  );

  // Updates explícitos (evita armadilhas de upsert parcial)
  const results = await Promise.all(
    reordered.map((u) =>
      supabaseAdmin.from("product_images").update({ sort_order: u.sort_order }).eq("id", u.id),
    ),
  );

  const firstErr = results.find((r) => r.error)?.error;
  if (firstErr) throw new Error(firstErr.message);

  return await listImages(productId);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
) {
  try {
    const { imageId } = await params;

    const body = (await req.json().catch(() => null)) as
      | { makePrimary?: boolean; productId?: string }
      | null;

    const makePrimary = Boolean(body?.makePrimary);
    const productId = String(body?.productId ?? "").trim();

    if (!makePrimary || !productId) {
      return NextResponse.json(
        { ok: false, message: "Pedido inválido." },
        { status: 400 },
      );
    }

    const images = await reorderImages(productId, imageId);

    return NextResponse.json({ ok: true, images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
) {
  try {
    const { imageId } = await params;

    // 0) buscar dados da imagem
    const { data: img, error: rErr } = await supabaseAdmin
      .from("product_images")
      .select("id,product_id,path,sort_order")
      .eq("id", imageId)
      .single();

    if (rErr || !img) {
      return NextResponse.json(
        { ok: false, message: "Imagem não encontrada." },
        { status: 404 },
      );
    }

    const productId = String(img.product_id);

    // 1) apagar no storage
    const { error: sErr } = await supabaseAdmin.storage
      .from("product-images")
      .remove([String(img.path)]);

    if (sErr) {
      return NextResponse.json({ ok: false, message: sErr.message }, { status: 500 });
    }

    // 2) apagar na DB
    const { error: dErr } = await supabaseAdmin
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (dErr) {
      return NextResponse.json({ ok: false, message: dErr.message }, { status: 500 });
    }

    // 3) reordenar restantes (0..N) e garantir principal = o primeiro da lista
    const remaining = await listImages(productId);

    if (remaining.length > 0) {
      // mantém o primeiro como principal
      const primaryId = remaining[0].id;

      const reordered = remaining.map((x, idx) => ({
        id: x.id,
        sort_order: idx,
      }));

      const results = await Promise.all(
        reordered.map((u) =>
          supabaseAdmin.from("product_images").update({ sort_order: u.sort_order }).eq("id", u.id),
        ),
      );

      const firstErr = results.find((r) => r.error)?.error;
      if (firstErr) {
        return NextResponse.json(
          { ok: false, message: firstErr.message },
          { status: 500 },
        );
      }

      const images = await listImages(productId);
      return NextResponse.json({ ok: true, images, primaryId });
    }

    return NextResponse.json({ ok: true, images: [], primaryId: null });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
