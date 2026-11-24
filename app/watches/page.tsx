import type { Metadata } from "next";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { WatchesCatalogSupabase } from "@/components/watches/watches-catalog-supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relógios",
  description: "Colecções Signature, Limited e Classic. Encomenda pelo WhatsApp com entrega em Luanda.",
};

export default async function WatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ colecao?: string | string[] }>;
}) {
  const { colecao } = await searchParams;
  const initialCollection = Array.isArray(colecao) ? colecao[0] : colecao;

  return (
    <>
      <SiteNavbar />
      {/* pt-16: altura da navbar fixa */}
      <main className="pt-16">
        <WatchesCatalogSupabase initialCollection={initialCollection} />
      </main>
      <SiteFooter />
    </>
  );
}
