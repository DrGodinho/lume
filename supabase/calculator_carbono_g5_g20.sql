alter table public.calculator_config
  alter column film_types set default '{"carbono_g5":80,"carbono_g20":80,"refletiva":95,"dupla_camada":120,"nano_ceramica":220,"jateado":90}'::jsonb,
  alter column selected_film set default 'carbono_g20';

alter table public.calculator_draft
  alter column selected_film set default 'carbono_g20';

alter table public.calculator_history
  alter column selected_film set default 'carbono_g20';

update public.calculator_config
set
  film_types = jsonb_build_object(
    'carbono_g5', coalesce((film_types->>'carbono_g5')::numeric, (film_types->>'carbono')::numeric, 80),
    'carbono_g20', coalesce((film_types->>'carbono_g20')::numeric, (film_types->>'carbono')::numeric, 80),
    'refletiva', coalesce((film_types->>'refletiva')::numeric, 95),
    'dupla_camada', coalesce((film_types->>'dupla_camada')::numeric, 120),
    'nano_ceramica', coalesce((film_types->>'nano_ceramica')::numeric, 220),
    'jateado', coalesce((film_types->>'jateado')::numeric, 90)
  ),
  selected_film = case when selected_film = 'carbono' or selected_film is null then 'carbono_g20' else selected_film end,
  updated_at = now()
where id = 'default';

update public.calculator_draft
set selected_film = 'carbono_g20', updated_at = now()
where selected_film = 'carbono' or selected_film is null;

update public.calculator_history
set selected_film = 'carbono_g20'
where selected_film = 'carbono' or selected_film is null;
