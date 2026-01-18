// components/admin/admin-product-editor-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Collection = "Signature" | "Limited" | "Classic";
type Status = "active" | "draft" | "archived";
type Badge = "BEST SELLER" | "LIMITED" | "NEW" | null;

type Product = {
  id: string;
  slug: string;
  name: string;
  collection: Collection;
  price: number;
  currency: string;
  badge: Badge;
  description: string | null;
  highlights: string[];
  status: Status;
  created_at?: string;
  updated_at?: string;
};

type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  path: string;
  sort_order: number;
  created_at?: string;
};

function formatKz(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value);
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function AdminProductEditorClient({
  product,
  initialImages,
}: {
  product: Product;
  initialImages: ProductImage[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    collection: product.collection,
    price: String(product.price),
    currency: product.currency,
    badge: product.badge ?? "",
    status: product.status,
    highlights: product.highlights.join(", "),
    description: product.description ?? "",
  });

  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const mainImage = useMemo(() => images[0]?.url, [images]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setMessage(null);
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        slug: slugify(form.slug || form.name),
        collection: form.collection,
        price: Number(String(form.price).replace(/[^\d]/g, "")),
        currency: form.currency.trim() || "Kz",
        badge: form.badge === "" ? null : form.badge,
        status: form.status,
        description: form.description.trim() || null,
        highlights: form.highlights
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Falha ao guardar.");

      setMessage({ kind: "ok", text: "Produto actualizado com sucesso." });

      // Se o slug mudou, actualiza URL do editor (opcional). Mantemos por id, então ok.
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setMessage({ kind: "err", text: getErrorMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setMessage(null);
    setUploading(true);

    try {
      const uploaded: ProductImage[] = [];

      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("productId", product.id);
        fd.append("slug", slugify(form.slug || form.name));

        const res = await fetch(
          `/api/admin/products/${product.id}/images/upload`,
          {
            method: "POST",
            body: fd,
          },
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Falha ao fazer upload.");

        uploaded.push(json.image as ProductImage);
      }

      // reordena: principal primeiro
      const next = [...images, ...uploaded].sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      setImages(next);
      setMessage({ kind: "ok", text: "Imagem(ns) adicionada(s) com sucesso." });

      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setMessage({ kind: "err", text: getErrorMessage(e) });
    } finally {
      setUploading(false);
    }
  };

  const makePrimary = async (imageId: string) => {
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/products/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ makePrimary: true, productId: product.id }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.message || "Falha ao definir principal.");

      // recebe lista já ordenada
      setImages(json.images as ProductImage[]);
      setMessage({ kind: "ok", text: "Imagem principal actualizada." });
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setMessage({ kind: "err", text: getErrorMessage(e) });
    }
  };

  const removeImage = async (img: ProductImage) => {
    if (!confirm("Remover esta imagem?")) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/products/images/${img.id}`, {
        method: "DELETE",
      });
      const json: unknown = await res.json();
      if (!res.ok) throw new Error(getApiMessage(json) ?? "Falha ao guardar.");

      setImages((prev) => prev.filter((x) => x.id !== img.id));
      setMessage({ kind: "ok", text: "Imagem removida." });
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setMessage({ kind: "err", text: getErrorMessage(e) });
    }
  };

  function getApiMessage(data: unknown): string | undefined {
    if (!data || typeof data !== "object") return;
    if (
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
    }
  }
  function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "Erro inesperado.";
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
            ADMIN
          </div>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl tracking-tight">
            Editar produto
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ID: <span className="text-foreground">{product.id}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products"
            className="h-11 inline-flex items-center justify-center rounded-full border border-border bg-card/10 px-6 text-xs tracking-[0.18em] text-foreground backdrop-blur hover:bg-card/20"
          >
            Voltar
          </Link>
          <Button
            className="h-11 rounded-full bg-primary px-6 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90"
            onClick={save}
            disabled={saving || isPending}
          >
            {saving ? "A guardar..." : "Guardar alterações"}
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={[
            "mt-6 rounded-3xl border p-4 text-sm backdrop-blur",
            message.kind === "ok"
              ? "border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 text-foreground"
              : "border-red-500/30 bg-red-500/10 text-foreground",
          ].join(" ")}
        >
          {message.text}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Form */}
        <div className="lg:col-span-7 rounded-4xl border border-border bg-card/15 p-8 backdrop-blur">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Nome">
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="h-11 rounded-2xl bg-black/20"
              />
            </Field>

            <Field label="Slug" hint="Usado na URL pública do produto.">
              <Input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                className="h-11 rounded-2xl bg-black/20"
              />
            </Field>

            <Field label="Colecção">
              <select
                value={form.collection}
                onChange={(e) => setField("collection", e.target.value)}
                className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none"
              >
                <option value="Signature">Signature</option>
                <option value="Limited">Limited</option>
                <option value="Classic">Classic</option>
              </select>
            </Field>

            <Field label="Badge">
              <select
                value={form.badge}
                onChange={(e) => setField("badge", e.target.value)}
                className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none"
              >
                <option value="">Sem badge</option>
                <option value="BEST SELLER">BEST SELLER</option>
                <option value="LIMITED">LIMITED</option>
                <option value="NEW">NEW</option>
              </select>
            </Field>

            <Field label="Preço (Kz)">
              <Input
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                className="h-11 rounded-2xl bg-black/20"
                inputMode="numeric"
              />
            </Field>

            <Field label="Moeda">
              <Input
                value={form.currency}
                onChange={(e) => setField("currency", e.target.value)}
                className="h-11 rounded-2xl bg-black/20"
              />
            </Field>

            <Field label="Estado">
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className="h-11 w-full rounded-2xl border border-border bg-black/20 px-4 text-sm text-foreground outline-none"
              >
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
            </Field>

            <Field label="Highlights" hint="Separados por vírgulas.">
              <Input
                value={form.highlights}
                onChange={(e) => setField("highlights", e.target.value)}
                className="h-11 rounded-2xl bg-black/20"
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Descrição">
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={6}
                className="w-full rounded-3xl border border-border bg-black/20 p-4 text-sm text-foreground outline-none"
              />
            </Field>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-black/15 p-5">
            <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
              PREVIEW
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-foreground">{form.name}</div>
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  /watches/{slugify(form.slug || form.name)}
                </div>
              </div>
              <div className="text-sm text-foreground">
                <span className="text-[color:var(--gold)]">
                  {form.currency || "Kz"}
                </span>{" "}
                {formatKz(
                  Number(String(form.price).replace(/[^\d]/g, "")) || 0,
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Images */}
        <div className="lg:col-span-5">
          <div className="rounded-4xl border border-border bg-card/15 p-8 backdrop-blur">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs tracking-[0.22em] text-[color:var(--gold)]">
                  IMAGENS
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Upload para o bucket{" "}
                  <span className="text-foreground">product-images</span>.
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files)}
                  disabled={uploading}
                />
                <span className="h-11 rounded-full bg-primary px-6 inline-flex items-center text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90">
                  {uploading ? "A enviar..." : "Adicionar imagens"}
                </span>
              </label>
            </div>

            {/* Main preview */}
            <div className="mt-6 relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-black/25">
              {mainImage ? (
                <>
                  <Image
                    src={mainImage}
                    alt="Principal"
                    fill
                    className="object-cover"
                    unoptimized
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/60" />
                  <div className="absolute left-4 top-4 rounded-full border border-border bg-black/30 px-3 py-1 text-[10px] tracking-[0.22em] text-[color:var(--gold)] backdrop-blur">
                    PRINCIPAL
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Sem imagens ainda.
                </div>
              )}
            </div>

            {/* Thumbs list */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-black/20"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={img.url}
                      alt={`Imagem ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => makePrimary(img.id)}
                      disabled={idx === 0}
                      className="flex-1 rounded-full border border-border bg-black/35 px-2 py-1 text-[10px] tracking-[0.18em] text-foreground backdrop-blur hover:bg-black/55 disabled:opacity-50"
                    >
                      Principal
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="rounded-full border border-border bg-black/35 px-3 py-1 text-[10px] tracking-[0.18em] text-foreground backdrop-blur hover:bg-black/55"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="mt-6 rounded-3xl border border-border bg-black/15 p-5 text-sm text-muted-foreground">
                Faça upload de 2–4 imagens para começar. A primeira será
                considerada principal.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-4xl border border-border bg-card/10 p-6 backdrop-blur">
            <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
              DICA
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Para a página pública, use imagens em boa resolução e
              enquadramento consistente. Depois adicionamos recorte e compressão
              automática se precisares.
            </p>
          </div>
        </div>
      </div>
    </section>
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
