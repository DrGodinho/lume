-- Migration: Garante suporte a horário de instalação na coluna data_servico (timestamptz)
-- Permite armazenar a data do serviço com ou sem hora específica (ex: 2026-10-15T14:30:00).

DO $$
BEGIN
  -- Atualiza o tipo de data_servico em leads para timestamptz caso ainda esteja como date
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'data_servico' 
      AND data_type = 'date'
  ) THEN
    ALTER TABLE public.leads 
      ALTER COLUMN data_servico TYPE timestamptz USING (
        CASE 
          WHEN data_servico IS NULL THEN NULL 
          ELSE data_servico::timestamptz 
        END
      );
  END IF;

  -- Garante o mesmo em lead_status_info caso a tabela exista
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'lead_status_info' 
      AND column_name = 'data_servico' 
      AND data_type = 'date'
  ) THEN
    ALTER TABLE public.lead_status_info 
      ALTER COLUMN data_servico TYPE timestamptz USING (
        CASE 
          WHEN data_servico IS NULL THEN NULL 
          ELSE data_servico::timestamptz 
        END
      );
  END IF;
END $$;
