-- Secures the CRM monthly target settings table.
-- The browser CRM reads/writes one row per month, e.g. crm_goal_2026-07.

revoke all on table public.configuracoes from anon;
grant select, insert, update on table public.configuracoes to authenticated;
grant select, insert, update on table public.configuracoes to service_role;

alter table public.configuracoes enable row level security;

drop policy if exists "configuracoes_authenticated_select" on public.configuracoes;
create policy "configuracoes_authenticated_select"
on public.configuracoes
for select
to authenticated
using (
  id = 'default'
  or id ~ '^crm_goal_[0-9]{4}-[0-9]{2}$'
);

drop policy if exists "configuracoes_authenticated_insert" on public.configuracoes;
create policy "configuracoes_authenticated_insert"
on public.configuracoes
for insert
to authenticated
with check (
  id = 'default'
  or id ~ '^crm_goal_[0-9]{4}-[0-9]{2}$'
);

drop policy if exists "configuracoes_authenticated_update" on public.configuracoes;
create policy "configuracoes_authenticated_update"
on public.configuracoes
for update
to authenticated
using (
  id = 'default'
  or id ~ '^crm_goal_[0-9]{4}-[0-9]{2}$'
)
with check (
  id = 'default'
  or id ~ '^crm_goal_[0-9]{4}-[0-9]{2}$'
);
