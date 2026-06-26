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
  '@type': 'Product',
  name: 'Película Dupla Camada G5/G20 LUME',
  image: 'https://lumecontrolesolar.com.br/product-smoke.webp',
  description: 'Película dupla camada profissional com tecnologia de deposição a vácuo. Camada refletiva externa para máxima rejeição de calor e camada fumê interna para eliminar o reflexo noturno.',
  brand: {
    '@type': 'Brand',
    name: 'LUME Controle Solar',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://lumecontrolesolar.com.br/dupla-camada',
    priceCurrency: 'BRL',
    price: '120.00',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '120.00',
      priceCurrency: 'BRL',
      unitText: 'm²',
    },
    availability: 'https://schema.org/InStock',
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      merchantReturnDays: 0,
      applicableCountry: 'BR',
    },
    seller: {
      '@type': 'LocalBusiness',
      name: 'LUME Controle Solar',
      image: 'https://lumecontrolesolar.com.br/logo-lume.png',
      telephone: '+5521965140612',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Estrada do Realengo, 973',
        addressLocality: 'Bangu',
        addressRegion: 'RJ',
        addressCountry: 'BR',
      },
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '22',
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
