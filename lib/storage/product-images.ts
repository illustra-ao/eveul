import { supabaseAdmin } from "@/lib/supabase/admin";

export const PRODUCT_IMAGE_BUCKET =
  process.env.PRODUCT_IMAGE_BUCKET || "product-images";

export const PRODUCT_IMAGE_MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MIME_EXTENSION: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type StoredProductImage = {
  path: string;
  url: string;
};

export function validateProductImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Formato inválido. Use JPG, PNG, WebP ou AVIF.";
  }

  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return "Imagem demasiado grande. O limite após compressão é 4 MB.";
  }

  return null;
}

function getImageExtension(file: File) {
  if (file.type in MIME_EXTENSION) {
    return MIME_EXTENSION[file.type];
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "webp";
}

function safePathPart(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return cleaned || "product";
}

async function uploadStoredImage({
  file,
  folder,
}: {
  file: File;
  folder: string;
}): Promise<StoredProductImage> {
  const validationError = validateProductImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const extension = getImageExtension(file);
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type || "image/webp",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
  };
}

export async function uploadProductImage({
  file,
  productId,
  slug,
}: {
  file: File;
  productId: string;
  slug?: string;
}) {
  const safeSlug = safePathPart(slug || productId);
  return uploadStoredImage({ file, folder: `products/${safeSlug}` });
}

export async function uploadCarouselImage({
  file,
  slideId,
}: {
  file: File;
  slideId: string;
}) {
  return uploadStoredImage({
    file,
    folder: `carousel/${safePathPart(slideId)}`,
  });
}

export async function deleteStoredImage(path: string) {
  if (!path) return;

  const { error } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}

export const deleteProductImage = deleteStoredImage;
