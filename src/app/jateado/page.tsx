import type { Metadata } from 'next';
import { JateadoPage } from '../../views/Jateado';

export const metadata: Metadata = {
  title: 'Película Jateada Fosca | Privacidade Decorativa - LUME',
  description: 'Película jateada fosca para privacidade total em banheiros e divisórias. Efeito vidro jateado com custo acessível. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/jateado' },
  openGraph: {
    title: 'Película Jateada Fosca | Privacidade Decorativa - LUME',
    description: 'Privacidade total em banheiros e divisórias sem escurecer o ambiente. Efeito vidro jateado com acabamento sofisticado e fácil limpeza.',
    url: 'https://lumecontrolesolar.com.br/jateado',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/product-jateado-v2.webp', width: 1200, height: 630, alt: 'Película Jateada Fosca LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Jateada Fosca | LUME Controle Solar',
    description: 'Privacidade total sem escurecer o ambiente. Ideal para banheiros e divisórias. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/product-jateado-v2.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Película Jateada Fosca',
  alternateName: 'Insulfilm Jateado',
  description: 'Instalação profissional de película jateada fosca para privacidade total sem escurecer o ambiente. Ideal para boxes de banheiro, divisórias de escritório e portas de vidro. Alta transmissão de luz com bloqueio visual 100%. Fácil limpeza e acabamento sofisticado.',
  url: 'https://lumecontrolesolar.com.br/jateado',
  image: 'https://lumecontrolesolar.com.br/product-jateado-v2.webp',
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
    price: '90',
    priceCurrency: 'BRL',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '90',
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
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Transmissão de Luz (VLT)', value: '50% a 85%' },
    { '@type': 'PropertyValue', name: 'Bloqueio UV', value: '99%' },
    { '@type': 'PropertyValue', name: 'Privacidade Visual', value: '100% (bloqueio total da visão)' },
    { '@type': 'PropertyValue', name: 'Aplicação', value: 'Banheiros, divisórias, portas de vidro' },
  ],
  termsOfService: 'Garantia de 5 anos contra bolhas e descolamento.',
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
      <JateadoPage />
    </>
  );
}
