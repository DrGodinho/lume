-- CRM follow-up playbooks shared between desktop and mobile.
-- Run this in Supabase SQL Editor before relying on /api/crm/playbooks in production.

create table if not exists public.crm_playbooks (
  seller_id text primary key,
  rules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text,
  constraint crm_playbooks_seller_id_check check (
    seller_id = lower(seller_id)
    and seller_id ~ '^[a-z0-9][a-z0-9_-]{1,62}$'
  ),
  constraint crm_playbooks_rules_is_array check (jsonb_typeof(rules) = 'array')
);

alter table public.crm_playbooks enable row level security;

revoke all on table public.crm_playbooks from anon;
revoke all on table public.crm_playbooks from authenticated;
grant select, insert, update, delete on table public.crm_playbooks to service_role;

drop policy if exists "crm_playbooks_authenticated_select" on public.crm_playbooks;
drop policy if exists "crm_playbooks_authenticated_insert" on public.crm_playbooks;
drop policy if exists "crm_playbooks_authenticated_update" on public.crm_playbooks;

drop policy if exists "crm_playbooks_service_role_select" on public.crm_playbooks;
create policy "crm_playbooks_service_role_select"
on public.crm_playbooks
for select
to service_role
using (true);

drop policy if exists "crm_playbooks_service_role_insert" on public.crm_playbooks;
create policy "crm_playbooks_service_role_insert"
on public.crm_playbooks
for insert
to service_role
with check (true);

drop policy if exists "crm_playbooks_service_role_update" on public.crm_playbooks;
create policy "crm_playbooks_service_role_update"
on public.crm_playbooks
for update
to service_role
using (true)
with check (true);

insert into public.crm_playbooks (seller_id, rules, updated_by)
values (
  'equipe-lume',
  '[
    {"id":"novo-d2","triggerStatus":"Novo","scheduleOffsetDays":2,"actionType":"follow_up","enabled":true},
    {"id":"em-contato-d7","triggerStatus":"Em Contato","scheduleOffsetDays":7,"actionType":"follow_up","enabled":true},
    {"id":"agendado-d15","triggerStatus":"Agendado","scheduleOffsetDays":15,"actionType":"follow_up","enabled":true}
  ]'::jsonb,
  'migration'
)
on conflict (seller_id) do nothing;
