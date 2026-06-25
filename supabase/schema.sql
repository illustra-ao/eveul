create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  collection text not null check (collection in ('Signature', 'Limited', 'Classic')),
  price integer not null default 0 check (price >= 0),
  currency text not null default 'Kz',
  badge text check (badge in ('BEST SELLER', 'LIMITED', 'NEW')),
  description text,
  highlights text[] not null default '{}',
  status text not null default 'draft' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  path text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_order_idx
on public.product_images(product_id, sort_order, created_at);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create table if not exists public.hero_carousel_slides (
  id text primary key,
  image_url text,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_hero_carousel_slides_updated_at on public.hero_carousel_slides;
create trigger set_hero_carousel_slides_updated_at
before update on public.hero_carousel_slides
for each row execute function public.set_updated_at();

insert into public.hero_carousel_slides (id, image_url, image_path, sort_order)
values
  ('jupiter', null, null, 0),
  ('paraiba', null, null, 1)
on conflict (id) do update
set sort_order = excluded.sort_order;

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.hero_carousel_slides enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (status = 'active');

drop policy if exists "Public can read active product images" on public.product_images;
create policy "Public can read active product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.status = 'active'
  )
);

drop policy if exists "Public can read hero carousel slides" on public.hero_carousel_slides;
create policy "Public can read hero carousel slides"
on public.hero_carousel_slides
for select
using (true);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  4194304,
  array['image/avif', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;