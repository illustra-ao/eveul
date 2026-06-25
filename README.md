# Eveul

Loja Next.js para a Eveul, com vitrine publica de relogios, paginas de produto, newsletter, area admin e integracao Supabase para produtos/imagens.

## Stack

- Next.js 16 / React 19
- Tailwind CSS 4
- Supabase: produtos, imagens e newsletter
- GSAP para animacoes editoriais
- Basic Auth opcional para proteger `/admin` e `/api/admin`

## Como correr localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Sem variaveis Supabase, a loja publica usa um catalogo local de fallback para permitir ver a experiencia completa. A area admin e as rotas de escrita precisam do Supabase configurado.

## Variaveis de ambiente

Crie `.env.local` a partir de `.env.example`.

```bash
cp .env.example .env.local
```

Obrigatorias para Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` em projectos antigos)
- `SUPABASE_SECRET_KEY` (ou `SUPABASE_SERVICE_ROLE_KEY` em projectos antigos)
- `PRODUCT_IMAGE_BUCKET` (por defeito: `product-images`)

Recomendadas para deploy:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `KEEPALIVE_TOKEN`
- `CRON_SECRET` (alternativa usada por crons em deploy)

Em desenvolvimento, se `ADMIN_PASSWORD` estiver vazio, o login local aceita `admin` / `admin`. Em producao, defina sempre uma palavra-passe forte; sem `ADMIN_PASSWORD`, o acesso admin fica bloqueado.

## Supabase

Para um projecto novo, execute o SQL em `supabase/schema.sql` no SQL Editor do
Supabase. Ele cria as tabelas, politicas publicas de leitura para produtos
activos e o bucket `product-images`.

Tabelas esperadas:

- `products`: `id`, `slug`, `name`, `collection`, `price`, `currency`, `badge`, `description`, `highlights`, `status`, `created_at`, `updated_at`
- `product_images`: `id`, `product_id`, `url`, `path`, `sort_order`, `created_at`
- `newsletter_subscribers`: `id`, `email`, `source`, `created_at`

Storage bucket esperado:

- `product-images`, publico para leitura das imagens

Valores usados no app:

- `collection`: `Signature`, `Limited`, `Classic`
- `status`: `active`, `draft`, `archived`
- `badge`: `BEST SELLER`, `LIMITED`, `NEW`

## Admin

- Lista: `/admin/products`
- Novo produto: `/admin/products/new`
- Editar produto: `/admin/products/:id`
- Login: `/admin/login`
- Logout: `/admin/logout`

No editor pode alterar dados, publicar/despublicar, arquivar, enviar imagens, definir imagem principal e remover imagens.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Deploy

O projeto esta pronto para Vercel. Configure as variaveis no dashboard da Vercel e confirme que o bucket `product-images` existe no Supabase.
