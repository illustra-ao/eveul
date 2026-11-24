import Link from "next/link";
import { AdminCarouselEditorClient } from "@/components/admin/admin-carousel-editor-client";
import { AdminShell } from "@/components/admin/admin-shell";
import { SetupNotice } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { defaultHeroCarouselSlides } from "@/lib/hero-carousel";

export const dynamic = "force-dynamic";

type CarouselRow = {
  id: string;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  updated_at: string | null;
};

function SetupState({ message }: { message: string }) {
  return (
    <AdminShell active="carousel" title="Carrossel">
      <SetupNotice
        title="Carrossel ainda sem tabela"
        body="Executa novamente supabase/schema.sql no SQL Editor do Supabase para criar hero_carousel_slides."
        message={message}
      >
        <Button asChild variant="outline">
          <Link href="/admin/products">Voltar a produtos</Link>
        </Button>
      </SetupNotice>
    </AdminShell>
  );
}

export default async function AdminCarouselPage() {
  let rows: CarouselRow[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("hero_carousel_slides")
      .select("id,image_url,image_path,sort_order,updated_at")
      .order("sort_order", { ascending: true })
      .returns<CarouselRow[]>();

    if (error) throw new Error(error.message);
    rows = data ?? [];
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao ligar ao Supabase.";
    return <SetupState message={message} />;
  }

  const rowById = new Map(rows.map((row) => [row.id, row]));
  const slides = defaultHeroCarouselSlides.map((slide) => {
    const row = rowById.get(slide.id);
    return {
      ...slide,
      image: row?.image_url ?? slide.image,
      imagePath: row?.image_path,
      updatedAt: row?.updated_at,
    };
  });

  return (
    <AdminShell
      active="carousel"
      title="Carrossel"
      description="Imagens dos slides principais da página inicial."
      actions={
        <Button asChild variant="outline">
          <a href="/" target="_blank" rel="noreferrer">Ver página inicial</a>
        </Button>
      }
    >
      <AdminCarouselEditorClient initialSlides={slides} />
    </AdminShell>
  );
}
