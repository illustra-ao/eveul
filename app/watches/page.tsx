// app/watches/page.tsx
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { WatchesCatalog } from "@/components/watches/watches-catalog";

export default function WatchesPage() {
  return (
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <WatchesCatalog />
      </div>
      <SiteFooter />
    </main>
  );
}
