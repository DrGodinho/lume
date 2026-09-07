-- Bairro do cliente no rascunho e no historico da calculadora.
-- As rotas ja tratam a ausencia da coluna (retry sem ela), mas com a coluna
-- o bairro passa a sincronizar entre aparelhos e a sobreviver no historico.
alter table public.calculator_draft
  add column if not exists neighborhood text;

alter table public.calculator_history
  add column if not exists neighborhood text;
