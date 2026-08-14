-- Separacao de contas e escopos por usuario na Calculadora LUME
-- 1. Garante que a coluna owner_key exista em calculator_history
alter table public.calculator_history
  add column if not exists owner_key text default 'default';

-- 2. Indice para consultas rapidas filtradas por usuario
create index if not exists calculator_history_owner_key_idx
  on public.calculator_history (owner_key);

-- 3. Migracao de dados existentes para a conta principal 'drgodinho'
update public.calculator_history
set owner_key = 'drgodinho'
where owner_key is null or owner_key = 'default';
