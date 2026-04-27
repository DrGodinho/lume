import type { Metadata } from 'next';
import { DuplaCamadaPage } from '../../views/DuplaCamada';

export const metadata: Metadata = {
  title: 'Película Dupla Camada G5 | Máxima Rejeição de Calor - LUME',
  description: 'Película Dupla Camada com camada refletiva externa e fumê interna. Máxima rejeição de calor sem reflexo interno noturno. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/dupla-camada' },
  openGraph: {
    title: 'Película Dupla Camada G5 | Máxima Rejeição de Calor - LUME',
    description: 'Camada refletiva + fumê interna: o melhor dos dois mundos. Máxima rejeição de calor sem reflexo interno à noite. Instalação no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/dupla-camada',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/product-smoke.webp', width: 1200, height: 630, alt: 'Película Dupla Camada G5 LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Dupla Camada G5 | LUME Controle Solar',
    description: 'Máxima rejeição de calor sem reflexo interno à noite. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/product-smoke.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Película Dupla Camada (G5 e G20)',
  alternateName: 'Insulfilm Dupla Camada',
  description: 'Instalação profissional de película dupla camada com tecnologia de deposição a vácuo. Camada refletiva externa que rejeita o calor e camada fumê interna que elimina o reflexo noturno. Máxima performance térmica disponível no mercado.',
  url: 'https://lumecontrolesolar.com.br/dupla-camada',
  image: 'https://lumecontrolesolar.com.br/product-smoke.webp',
  provider: {
    '@type': 'LocalBusiness',
    name: 'LUME Controle Solar',
    url: 'https://lumecontrolesolar.com.br',
    telephone: '+5521965140612',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Estrada do Realengo, 973',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
  },
  areaServed: {
    '@type': 'City',
    name: 'Rio de Janeiro',
  },
  offers: {
    '@type': 'Offer',
    price: '120',
    priceCurrency: 'BRL',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '120',
      priceCurrency: 'BRL',
      unitText: 'm²',
    },
    availability: 'https://schema.org/InStock',
    validFrom: '2025-01-01',
    seller: {
      '@type': 'LocalBusiness',
      name: 'LUME Controle Solar',
    },
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Especificações Técnicas - Dupla Camada',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rejeição de Calor Infravermelho (IRR) - G5', description: '95%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rejeição de Calor Infravermelho (IRR) - G20', description: '90%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bloqueio UV', description: '99%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'TSER G5 (Rejeição Solar Total)', description: 'Até 75%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'TSER G20 (Rejeição Solar Total)', description: 'Até 65%' } },
    ],
  },
  termsOfService: 'Garantia de 5 anos contra bolhas, descolamento e alteração de cor.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '52',
    bestRating: '5',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DuplaCamadaPage />
    </>
  );
}
