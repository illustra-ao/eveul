import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { defaultHeroCarouselSlides } from "@/lib/hero-carousel";
import {
  deleteStoredImage,
  uploadCarouselImage,
  validateProductImageFile,
} from "@/lib/storage/product-images";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ slideId: string }> },
) {
  try {
    const { slideId } = await ctx.params;
    const slideIndex = defaultHeroCarouselSlides.findIndex(
      (slide) => slide.id === slideId,
    );

    if (slideIndex < 0) {
      return NextResponse.json(
        { ok: false, message: "Slide inválido." },
        { status: 404 },
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Ficheiro inválido." },
        { status: 400 },
      );
    }

    const validationError = validateProductImageFile(file);
    if (validationError) {
      return NextResponse.json(
        { ok: false, message: validationError },
        { status: 400 },
      );
    }

    const { data: previous } = await supabaseAdmin
      .from("hero_carousel_slides")
      .select("image_path")
      .eq("id", slideId)
      .maybeSingle<{ image_path: string | null }>();

    const storedImage = await uploadCarouselImage({ file, slideId });

    const { data: slide, error } = await supabaseAdmin
      .from("hero_carousel_slides")
      .upsert(
        {
          id: slideId,
          image_url: storedImage.url,
          image_path: storedImage.path,
          sort_order: slideIndex,
        },
        { onConflict: "id" },
      )
      .select("id,image_url,image_path,sort_order,updated_at")
      .single();

    if (error) {
      await deleteStoredImage(storedImage.path);
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      );
    }

    if (previous?.image_path && previous.image_path !== storedImage.path) {
      await deleteStoredImage(previous.image_path).catch(() => undefined);
    }

    return NextResponse.json({ ok: true, slide });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erro inesperado no upload.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
