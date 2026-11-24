// components/admin/admin-product-editor-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatKz } from "@/lib/site-config";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Panel, StatusBadge, selectClass, textareaClass } from "@/components/admin/admin-ui";

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

type UploadProgress = {
  currentFile: string;
  percent: number;
  stage: "compressing" | "uploading";
};

const MAX_UPLOAD_FILES = 6;
const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1800;
const UPLOAD_IMAGE_QUALITY = 0.82;
const SOURCE_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getUploadError(file: File) {
  if (!SOURCE_IMAGE_TYPES.has(file.type)) {
    return `${file.name}: use JPG, PNG, WebP ou AVIF.`;
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    return `${file.name}: a imagem original excede 20 MB.`;
  }

  return null;
}

function canvasSupportsType(type: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL(type).startsWith(`data:${type}`);
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name}: não foi possível ler a imagem.`));
    };

    image.src = url;
  });
}

function buildCompressedFileName(name: string, mimeType: string) {
  const baseName = name.replace(/\.[^.]+$/, "");
  const extension = mimeType === "image/avif" ? "avif" : "webp";
  return `${slugify(baseName) || "product-image"}.${extension}`;
}

async function compressProductImage(file: File) {
  const validationError = getUploadError(file);
  if (validationError) throw new Error(validationError);

  const image = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(`${file.name}: não foi possível preparar a imagem.`);
  }

  context.drawImage(image, 0, 0, width, height);

  const outputType = canvasSupportsType("image/avif")
    ? "image/avif"
    : "image/webp";
  const compressedBlob = await toBlob(
    canvas,
    outputType,
    UPLOAD_IMAGE_QUALITY,
  );

  if (!compressedBlob) {
    if (file.size <= MAX_UPLOAD_IMAGE_BYTES) return file;
    throw new Error(`${file.name}: não foi possível comprimir a imagem.`);
  }

  if (compressedBlob.size > MAX_UPLOAD_IMAGE_BYTES) {
    throw new Error(
      `${file.name}: mesmo comprimida, a imagem excede o limite de 4 MB.`,
    );
  }

  return new File([compressedBlob], buildCompressedFileName(file.name, outputType), {
    type: outputType,
    lastModified: Date.now(),
  });
}

function uploadProductImageRequest({
  url,
  formData,
  onProgress,
}: {
  url: string;
  formData: FormData;
  onProgress: (progress: number) => void;
}) {
  return new Promise<ProductImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(event.loaded / event.total);
    };

    xhr.onload = () => {
      const json = parseJson(xhr.responseText);
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(getApiMessage(json) ?? "Falha ao fazer upload."));
        return;
      }

      if (!json || typeof json !== "object" || !("image" in json)) {
        reject(new Error("Resposta inválida do servidor."));
        return;
      }

      resolve((json as { image: ProductImage }).image);
    };

    xhr.onerror = () => reject(new Error("Falha de rede no upload."));
    xhr.onabort = () => reject(new Error("Upload cancelado."));
    xhr.send(formData);
  });
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

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
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null,
  );
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

    const selectedFiles = Array.from(files).slice(0, MAX_UPLOAD_FILES);

    setMessage(null);
    setUploading(true);

    try {
      if (files.length > MAX_UPLOAD_FILES) {
        throw new Error(`Envie no máximo ${MAX_UPLOAD_FILES} imagens por vez.`);
      }

      const uploaded: ProductImage[] = [];
      const total = selectedFiles.length;

      for (const [index, file] of selectedFiles.entries()) {
        setUploadProgress({
          currentFile: file.name,
          percent: Math.round((index / total) * 100),
          stage: "compressing",
        });

        const preparedFile = await compressProductImage(file);
        const fd = new FormData();
        fd.append("file", preparedFile);
        fd.append("productId", product.id);
        fd.append("slug", slugify(form.slug || form.name));

        const image = await uploadProductImageRequest({
          url: `/api/admin/products/${product.id}/images/upload`,
          formData: fd,
          onProgress: (progress) => {
            setUploadProgress({
              currentFile: preparedFile.name,
              percent: Math.min(
                99,
                Math.round(((index + progress) / total) * 100),
              ),
              stage: "uploading",
            });
          },
        });

        uploaded.push(image);
      }

      // reordena: principal primeiro
      const next = [...images, ...uploaded].sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      setImages(next);
      setUploadProgress({
        currentFile: "Concluído",
        percent: 100,
        stage: "uploading",
      });
      setMessage({ kind: "ok", text: "Imagem(ns) adicionada(s) com sucesso." });

      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setMessage({ kind: "err", text: getErrorMessage(e) });
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const makePrimary = async (imageId: string) => {
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/images/${imageId}`, {
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
      const res = await fetch(`/api/admin/products/${product.id}/images/${img.id}`, {
        method: "DELETE",
      });
      const json: unknown = await res.json();
      if (!res.ok) throw new Error(getApiMessage(json) ?? "Falha ao guardar.");

      if (
        json &&
        typeof json === "object" &&
        "images" in json &&
        Array.isArray((json as { images?: unknown }).images)
      ) {
        setImages((json as { images: ProductImage[] }).images);
      } else {
        setImages((prev) => prev.filter((x) => x.id !== img.id));
      }
      setMessage({ kind: "ok", text: "Imagem removida." });
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setMessage({ kind: "err", text: getErrorMessage(e) });
    }
  };

  const publicSlug = slugify(form.slug || form.name);
  const pricePreview = Number(String(form.price).replace(/[^\d]/g, "")) || 0;

  const saveButton = (
    <Button onClick={save} disabled={saving || isPending}>
      {saving ? "A guardar…" : "Guardar alterações"}
    </Button>
  );

  return (
    <div className="pb-24 md:pb-0">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/products" className="text-meta text-muted-foreground hover:text-foreground">
            ← Produtos
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl">{form.name || "Sem nome"}</h1>
            <StatusBadge status={form.status} />
          </div>
          <p className="mt-1 text-meta text-muted-foreground">
            /watches/{publicSlug} · <span className="tabular">{formatKz(pricePreview)}</span>
          </p>
        </div>

        <div className="hidden flex-wrap gap-2 md:flex">
          <Button asChild variant="outline">
            <a href={`/watches/${product.slug}`} target="_blank" rel="noreferrer">Ver na loja</a>
          </Button>
          {saveButton}
        </div>
      </div>

      <div aria-live="polite">
        {message ? (
          <p
            role={message.kind === "err" ? "alert" : "status"}
            className={cn(
              "mb-6 rounded-md border p-4 text-sm",
              message.kind === "ok" ? "border-gold/40 bg-gold/10" : "border-destructive/50 bg-destructive/10",
            )}
          >
            {message.text}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Panel title="Informação">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nome" htmlFor="name" className="md:col-span-2">
                <Input id="name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
              </Field>

              <Field label="Slug" hint="Usado no endereço público" htmlFor="slug">
                <Input id="slug" value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
              </Field>

              <Field label="Colecção" htmlFor="collection">
                <select id="collection" value={form.collection} onChange={(e) => setField("collection", e.target.value)} className={selectClass}>
                  <option value="Signature">Signature</option>
                  <option value="Limited">Limited</option>
                  <option value="Classic">Classic</option>
                </select>
              </Field>

              <Field label="Descrição" htmlFor="description" className="md:col-span-2">
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={6}
                  className={textareaClass}
                />
              </Field>

              <Field label="Destaques" hint="Separados por vírgulas" htmlFor="highlights" className="md:col-span-2">
                <Input id="highlights" value={form.highlights} onChange={(e) => setField("highlights", e.target.value)} />
              </Field>
            </div>
          </Panel>

          <Panel title="Preço e publicação">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Preço" hint="Só números" htmlFor="price">
                <Input id="price" value={form.price} onChange={(e) => setField("price", e.target.value)} inputMode="numeric" />
              </Field>

              <Field label="Moeda" htmlFor="currency">
                <Input id="currency" value={form.currency} onChange={(e) => setField("currency", e.target.value)} />
              </Field>

              <Field label="Badge" htmlFor="badge">
                <select id="badge" value={form.badge} onChange={(e) => setField("badge", e.target.value)} className={selectClass}>
                  <option value="">Sem badge</option>
                  <option value="BEST SELLER">Best seller</option>
                  <option value="LIMITED">Limited</option>
                  <option value="NEW">New</option>
                </select>
              </Field>

              <Field label="Estado" htmlFor="status">
                <select id="status" value={form.status} onChange={(e) => setField("status", e.target.value)} className={selectClass}>
                  <option value="draft">Rascunho</option>
                  <option value="active">Publicado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </Field>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-5">
          <Panel
            title="Imagens"
            description="A primeira é a principal (cards e partilhas). Até 6 por envio; são comprimidas antes do upload."
            className="lg:sticky lg:top-6"
          >
            <input
              id="product-upload"
              type="file"
              accept="image/*"
              multiple
              className="peer sr-only"
              onChange={(e) => onUpload(e.target.files)}
              disabled={uploading}
            />
            <label
              htmlFor="product-upload"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full cursor-pointer border-dashed peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              )}
            >
              <Upload />
              {uploading ? "A enviar…" : "Adicionar imagens"}
            </label>

            {uploadProgress ? (
              <div className="mt-4" role="status">
                <div className="flex justify-between gap-4 text-meta text-muted-foreground">
                  <span className="truncate">
                    {uploadProgress.stage === "compressing" ? "A comprimir" : "A enviar"} · {uploadProgress.currentFile}
                  </span>
                  <span className="tabular">{uploadProgress.percent}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gold transition-all" style={{ width: `${uploadProgress.percent}%` }} />
                </div>
              </div>
            ) : null}

            {images.length === 0 ? (
              <p className="mt-5 rounded-sm border border-border p-5 text-sm text-muted-foreground">
                Sem imagens. Adiciona 2 a 4 fotografias com enquadramento consistente.
              </p>
            ) : (
              <>
                <div className="relative mt-5 aspect-square overflow-hidden rounded-sm bg-sunken">
                  {mainImage ? (
                    <Image src={mainImage} alt="Imagem principal" fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" unoptimized />
                  ) : null}
                </div>

                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((img, idx) => (
                    <li key={img.id} className="rounded-sm border border-border">
                      <div className="relative aspect-square overflow-hidden bg-sunken">
                        <Image src={img.url} alt={`Imagem ${idx + 1}`} fill sizes="140px" className="object-cover" unoptimized />
                        {idx === 0 ? (
                          <span className="absolute left-1.5 top-1.5 rounded-sm bg-gold px-1.5 py-0.5 text-xs font-medium text-ink">
                            Principal
                          </span>
                        ) : null}
                      </div>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => makePrimary(img.id)}
                          disabled={idx === 0}
                          className="flex-1 px-2"
                          aria-label={`Tornar a imagem ${idx + 1} principal`}
                        >
                          <Star />
                          <span className="sr-only sm:not-sr-only">Principal</span>
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          size="icon"
                          onClick={() => removeImage(img)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={`Remover imagem ${idx + 1}`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        </div>
      </div>

      {/* Mobile: guardar sempre à mão */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        <Button onClick={save} disabled={saving || isPending} className="w-full">
          {saving ? "A guardar…" : "Guardar alterações"}
        </Button>
      </div>
    </div>
  );
}
