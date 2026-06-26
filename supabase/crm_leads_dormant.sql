ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS dormant boolean NOT NULL DEFAULT false;
