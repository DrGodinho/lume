-- Auto-save da Calculadora LUME: colunas de expiracao/timestamp
-- 1. calculator_draft.last_saved -> registra quando o rascunho foi salvo
--    (usado para retomar apenas rascunhos recentes)
alter table public.calculator_draft
  add column if not exists last_saved bigint;

-- 2. calculator_config.draft_expiration -> tempo (min) para expirar o auto-save
--    (0 = desligado)
alter table public.calculator_config
  add column if not exists draft_expiration integer default 15;