-- Fixa o search_path da função de trigger (aviso "Function Search Path Mutable"
-- do Supabase). A função só usa now(), que está sempre disponível via pg_catalog.
alter function public.set_updated_at() set search_path = '';
