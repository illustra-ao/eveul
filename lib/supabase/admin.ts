// lib/supabase/admin.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} nao esta configurada. Veja .env.example para preparar o Supabase.`,
    );
  }
  return value;
}

function getSupabaseAdminKey() {
  const value =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!value) {
    throw new Error(
      "SUPABASE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY nao esta configurada. Veja .env.example para preparar o Supabase.",
    );
  }

  return value;
}

export function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      getSupabaseAdminKey(),
      {
        auth: { persistSession: false },
      },
    );
  }

  return adminClient;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseAdmin();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
