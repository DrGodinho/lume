-- Adds the Kanban pin/favorite flag used by the CRM star button.
-- Safe to run more than once.

alter table public.leads
  add column if not exists pinned boolean not null default false;

create index if not exists leads_pinned_idx
  on public.leads (pinned)
  where pinned = true;

notify pgrst, 'reload schema';
