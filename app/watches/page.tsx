import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { WatchesCatalogSupabase } from "@/components/watches/watches-catalog-supabase";

export const dynamic = "force-dynamic";

export default function WatchesPage() {
  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <WatchesCatalogSupabase />
      </div>
      <SiteFooter />
    </main>
  );
}
