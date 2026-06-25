"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { HeroCarouselSlide } from "@/lib/hero-carousel";

type AdminCarouselSlide = HeroCarouselSlide & {
  imagePath?: string | null;
  updatedAt?: string | null;
};

const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1600;
const UPLOAD_IMAGE_QUALITY = 0.84;
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
  return `${slugify(baseName) || "carousel-image"}.${extension}`;
}

async function compressCarouselImage(file: File) {
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

export function AdminCarouselEditorClient({
  initialSlides,
}: {
  initialSlides: AdminCarouselSlide[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slides, setSlides] = useState(initialSlides);
  const [busySlideId, setBusySlideId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const upload = async (slideId: string, files: FileList | null) => {
    const sourceFile = files?.[0];
    if (!sourceFile) return;

    setMessage(null);
    setBusySlideId(slideId);

    try {
      const file = await compressCarouselImage(sourceFile);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/admin/carousel/${slideId}/upload`, {
        method: "POST",
        body: formData,
      });
      const json: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getApiMessage(json) ?? "Falha ao actualizar imagem.");
      }

      if (!json || typeof json !== "object" || !("slide" in json)) {
        throw new Error("Resposta inválida do servidor.");
      }

      const updated = (json as {
        slide: {
          id: string;
          image_url: string;
          image_path?: string | null;
          updated_at?: string | null;
        };
      }).slide;

      setSlides((current) =>
        current.map((slide) =>
          slide.id === updated.id
            ? {
                ...slide,
                image: updated.image_url,
                imagePath: updated.image_path,
                updatedAt: updated.updated_at,
              }
            : slide,
        ),
      );
      setMessage({ kind: "ok", text: "Imagem do carrossel actualizada." });
      startTransition(() => router.refresh());
    } catch (error: unknown) {
      setMessage({ kind: "err", text: getErrorMessage(error) });
    } finally {
      setBusySlideId(null);
    }
  };

  return (
    <div className="mt-8">
      {message && (
        <div
          className={[
            "rounded-3xl border p-4 text-sm backdrop-blur",
            message.kind === "ok"
              ? "border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 text-foreground"
              : "border-red-500/30 bg-red-500/10 text-foreground",
          ].join(" ")}
        >
          {message.text}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {slides.map((slide) => {
          const isBusy = busySlideId === slide.id || isPending;
          const title = slide.titleLines.join(" ");

          return (
            <article
              key={slide.id}
              className="overflow-hidden rounded-3xl border border-border bg-card/15 backdrop-blur"
            >
              <div className="relative aspect-[16/10] bg-black/25">
                <Image
                  src={slide.image}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={76}
                  className="object-contain p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70" />
                <div className="absolute left-5 top-5 rounded-full border border-border bg-black/35 px-3 py-1 text-[10px] tracking-[0.22em] text-[color:var(--gold)] backdrop-blur">
                  {slide.id.toUpperCase()}
                </div>
              </div>

              <div className="p-6">
                <div className="text-[11px] tracking-[0.22em] text-muted-foreground">
                  {slide.code}
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl tracking-tight">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Esta imagem aparece no carrossel principal da home. Use
                  PNG/WebP com fundo limpo para melhor recorte.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center">
                    <input
                      type="file"
                      accept="image/avif,image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={isBusy}
                      onChange={(event) => {
                        void upload(slide.id, event.currentTarget.files);
                        event.currentTarget.value = "";
                      }}
                    />
                    <span className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-xs tracking-[0.18em] text-primary-foreground hover:opacity-90">
                      {isBusy ? "A enviar..." : "Trocar imagem"}
                    </span>
                  </label>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-border bg-black/20 px-6 backdrop-blur hover:bg-black/35"
                  >
                    <Link href={slide.href} target="_blank">
                      Ver produto
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
