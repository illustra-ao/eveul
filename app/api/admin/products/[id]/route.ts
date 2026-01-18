// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const payload = {
      name: body.name,
      slug: body.slug,
      collection: body.collection,
      price: body.price,
      currency: body.currency,
      badge: body.badge,
      status: body.status,
      description: body.description,
      highlights: body.highlights,
    };

    const { error } = await supabaseAdmin.from("products").update(payload).eq("id", id);

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Erro inesperado." }, { status: 500 });
  }
}
