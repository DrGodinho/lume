import type { Metadata } from 'next';
import { GuiaInsulfilm } from '../../views/GuiaInsulfilm';

export const metadata: Metadata = {
  title: 'Guia de Insulfilm Residencial 2026 | LUME Controle Solar',
  description: 'Guia definitivo sobre insulfilm residencial: tipos, preços, vantagens e como escolher a melhor película para sua casa. Comparativo técnico completo.',
  keywords: [
    'guia de insulfilm residencial',
    'como escolher insulfilm',
    'tipos de películas para janelas',
    'insulfilm preço m2 rj',
    'insulfilm que não escurece',
    'melhor insulfilm para calor'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/guia-insulfilm/' },
  openGraph: {
    title: 'Guia Completo de Insulfilm Residencial 2026 | LUME',
    description: 'Tipos, preços, vantagens e como escolher a melhor película para sua casa. O guia técnico mais completo sobre insulfilm no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/guia-insulfilm/',
    type: 'article',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/hero-bg.webp', width: 1200, height: 630, alt: 'Guia Completo de Insulfilm Residencial LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guia Completo de Insulfilm 2026 | LUME Controle Solar',
    description: 'Tudo sobre insulfilm residencial: tipos, preços e como escolher. Guia técnico completo.',
    images: ['https://lumecontrolesolar.com.br/hero-bg.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      'headline': 'Guia de Insulfilm Residencial 2026 | LUME Controle Solar',
      'description': 'Guia definitivo sobre insulfilm residencial: tipos, preços, vantagens e como escolher a melhor película para sua casa.',
      'image': 'https://lumecontrolesolar.com.br/hero-bg.webp',
      'author': {
        '@type': 'Organization',
        'name': 'LUME Controle Solar'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'LUME Controle Solar',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://lumecontrolesolar.com.br/novo-logo-lume.png'
        }
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'No inverno, a casa fica gelada com insulfilm?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Como o filme barra o calor do sol, no inverno ele também vai reduzir o ganho térmico solar. A boa notícia é que películas de alto padrão também possuem propriedades de isolamento que ajudam a reter o calor gerado dentro de casa.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Insulfilm realmente economiza energia elétrica?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Sim. Ao bloquear até 80% do calor na janela, o ambiente resfria mais rápido e o motor do ar-condicionado trabalha menos, reduzindo o consumo de energia em até 30%.'
          }
        },
        {
          '@type': 'Question',
          'name': 'O insulfilm vai deixar minha casa escura?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Não necessariamente. Películas de alta tecnologia, como as de Nano Cerâmica, conseguem filtrar seletivamente a radiação infravermelha, retendo o calor enquanto deixam a luz natural passar quase que totalmente.'
          }
        },
        {
          '@type': 'Question',
          'name': 'O insulfilm protege contra desbotamento de móveis?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Sim, bloqueando 99% do UV e a maior parte do calor, o filme retarda o desbotamento em muitas vezes, protegendo pisos, estofados e quadros.'
          }
        },
        {
          '@type': 'Question',
          'name': 'À noite, as pessoas conseguem ver dentro de casa com insulfilm?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Sim. O efeito de privacidade baseia-se na diferença de iluminação. À noite, se você acender a luz interna, o interior fica mais claro que o exterior e o efeito se inverte, sendo necessário o uso de cortinas.'
          }
        }
      ]
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuiaInsulfilm />
    </>
  );
}
