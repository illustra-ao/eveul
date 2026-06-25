import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { AdminCarouselEditorClient } from "@/components/admin/admin-carousel-editor-client";
import { AdminTabs } from "@/components/admin/admin-tabs";
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
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-4xl border border-border bg-card/15 p-8 backdrop-blur md:p-10">
            <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
              ADMIN
            </div>
            <h1 className="mt-4 font-[var(--font-display)] text-4xl tracking-tight">
              Carrossel ainda sem tabela.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Execute novamente `supabase/schema.sql` no SQL Editor do Supabase
              para criar `hero_carousel_slides`.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-black/15 p-4 text-sm text-muted-foreground">
              {message}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin/products"
                className="rounded-full border border-border bg-card/10 px-5 py-3 text-xs tracking-[0.18em] text-foreground backdrop-blur hover:bg-card/20"
              >
                VOLTAR A PRODUTOS
              </Link>
              <Link
                href="/admin/logout"
                className="rounded-full bg-primary px-5 py-3 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90"
              >
                SAIR
              </Link>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
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
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                ADMIN
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-4xl tracking-tight">
                Carrossel
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Trocar as imagens dos slides principais da página inicial.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-border bg-card/10 px-5 py-3 text-xs tracking-[0.18em] text-muted-foreground backdrop-blur hover:bg-card/20 hover:text-foreground"
              >
                VER HOME
              </Link>
              <Link
                href="/admin/logout"
                className="rounded-full bg-primary px-5 py-3 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90"
              >
                SAIR
              </Link>
            </div>
          </div>

          <AdminTabs active="carousel" />
          <AdminCarouselEditorClient initialSlides={slides} />
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
