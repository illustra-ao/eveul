import type { Metadata } from "next";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { WatchesCatalogSupabase } from "@/components/watches/watches-catalog-supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relógios e óculos",
  description: "Relógios e óculos Eveul, colecções Signature, Limited e Classic. Encomenda pelo WhatsApp com entrega em Luanda.",
};

export default async function WatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ colecao?: string | string[]; categoria?: string | string[] }>;
}) {
  const { colecao, categoria } = await searchParams;
  const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

  return (
    <>
      <SiteNavbar />
      {/* pt-16: altura da navbar fixa */}
      <main className="pt-16">
        <WatchesCatalogSupabase initialCollection={first(colecao)} initialCategory={first(categoria)} />
      </main>
      <SiteFooter />
    </>
  );
}
