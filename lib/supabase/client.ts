// lib/supabase/client.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserSafeClient: SupabaseClient | null = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} nao esta configurada. Veja .env.example para preparar o Supabase.`,
    );
  }
  return value;
}

export function getSupabaseClient() {
  if (!browserSafeClient) {
    browserSafeClient = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    );
  }

  return browserSafeClient;
}

export const supabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
