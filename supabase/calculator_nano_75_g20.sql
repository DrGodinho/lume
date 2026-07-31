-- Divide a "Nano Cerâmica" em duas películas:
--   nano_ceramica      -> "Nano Cerâmica 75" (mais clara, mantém o preço atual)
--   nano_ceramica_g20  -> "Nano Cerâmica G20" (nova, padrão R$ 180/m²)
-- Mantém backward compat: a chave nano_ceramica continua existindo, então
-- configs, drafts e histórico salvos não quebram.

alter table public.calculator_config
  alter column film_types set default '{"carbono_g5":80,"carbono_g20":80,"refletiva":95,"dupla_camada":120,"nano_ceramica":220,"nano_ceramica_g20":180,"jateado":90}'::jsonb;

update public.calculator_config
set
  film_types = jsonb_build_object(
    'carbono_g5', coalesce((film_types->>'carbono_g5')::numeric, 80),
    'carbono_g20', coalesce((film_types->>'carbono_g20')::numeric, 80),
    'refletiva', coalesce((film_types->>'refletiva')::numeric, 95),
    'dupla_camada', coalesce((film_types->>'dupla_camada')::numeric, 120),
    'nano_ceramica', coalesce((film_types->>'nano_ceramica')::numeric, 220),
    'nano_ceramica_g20', coalesce((film_types->>'nano_ceramica_g20')::numeric, 180),
    'jateado', coalesce((film_types->>'jateado')::numeric, 90)
  ),
  updated_at = now()
where id = 'default';
