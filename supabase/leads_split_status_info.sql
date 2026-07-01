-- =============================================================================
-- Issue #29: split Lead types into LeadCore (imutável) + LeadStatusInfo (mutável)
-- Esta migration cria a tabela `lead_status_info` em paralelo à tabela `leads`
-- existente, com relacionamento 1:1 por `lead_id`. A coluna `lead_id` referencia
-- `public.leads.id` com `ON DELETE CASCADE` para acompanhar o ciclo de vida do lead.
--
-- Status quo: a aplicação continua escrevendo em `leads` (single-table) para
-- preservar compatibilidade. Esta migration prepara o terreno para a próxima
-- fase (issue #29 / follow-up) que migrará os writes para `lead_status_info`
-- e removerá as colunas redundantes de `leads`.
--
-- View `leads_full` faz o join — útil para a fase de transição e para analytics.
-- =============================================================================

create table if not exists public.lead_status_info (
  lead_id text primary key references public.leads (id) on delete cascade,
  status text not null default 'Novo',
  status_changed_at date not null default current_date,
  notes text not null default '',
  proximo_contato timestamptz,
  data_servico timestamptz,
  service_status text,
  dormant boolean not null default false,
  pinned boolean not null default false,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Constraint: status precisa estar dentro de LEAD_STAGES
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lead_status_info_status_chk'
  ) then
    alter table public.lead_status_info
      add constraint lead_status_info_status_chk
      check (status in ('Novo', 'Em Contato', 'Agendado', 'Fechado', 'Perdido'));
  end if;
end$$;

-- Constraint: service_status precisa estar dentro de ServiceStatus (ou null)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lead_status_info_service_status_chk'
  ) then
    alter table public.lead_status_info
      add constraint lead_status_info_service_status_chk
      check (
        service_status is null
        or service_status in ('Marcado', 'Confirmado', 'Em Execucao', 'Concluido', 'Reagendar')
      );
  end if;
end$$;

-- Index: filtros mais comuns
create index if not exists lead_status_info_status_idx
  on public.lead_status_info (status);
create index if not exists lead_status_info_proximo_contato_idx
  on public.lead_status_info (proximo_contato);
create index if not exists lead_status_info_pinned_idx
  on public.lead_status_info (pinned)
  where pinned = true;

-- Backfill: cria lead_status_info para qualquer lead existente que ainda não
-- tenha. Usa os valores das colunas legacy em `leads` quando disponíveis.
insert into public.lead_status_info (
  lead_id, status, status_changed_at, notes, proximo_contato, data_servico,
  service_status, dormant, pinned, updated_at, deleted_at
)
select
  l.id,
  coalesce(l.status, 'Novo'),
  coalesce(l.status_changed_at, current_date),
  coalesce(l.notes, ''),
  l.proximo_contato,
  l.data_servico,
  l.service_status,
  coalesce(l.dormant, false),
  coalesce(l.pinned, false),
  coalesce(l.updated_at, now()),
  l.deleted_at
from public.leads l
on conflict (lead_id) do nothing;

-- View: join de `leads` (core) com `lead_status_info` (status). Útil para
-- a fase de transição e para queries analíticas que precisam do lead inteiro.
create or replace view public.leads_full
with (security_invoker = true) as
select
  l.id,
  l.name,
  l.phone,
  l.email,
  l.address,
  l.neighborhood,
  l.film_type as "filmType",
  l.sqm,
  l.value,
  l.created_at as "createdAt",
  s.status,
  s.status_changed_at as "statusChangedAt",
  s.notes,
  s.proximo_contato as "proximoContato",
  s.data_servico as "dataServico",
  s.service_status as "serviceStatus",
  s.dormant,
  s.pinned,
  s.updated_at as "updatedAt",
  s.deleted_at as "deletedAt"
from public.leads l
left join public.lead_status_info s on s.lead_id = l.id;

comment on table public.lead_status_info is
  'Estado mutável do lead (issue #29). Separado de leads (core/imutável). Atualizado continuamente.';
comment on column public.lead_status_info.lead_id is
  'FK 1:1 com leads.id. ON DELETE CASCADE.';
comment on column public.lead_status_info.pinned is
  'Pin/fixar no topo do Kanban (issue #10).';
comment on view public.leads_full is
  'View de compatibilidade: join leads (core) + lead_status_info (status). Usar na fase de transição.';

-- =============================================================================
-- Próximas fases (não executadas aqui):
-- 1. Adicionar trigger AFTER INSERT/UPDATE em `lead_status_info` que escreve
--    também nas colunas legacy de `leads` (bidirecional) para manter Q1 de reads
--    funcionando durante a transição.
-- 2. Migrar todas as queries de leitura (API route GET) para usar `leads_full`
--    via supabase.from('leads_full').select('*').
-- 3. Migrar as queries de PATCH (parcial) para escrever em `lead_status_info`.
-- 4. Após validação, remover as colunas redundantes de `leads`:
--    ALTER TABLE leads DROP COLUMN status, DROP COLUMN status_changed_at, ...;
-- =============================================================================
