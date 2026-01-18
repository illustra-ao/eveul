// app/admin/products/new/page.tsx
import { redirect } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

type Collection = "Signature" | "Limited" | "Classic";
type Status = "active" | "draft" | "archived";
type Badge = "BEST SELLER" | "LIMITED" | "NEW" | "";

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
    <main className="relative">
      <SiteNavbar />
      <div className="pt-24">
        <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                ADMIN
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-4xl tracking-tight">
                Novo produto
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Crie o produto e, em seguida, adicione imagens no editor.
              </p>
            </div>
          </div>

          <form
            action={createProduct}
            className="mt-8 rounded-4xl border border-border bg-card/15 p-8 backdrop-blur"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Nome */}
              <Field label="Nome do produto" hint="Ex.: Eveul Jupiter">
                <input
                  name="name"
                  required
                  placeholder="Eveul Jupiter"
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/40"
                />
              </Field>

              {/* Slug */}
              <Field
                label="Slug"
                hint="Se deixar vazio, geramos automaticamente a partir do nome."
              >
                <input
                  name="slug"
                  placeholder="eveul-jupiter"
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/40"
                />
              </Field>

              {/* Colecção */}
              <Field label="Colecção">
                <select
                  name="collection"
                  defaultValue="Signature"
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none focus:border-[color:var(--gold)]/40"
                >
                  <option value="Signature">Signature</option>
                  <option value="Limited">Limited</option>
                  <option value="Classic">Classic</option>
                </select>
              </Field>

              {/* Badge */}
              <Field label="Badge" hint="Opcional">
                <select
                  name="badge"
                  defaultValue=""
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none focus:border-[color:var(--gold)]/40"
                >
                  <option value="">Sem badge</option>
                  <option value="BEST SELLER">BEST SELLER</option>
                  <option value="LIMITED">LIMITED</option>
                  <option value="NEW">NEW</option>
                </select>
              </Field>

              {/* Preço */}
              <Field label="Preço (Kz)" hint="Apenas números. Ex.: 189000">
                <input
                  name="price"
                  required
                  inputMode="numeric"
                  placeholder="189000"
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/40"
                />
              </Field>

              {/* Moeda */}
              <Field label="Moeda">
                <input
                  name="currency"
                  defaultValue="Kz"
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/40"
                />
              </Field>

              {/* Estado */}
              <Field label="Estado">
                <select
                  name="status"
                  defaultValue="draft"
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none focus:border-[color:var(--gold)]/40"
                >
                  <option value="draft">draft</option>
                  <option value="active">active</option>
                  <option value="archived">archived</option>
                </select>
              </Field>

              {/* Highlights */}
              <Field
                label="Highlights"
                hint="Lista separada por vírgulas. Ex.: Open Gear, Safira, Titânio"
              >
                <input
                  name="highlights"
                  placeholder="Open Gear, Vidro de safira, Caixa premium"
                  className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/40"
                />
              </Field>
            </div>

            {/* Descrição */}
            <div className="mt-6">
              <Field
                label="Descrição"
                hint="Opcional (aparece na página do produto)."
              >
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Descreva o relógio, o acabamento e a proposta..."
                  className="w-full rounded-3xl border border-border bg-black/20 p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/40"
                />
              </Field>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                Ao criar, será redireccionado para o editor do produto para
                adicionar imagens.
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/products"
                  className="h-11 inline-flex items-center justify-center rounded-full border border-border bg-card/10 px-6 text-xs tracking-[0.18em] text-foreground backdrop-blur hover:bg-card/20"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="h-11 inline-flex items-center justify-center rounded-full bg-primary px-6 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90"
                >
                  Criar produto
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-end justify-between gap-4">
        <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
          {label.toUpperCase()}
        </div>
        {hint ? (
          <div className="text-[11px] tracking-[0.18em] text-muted-foreground/80">
            {hint}
          </div>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
    </label>
  );
}
