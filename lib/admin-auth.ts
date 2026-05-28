export const ADMIN_SESSION_COOKIE = "eveul_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminAuthConfig = {
  username: string;
  password: string;
  isAvailable: boolean;
  usesDevDefault: boolean;
};

export function getAdminAuthConfig(): AdminAuthConfig {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const usesDevDefault =
    !configuredPassword && process.env.NODE_ENV !== "production";

  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: configuredPassword || (usesDevDefault ? "admin" : ""),
    isAvailable: Boolean(configuredPassword) || usesDevDefault,
    usesDevDefault,
  };
}

export function getSafeAdminNextPath(value: FormDataEntryValue | string | null) {
  const next = String(value ?? "").trim();

  if (
    next.startsWith("/admin") &&
    !next.startsWith("/admin/login") &&
    !next.startsWith("/admin/logout") &&
    !next.startsWith("//")
  ) {
    return next;
  }

  return "/admin/products";
}

async function signSessionPayload(payload: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

export async function createAdminSession(username: string) {
  const config = getAdminAuthConfig();
  if (!config.isAvailable) return null;

  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${username}.${expiresAt}`;
  const signature = await signSessionPayload(payload, config.password);

  return `${payload}.${signature}`;
}

export async function verifyAdminSession(value?: string | null) {
  const config = getAdminAuthConfig();
  if (!config.isAvailable || !value) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [username, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);

  if (
    !username ||
    username !== config.username ||
    !Number.isFinite(expiresAt) ||
    Date.now() > expiresAt
  ) {
    return false;
  }

  const expectedSignature = await signSessionPayload(
    `${username}.${expiresAt}`,
    config.password,
  );

  return constantTimeEqual(signature, expectedSignature);
}
