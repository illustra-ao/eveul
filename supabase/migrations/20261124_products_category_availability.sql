-- Eveul · categoria (relógios/óculos) e disponibilidade (stock) dos produtos
-- Aditiva e idempotente: pode correr mais de uma vez, e o código antigo
-- continua a funcionar depois de aplicada. Correr ANTES do deploy do código novo.

alter table public.products
  add column if not exists category text not null default 'watch',
  add column if not exists availability text not null default 'available';

-- Constraints em separado para poderem ser recriadas sem erro
alter table public.products drop constraint if exists products_category_check;
alter table public.products
  add constraint products_category_check
  check (category in ('watch', 'eyewear'));

alter table public.products drop constraint if exists products_availability_check;
alter table public.products
  add constraint products_availability_check
  check (availability in ('available', 'last', 'soldout'));

-- Filtro do catálogo por categoria (só produtos publicados)
create index if not exists products_status_category_idx
  on public.products (status, category, created_at desc);
