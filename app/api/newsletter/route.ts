// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const emailRaw = String(body?.email ?? "").trim();
    const email = emailRaw.toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, status: "invalid", message: "Email inválido." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email, source: "website" });

    if (error) {
      // Duplicado -> não é erro para o utilizador
      if (error.code === "23505") {
        return NextResponse.json({
          ok: true,
          status: "exists",
          message: "Este email já está inscrito.",
        });
      }

      console.error("Supabase error:", error);
      return NextResponse.json(
        { ok: false, status: "failed", message: "Não foi possível subscrever." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "created",
      message: "Subscrição confirmada.",
    });
  } catch (e) {
    console.error("API fatal error:", e);
    return NextResponse.json(
      { ok: false, status: "failed", message: "Erro inesperado." },
      { status: 500 }
    );
  }
}
