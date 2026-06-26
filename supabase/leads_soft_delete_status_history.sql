alter table public.leads
  add column if not exists deleted_at timestamptz;

create index if not exists leads_deleted_at_idx
  on public.leads (deleted_at);

create table if not exists public.lead_status_history (
  id bigserial primary key,
  lead_id text not null references public.leads (id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_at timestamptz not null default now(),
  changed_by text
);

create index if not exists lead_status_history_lead_id_changed_at_idx
  on public.lead_status_history (lead_id, changed_at desc);

insert into public.lead_status_history (lead_id, from_status, to_status, changed_at, changed_by)
select
  l.id,
  null,
  l.status,
  coalesce(l.updated_at, l.status_changed_at::timestamptz, now()),
  'backfill'
from public.leads l
where not exists (
  select 1
  from public.lead_status_history h
  where h.lead_id = l.id
);
