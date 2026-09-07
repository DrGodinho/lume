import type { Metadata } from 'next';
import { GuiaInsulfilm } from '../../views/GuiaInsulfilm';
import { guiaFaqGroups } from '../../content/guiaInsulfilmFaq';

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
    title: 'Guia de Insulfilm Residencial 2026 | LUME Controle Solar',
    description: 'Tipos, preços, vantagens e como escolher a melhor película para sua casa. O guia técnico mais completo sobre insulfilm no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/guia-insulfilm/',
    type: 'article',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/hero-bg.webp', width: 1200, height: 630, alt: 'Guia Completo de Insulfilm Residencial LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guia de Insulfilm Residencial 2026 | LUME Controle Solar',
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
      'datePublished': '2026-04-20T12:00:00.000Z',
      'dateModified': '2026-08-23T12:00:00.000Z',
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
      },
      'mainEntityOfPage': 'https://lumecontrolesolar.com.br/guia-insulfilm/'
    },
    {
      // Gerado da mesma fonte dos accordions visíveis (guiaInsulfilmFaq) —
      // o schema precisa ser idêntico ao conteúdo da página.
      '@type': 'FAQPage',
      'mainEntity': guiaFaqGroups.flat().map((faq) => ({
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a,
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Início',
          'item': 'https://lumecontrolesolar.com.br/',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Guia de Insulfilm Residencial',
          'item': 'https://lumecontrolesolar.com.br/guia-insulfilm/',
        },
      ],
    },
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
