insert into public.blog_posts (
  title,
  slug,
  excerpt,
  category,
  tags,
  cover_image_url,
  cover_image_alt,
  status,
  published_at,
  featured,
  seo_title,
  seo_description,
  content
) values (
  'Guia de insulfilm residencial: como escolher a pelicula ideal',
  'guia-insulfilm-residencial',
  'Um guia pratico para entender tipos de pelicula, reducao de calor, privacidade, protecao UV, durabilidade e cuidados antes de comprar insulfilm residencial.',
  'Guias',
  array['guia de insulfilm', 'insulfilm residencial', 'pelicula de controle solar', 'protecao UV', 'privacidade'],
  'https://lumecontrolesolar.com.br/hero-bg.webp',
  'Guia de insulfilm residencial da LUME Controle Solar',
  'draft',
  now(),
  true,
  'Guia de Insulfilm Residencial | LUME Controle Solar',
  'Veja como escolher insulfilm residencial considerando calor, privacidade, protecao UV, claridade, preco e durabilidade.',
  '[
    {
      "type": "paragraph",
      "text": "Escolher insulfilm residencial nao e apenas decidir se o vidro vai ficar claro, escuro ou espelhado. A melhor escolha depende da posicao do sol, do nivel de calor, da necessidade de privacidade, da claridade desejada e do tipo de ambiente."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "O que e insulfilm?"
    },
    {
      "type": "paragraph",
      "text": "Tecnicamente, o insulfilm e uma pelicula de controle solar aplicada sobre o vidro. Ela ajuda a filtrar parte da radiacao solar, reduzir calor, bloquear raios UV, melhorar privacidade e proteger moveis, pisos e cortinas contra desbotamento."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Conforto termico e economia"
    },
    {
      "type": "paragraph",
      "text": "No Rio de Janeiro, o calor e um dos principais motivos para instalar pelicula residencial. Quando o sol bate diretamente no vidro, o ambiente pode virar uma estufa. Peliculas de alta performance reduzem essa entrada de calor e ajudam o ar-condicionado a trabalhar menos."
    },
    {
      "type": "callout",
      "title": "Dica tecnica",
      "text": "Peliculas mais escuras nem sempre sao as mais eficientes contra calor. Linhas como nano ceramica podem entregar alta rejeicao de infravermelho mantendo boa passagem de luz natural."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Protecao UV para moveis, pisos e pele"
    },
    {
      "type": "paragraph",
      "text": "Uma pelicula residencial de qualidade pode bloquear ate 99% dos raios UV. Isso ajuda a retardar o desbotamento de pisos, estofados, cortinas e objetos de decoracao, alem de reduzir a exposicao diaria da pele ao sol que entra pela janela."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Privacidade durante o dia"
    },
    {
      "type": "paragraph",
      "text": "Peliculas refletivas ou mais escuras podem criar privacidade durante o dia, principalmente quando o lado externo esta mais claro que o lado interno. A noite, com a luz acesa dentro de casa, esse efeito pode se inverter; por isso a escolha precisa considerar o uso real do ambiente."
    },
    {
      "type": "card_grid",
      "title": "Recomendacoes por ambiente",
      "text": "Cada comodo tem uma necessidade diferente. Use estes caminhos como ponto de partida antes da avaliacao tecnica.",
      "cards": [
        {
          "title": "Cozinha",
          "tag": "Calor e luminosidade",
          "text": "Nano ceramica ajuda a reduzir calor sem deixar o ambiente escuro. Jateado pode ser bom quando ha necessidade de privacidade.",
          "href": "/insulfilm-na-cozinha/",
          "label": "Ver cozinha"
        },
        {
          "title": "Quarto",
          "tag": "Conforto e descanso",
          "text": "Dupla camada e carbono sao boas opcoes quando o objetivo e escurecer, reduzir calor e melhorar a privacidade.",
          "href": "/insulfilm-no-quarto/",
          "label": "Ver quarto"
        },
        {
          "title": "Banheiro",
          "tag": "Privacidade",
          "text": "A linha jateada costuma funcionar muito bem porque garante privacidade sem bloquear totalmente a luz natural.",
          "href": "/insulfilm-no-banheiro/",
          "label": "Ver banheiro"
        },
        {
          "title": "Sala",
          "tag": "Equilibrio",
          "text": "Nano ceramica, refletiva ou carbono podem fazer sentido dependendo da intensidade do sol, da vista e do nivel de privacidade desejado.",
          "href": "/insulfilm-na-sala/",
          "label": "Ver sala"
        }
      ]
    },
    {
      "type": "comparison_table",
      "title": "Comparativo rapido das peliculas",
      "text": "Os numeros variam conforme fabricante, linha e tonalidade, mas este comparativo ajuda a entender a funcao de cada tecnologia.",
      "columns": ["Luz", "UV", "Calor", "Uso indicado"],
      "rows": [
        {
          "title": "Nano Ceramica",
          "href": "/nano-ceramica/",
          "values": ["Alta", "Ate 99%", "Muito alto", "Reducao de calor mantendo claridade"]
        },
        {
          "title": "Dupla Camada",
          "href": "/dupla-camada/",
          "values": ["Baixa a media", "Ate 99%", "Alto", "Quartos, privacidade e escurecimento"]
        },
        {
          "title": "Carbono",
          "href": "/carbono/",
          "values": ["Baixa a media", "Ate 99%", "Medio", "Custo-beneficio e visual escuro"]
        },
        {
          "title": "Refletiva",
          "href": "/refletiva/",
          "values": ["Variavel", "Ate 99%", "Alto", "Privacidade diurna e controle solar"]
        },
        {
          "title": "Jateada",
          "href": "/jateado/",
          "values": ["Media a alta", "Ate 99%", "Baixo", "Privacidade decorativa"]
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "4. Durabilidade e cuidados"
    },
    {
      "type": "list",
      "items": [
        "Evite limpar os vidros nos primeiros dias apos a instalacao.",
        "Use pano de microfibra, agua e sabao neutro.",
        "Nao use produtos com amonia nem esponjas abrasivas.",
        "Peliculas de baixa qualidade podem formar bolhas, desbotar ou ficar roxas com o tempo."
      ]
    },
    {
      "type": "faq",
      "items": [
        {
          "question": "Insulfilm deixa a casa escura?",
          "answer": "Nao necessariamente. Existem peliculas claras de alta performance que reduzem bastante calor sem bloquear tanta luz visivel."
        },
        {
          "question": "Insulfilm realmente economiza energia?",
          "answer": "Pode ajudar. Ao reduzir a entrada de calor pelo vidro, o ar-condicionado tende a trabalhar menos para manter o ambiente confortavel."
        },
        {
          "question": "A pelicula protege moveis contra desbotamento?",
          "answer": "Sim. O bloqueio de UV e a reducao de calor retardam o desbotamento de pisos, cortinas, estofados e objetos decorativos."
        },
        {
          "question": "Da para ter privacidade a noite?",
          "answer": "A privacidade depende da diferenca de iluminacao. A noite, se a luz interna estiver acesa, pode ser necessario usar cortina junto com a pelicula."
        }
      ]
    },
    {
      "type": "cta",
      "title": "Quer escolher a pelicula certa para sua casa?",
      "text": "Envie uma foto do ambiente e conte qual e o problema principal: calor, privacidade, claridade ou seguranca.",
      "href": "https://wa.me/5521965140612?text=Ola! Li o guia de insulfilm residencial e quero ajuda para escolher a pelicula ideal.",
      "label": "Falar com especialista"
    }
  ]'::jsonb
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  category = excluded.category,
  tags = excluded.tags,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  featured = excluded.featured,
  content = excluded.content,
  updated_at = now();
