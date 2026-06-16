ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS data_servico date;

UPDATE public.leads
SET status = 'Agendado'
WHERE status = 'Proposta Enviada';
