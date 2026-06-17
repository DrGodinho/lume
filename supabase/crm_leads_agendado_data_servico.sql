ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS data_servico date,
  ADD COLUMN IF NOT EXISTS proximo_contato timestamptz,
  ADD COLUMN IF NOT EXISTS service_status text,
  ADD COLUMN IF NOT EXISTS status_changed_at date,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

UPDATE public.leads
SET status_changed_at = COALESCE(status_changed_at, created_at::date)
WHERE status_changed_at IS NULL;

UPDATE public.leads
SET updated_at = COALESCE(updated_at, created_at::timestamptz, now())
WHERE updated_at IS NULL;

UPDATE public.leads
SET service_status = CASE
  WHEN status = 'Fechado' AND data_servico IS NOT NULL THEN 'Concluido'
  WHEN data_servico IS NOT NULL THEN 'Marcado'
  ELSE service_status
END
WHERE service_status IS NULL;

UPDATE public.leads
SET status = 'Agendado'
WHERE status = 'Proposta Enviada';
