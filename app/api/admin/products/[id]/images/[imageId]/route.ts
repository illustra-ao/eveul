// app/api/admin/products/[id]/images/[imageId]/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteProductImage } from "@/lib/storage/product-images";

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
  const picked = images.find((image) => image.id === primaryImageId);

  if (!picked) {
    throw new Error("Imagem não encontrada para este produto.");
  }

  const reordered = [picked, ...images.filter((image) => image.id !== primaryImageId)].map(
    (image, index) => ({ id: image.id, sort_order: index }),
  );

  const results = await Promise.all(
    reordered.map((image) =>
      supabaseAdmin
        .from("product_images")
        .update({ sort_order: image.sort_order })
        .eq("id", image.id),
    ),
  );

  const firstError = results.find((result) => result.error)?.error;
  if (firstError) throw new Error(firstError.message);

  return await listImages(productId);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: productId, imageId } = await ctx.params;
    const body = (await req.json()) as {
      makePrimary?: boolean;
      productId?: string;
    };

    if (!body.makePrimary) {
      return NextResponse.json(
        { ok: false, message: "Pedido inválido." },
        { status: 400 }
      );
    }

    if (body.productId && body.productId !== productId) {
      return NextResponse.json(
        { ok: false, message: "Produto não corresponde." },
        { status: 400 }
      );
    }

    const images = await reorderImages(productId, imageId);
    return NextResponse.json({ ok: true, images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json(
      { ok: false, message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: productId, imageId } = await ctx.params;

    // buscar imagem
    const { data: img, error: gErr } = await supabaseAdmin
      .from("product_images")
      .select("id,product_id,path")
      .eq("id", imageId)
      .eq("product_id", productId)
      .single<{ id: string; product_id: string; path: string }>();

    if (gErr || !img) {
      return NextResponse.json(
        { ok: false, message: "Imagem não encontrada." },
        { status: 404 }
      );
    }

    // remover do storage
    await deleteProductImage(img.path);

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

    const remaining = await listImages(productId);
    if (remaining.length > 0) {
      const results = await Promise.all(
        remaining.map((image, index) =>
          supabaseAdmin
            .from("product_images")
            .update({ sort_order: index })
            .eq("id", image.id),
        ),
      );

      const firstError = results.find((result) => result.error)?.error;
      if (firstError) throw new Error(firstError.message);
    }

    const images = await listImages(productId);
    return NextResponse.json({
      ok: true,
      images,
      primaryId: images[0]?.id ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json(
      { ok: false, message },
      { status: 500 }
    );
  }
}
