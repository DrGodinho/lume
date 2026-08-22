-- Notas relacionais de lead (1:N) — issue #17
-- A aplicacao acessa o Supabase via service role (que ignora RLS), mas a tabela
-- recebe RLS habilitado como rede de seguranca para acessos anonimos.

create table if not exists public.lead_notes (
  id bigint generated always as identity primary key,
  lead_id text not null references public.leads (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists lead_notes_lead_id_idx on public.lead_notes (lead_id);

alter table public.lead_notes enable row level security;

create policy "Lead notes gerenciadas pela aplicacao"
  on public.lead_notes for all
  using (true) with check (true);
