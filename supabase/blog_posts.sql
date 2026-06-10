create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null default '[]'::jsonb,
  category text not null default 'Guias',
  tags text[] not null default '{}',
  cover_image_url text,
  cover_image_alt text,
  author_name text not null default 'LUME Controle Solar',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

alter table public.blog_posts enable row level security;

drop policy if exists "Published blog posts are public" on public.blog_posts;
create policy "Published blog posts are public"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  );

grant select on table public.blog_posts to anon;
grant select on table public.blog_posts to authenticated;

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_posts_updated_at();

insert into public.blog_posts (
  title,
  slug,
  excerpt,
  category,
  tags,
  cover_image_url,
  cover_image_alt,
  status,
  published_at,
  featured,
  seo_title,
  seo_description,
  content
) values (
  'Como escolher insulfilm residencial sem errar',
  'como-escolher-insulfilm-residencial',
  'Entenda os criterios mais importantes para escolher a pelicula ideal para calor, privacidade e protecao UV em casa.',
  'Guias',
  array['insulfilm residencial', 'controle solar', 'protecao UV'],
  'https://lumecontrolesolar.com.br/hero-bg.webp',
  'Ambiente residencial com pelicula de controle solar',
  'draft',
  now(),
  true,
  'Como escolher insulfilm residencial | Guia LUME',
  'Guia pratico para escolher insulfilm residencial considerando calor, privacidade, claridade e protecao UV.',
  '[
    {
      "type": "paragraph",
      "text": "Escolher insulfilm residencial nao e apenas decidir se o vidro vai ficar claro, escuro ou espelhado. A melhor escolha depende da posicao do sol, do nivel de calor, da necessidade de privacidade e do quanto voce quer preservar a luz natural."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Comece pelo problema principal"
    },
    {
      "type": "list",
      "items": [
        "Para reduzir calor sem escurecer muito, avalie peliculas de alta performance como nano ceramica.",
        "Para privacidade intensa durante o dia, peliculas refletivas podem fazer mais sentido.",
        "Para vidros internos e banheiros, a linha jateada costuma entregar privacidade com boa luminosidade."
      ]
    },
    {
      "type": "callout",
      "title": "Dica da LUME",
      "text": "Antes de escolher pela aparencia, observe em qual horario o sol bate no vidro. Isso muda completamente a recomendacao tecnica."
    },
    {
      "type": "cta",
      "title": "Quer uma indicacao para o seu vidro?",
      "text": "Envie uma foto do ambiente e receba uma recomendacao pratica da LUME.",
      "href": "https://wa.me/5521965140612",
      "label": "Chamar especialista"
    }
  ]'::jsonb
) on conflict (slug) do nothing;
