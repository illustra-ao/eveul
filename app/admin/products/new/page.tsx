// app/admin/products/new/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { availabilityLabels, categoryLabels, parseAvailability, parseCategory } from "@/lib/products";
import { AdminShell } from "@/components/admin/admin-shell";
import { Field, Panel, selectClass, textareaClass } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Collection = "Signature" | "Limited" | "Classic";
type Status = "active" | "draft" | "archived";
type Badge = "BEST SELLER" | "LIMITED" | "NEW" | "";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const collection = String(
    formData.get("collection") ?? "Signature",
  ) as Collection;
  const badgeRaw = String(formData.get("badge") ?? "") as Badge;
  const status = String(formData.get("status") ?? "draft") as Status;
  const category = parseCategory(formData.get("category"));
  const availability = parseAvailability(formData.get("availability"));

  const price = Number(
    String(formData.get("price") ?? "0").replace(/[^\d]/g, ""),
  );
  const currency = String(formData.get("currency") ?? "Kz").trim() || "Kz";
  const description = String(formData.get("description") ?? "").trim() || null;

  const highlightsText = String(formData.get("highlights") ?? "").trim();
  const highlights = highlightsText
    ? highlightsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (!name) {
    // Em produção, devolverias errors; aqui mantemos simples.
    throw new Error("Nome é obrigatório.");
  }

  const slug = slugify(slugRaw || name);

  const badge = badgeRaw === "" ? null : badgeRaw;

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      name,
      slug,
      collection,
      price,
      currency,
      badge,
      description,
      highlights,
      status,
      category,
      availability,
    })
    .select("id")
    .single();

  if (error) {
    // Erro comum: slug duplicado (unique)
    throw new Error(error.message);
  }

  redirect(`/admin/products/${data.id}`);
}

export default function AdminProductNewPage() {
  return (
    <AdminShell
      active="products"
      narrow
      title="Novo produto"
      description="Cria o produto e depois adiciona as imagens no editor."
    >
      <form action={createProduct} className="space-y-6">
        <Panel title="Informação">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nome do produto" htmlFor="name" className="md:col-span-2">
              <Input id="name" name="name" required placeholder="Eveul Jupiter" />
            </Field>

            <Field label="Slug" hint="Vazio = gerado a partir do nome" htmlFor="slug" className="md:col-span-2">
              <Input id="slug" name="slug" placeholder="eveul-jupiter" />
            </Field>

            <Field label="Categoria" htmlFor="category">
              <select id="category" name="category" defaultValue="watch" className={selectClass}>
                <option value="watch">{categoryLabels.watch}</option>
                <option value="eyewear">{categoryLabels.eyewear}</option>
              </select>
            </Field>

            <Field label="Colecção" htmlFor="collection">
              <select id="collection" name="collection" defaultValue="Signature" className={selectClass}>
                <option value="Signature">Signature</option>
                <option value="Limited">Limited</option>
                <option value="Classic">Classic</option>
              </select>
            </Field>

            <Field label="Descrição" hint="Aparece na página do produto" htmlFor="description" className="md:col-span-2">
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="O relógio, o acabamento, para quem é…"
                className={textareaClass}
              />
            </Field>

            <Field label="Destaques" hint="Separados por vírgulas" htmlFor="highlights" className="md:col-span-2">
              <Input id="highlights" name="highlights" placeholder="Open Gear, Vidro de safira, Caixa premium" />
            </Field>
          </div>
        </Panel>

        <Panel title="Preço e publicação">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Preço" hint="Só números, ex.: 189000" htmlFor="price">
              <Input id="price" name="price" required inputMode="numeric" placeholder="189000" />
            </Field>

            <Field label="Moeda" htmlFor="currency">
              <Input id="currency" name="currency" defaultValue="Kz" />
            </Field>

            <Field label="Badge" hint="Opcional" htmlFor="badge">
              <select id="badge" name="badge" defaultValue="" className={selectClass}>
                <option value="">Sem badge</option>
                <option value="BEST SELLER">Best seller</option>
                <option value="LIMITED">Limited</option>
                <option value="NEW">New</option>
              </select>
            </Field>

            <Field label="Estado" htmlFor="status">
              <select id="status" name="status" defaultValue="draft" className={selectClass}>
                <option value="draft">Rascunho</option>
                <option value="active">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </Field>

            <Field label="Stock" hint="Aparece no site como badge" htmlFor="availability">
              <select id="availability" name="availability" defaultValue="available" className={selectClass}>
                <option value="available">{availabilityLabels.available}</option>
                <option value="last">{availabilityLabels.last}</option>
                <option value="soldout">{availabilityLabels.soldout}</option>
              </select>
            </Field>
          </div>
        </Panel>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button asChild variant="outline">
            <Link href="/admin/products">Cancelar</Link>
          </Button>
          <Button type="submit">Criar e adicionar imagens</Button>
        </div>
      </form>
    </AdminShell>
  );
}
