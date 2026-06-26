alter table public.calculator_history
  add column if not exists lead_id text;

create index if not exists calculator_history_lead_id_idx
  on public.calculator_history (lead_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_history_lead_id_fkey'
  ) then
    alter table public.calculator_history
      add constraint calculator_history_lead_id_fkey
      foreign key (lead_id)
      references public.leads (id)
      on delete set null;
  end if;
end
$$;
