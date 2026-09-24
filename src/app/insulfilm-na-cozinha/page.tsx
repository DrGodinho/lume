import type { Metadata } from 'next';
import { InsulfilmCozinha } from '../../views/InsulfilmCozinha';
import { cozinhaFaqs } from '@/content/cozinhaFaq';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm para Cozinha no RJ | Redução de Calor e Divisórias a partir de R$ 280 - LUME',
  description:
    'Películas térmicas e jateadas para janelas de cozinha e divisórias de lavanderia no Rio de Janeiro. Redução de até 82% do calor sem perder a claridade natural e proteção para armários e eletrodomésticos. Janelas a partir de R$ 280 ~ R$ 350.',
  keywords: [
    'insulfilm para cozinha',
    'quanto custa insulfilm cozinha',
    'pelicula para janela de cozinha rj',
    'insulfilm divisoria lavanderia',
    'pelicula jateada lavanderia cozinha',
    'nano ceramica cozinha',
    'reduzir calor cozinha sol',
    'insulfilm cozinha rio de janeiro'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-cozinha/' },
  openGraph: {
    title: 'Insulfilm para Cozinha no RJ | Conforto Térmico e Claridade',
    description:
      'Cozinhe com conforto e frescor! Películas de alta performance térmica e divisórias elegantes para lavanderia. Instalação rápida a partir de R$ 280.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-cozinha/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Cozinha - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Cozinha | LUME Controle Solar RJ',
    description:
      'Mais conforto na sua cozinha: bloqueio térmico sem perder luz e divisórias jateadas para lavanderia a partir de R$ 280 ~ R$ 350.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Soluções por Cômodo', url: 'https://lumecontrolesolar.com.br/#produtos' },
      { name: 'Insulfilm na Cozinha', url: 'https://lumecontrolesolar.com.br/insulfilm-na-cozinha/' },
    ]),
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm para Cozinhas e Áreas de Serviço',
      alternateName: 'Película Térmica e Jateada para Cozinha',
      description:
        'Instalação profissional de películas de controle solar de alta transparência (Nano Cerâmica) e películas decorativas jateadas em cozinhas residenciais e divisórias de lavanderia no Rio de Janeiro. Reduz o calor extremo, protege armários planejados contra raios UV e esconde varais de roupas com elegância. Garantia de 2 anos.',
      url: 'https://lumecontrolesolar.com.br/insulfilm-na-cozinha/',
      image: 'https://lumecontrolesolar.com.br/og-image.jpg',
      provider: {
        '@type': 'LocalBusiness',
        name: 'LUME Controle Solar',
        url: 'https://lumecontrolesolar.com.br',
        telephone: businessInfo.phoneE164,
        address: businessAddressSchema,
      },
      areaServed: [
        { '@type': 'City', name: 'Rio de Janeiro' },
        { '@type': 'AdministrativeArea', name: 'Barra da Tijuca' },
        { '@type': 'AdministrativeArea', name: 'Recreio dos Bandeirantes' },
        { '@type': 'AdministrativeArea', name: 'Jacarepaguá' },
        { '@type': 'AdministrativeArea', name: 'Campo Grande' },
        { '@type': 'AdministrativeArea', name: 'Zona Sul' }
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '280.00',
        highPrice: '780.00',
        offerCount: '3',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'LocalBusiness',
          name: 'LUME Controle Solar',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '98',
        bestRating: '5',
        worstRating: '1',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Rejeição de Calor Infravermelho', value: 'Até 82%' },
        { '@type': 'PropertyValue', name: 'Bloqueio de Raios UV', value: '99%' },
        { '@type': 'PropertyValue', name: 'Transparência Visual', value: 'Alta (sem escurecer)' },
        { '@type': 'PropertyValue', name: 'Tempo Médio de Aplicação', value: '1h a 2h' },
        { '@type': 'PropertyValue', name: 'Garantia', value: '2 Anos' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: cozinhaFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsulfilmCozinha />
    </>
  );
}
