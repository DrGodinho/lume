import type { Metadata } from 'next';
import { InsulfilmPortasVidro } from '../../views/InsulfilmPortasVidro';
import { portasVidroFaqs } from '@/content/portasVidroFaq';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

const pageUrl = 'https://lumecontrolesolar.com.br/insulfilm-para-portas-de-vidro/';
const title = 'Insulfilm para Portas de Vidro no RJ | Térmico e Privacidade a partir de R$ 380 - LUME';
const description =
  'Instalação de insulfilm para portas de vidro residenciais e comerciais no Rio de Janeiro. Redução de calor, privacidade 24h, películas de segurança e controle solar. Portas de 2 folhas a partir de R$ 380 e portas balcão a partir de R$ 650.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'insulfilm para portas de vidro',
    'quanto custa insulfilm porta de vidro',
    'película para porta de vidro rj',
    'insulfilm residencial para porta de vidro',
    'película jateada para porta de vidro',
    'insulfilm para porta de varanda',
    'película de privacidade para porta de vidro',
    'insulfilm para porta blindex',
    'insulfilm para portas comerciais',
    'insulfilm porta de vidro Rio de Janeiro',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Insulfilm para portas de vidro instalado pela LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Insulfilm para Portas de Vidro',
  alternateName: [
    'Película para porta de vidro',
    'Película de privacidade para porta de vidro',
    'Insulfilm para porta blindex',
  ],
  description,
  url: pageUrl,
  image: 'https://lumecontrolesolar.com.br/og-image.jpg',
  serviceType: 'Instalação de películas para portas de vidro residenciais e comerciais',
  provider: {
    '@type': 'LocalBusiness',
    name: 'LUME Controle Solar',
    url: 'https://lumecontrolesolar.com.br',
    telephone: businessInfo.phoneE164,
    address: businessAddressSchema,
  },
  areaServed: [
    { '@type': 'Place', name: 'Bangu' },
    { '@type': 'Place', name: 'Campo Grande' },
    { '@type': 'Place', name: 'Realengo' },
    { '@type': 'Place', name: 'Jacarepaguá' },
    { '@type': 'Place', name: 'Barra da Tijuca' },
    { '@type': 'Place', name: 'Recreio dos Bandeirantes' },
    { '@type': 'City', name: 'Rio de Janeiro' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'BRL',
    lowPrice: '380.00',
    highPrice: '980.00',
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
    reviewCount: '142',
    bestRating: '5',
    worstRating: '1',
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Garantia', value: '2 anos' },
    { '@type': 'PropertyValue', name: 'Proteção UV', value: 'Até 99%' },
    { '@type': 'PropertyValue', name: 'Rejeição de Calor', value: 'Até 82%' },
    { '@type': 'PropertyValue', name: 'Aplicação', value: 'Residencial e comercial' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: portasVidroFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  ...buildBreadcrumbSchema([
    { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
    { name: 'Portas de Vidro', url: pageUrl },
  ]),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <InsulfilmPortasVidro />
    </>
  );
}
