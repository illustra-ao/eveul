import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// opcional: um token simples para não ficar público
const TOKEN = process.env.KEEPALIVE_TOKEN;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (TOKEN && token !== TOKEN) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  // query bem leve (ajusta para uma tabela que exista e seja pequena)
  const { error } = await supabaseAdmin
    .from("products")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}
