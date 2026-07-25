-- Migration to add archived column to leads table
-- Run this migration on the Supabase database.

ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for archived status to optimize performance
CREATE INDEX IF NOT EXISTS leads_archived_idx
  ON public.leads (archived);
