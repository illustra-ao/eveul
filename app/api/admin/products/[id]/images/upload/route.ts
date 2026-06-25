// app/api/admin/products/[id]/images/upload/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  deleteProductImage,
  uploadProductImage,
  validateProductImageFile,
} from "@/lib/storage/product-images";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await ctx.params;
    const form = await req.formData();

    const file = form.get("file");
    const slug = String(form.get("slug") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Ficheiro inválido." },
        { status: 400 }
      );
    }

    const validationError = validateProductImageFile(file);
    if (validationError) {
      return NextResponse.json(
        { ok: false, message: validationError },
        { status: 400 }
      );
    }

    const storedImage = await uploadProductImage({ file, productId, slug });

    // sort_order: último + 1
    const { data: last } = await supabaseAdmin
      .from("product_images")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle<{ sort_order: number }>();

    const nextOrder = (last?.sort_order ?? -1) + 1;

    // insert image row
    const { data: image, error: insErr } = await supabaseAdmin
      .from("product_images")
      .insert({
        product_id: productId,
        url: storedImage.url,
        path: storedImage.path,
        sort_order: nextOrder,
      })
      .select("id,product_id,url,path,sort_order,created_at")
      .single();

    if (insErr) {
      // rollback file se insert falhar
      await deleteProductImage(storedImage.path);
      return NextResponse.json(
        { ok: false, message: insErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, image });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Erro inesperado no upload." },
      { status: 500 }
    );
  }
}
