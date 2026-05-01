import type { Metadata } from 'next';
import { CarbonoPage } from '../../views/Carbono';

export const metadata: Metadata = {
  title: 'Película de Carbono Premium | Privacidade e Controle Solar',
  description: 'Película de Carbono Premium com visual grafite sofisticado, rejeição térmica de até 80% e estabilidade de cor garantida. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/carbono' },
  openGraph: {
    title: 'Película de Carbono Premium | Privacidade e Redução de Calor - LUME',
    description: 'Visual grafite sofisticado com rejeição térmica de até 80%. A película que une estética e performance no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/carbono',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/carbono-hero.webp', width: 1200, height: 630, alt: 'Película de Carbono Premium LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película de Carbono Premium | LUME Controle Solar',
    description: 'Visual grafite sofisticado com rejeição térmica de até 80%. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/carbono-hero.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Película de Carbono Premium',
  alternateName: 'Insulfilm de Carbono',
  description: 'Instalação profissional de película de carbono com visual grafite sofisticado, rejeição térmica de até 80%, estabilidade de cor garantida sem desbotar e bloqueio de 99% dos raios UV. Sem efeito metálico e sem interferência em sinais.',
  url: 'https://lumecontrolesolar.com.br/carbono',
  image: 'https://lumecontrolesolar.com.br/carbono-hero.webp',
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
    price: '80',
    priceCurrency: 'BRL',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '80',
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
    name: 'Especificações Técnicas - Carbono Premium',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rejeição de Calor Infravermelho (IRR)', description: 'Até 80%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bloqueio UV', description: '99%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transmissão de Luz (VLT)', description: '5% a 50%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'TSER (Rejeição Solar Total)', description: 'Até 70%' } },
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
      <CarbonoPage />
    </>
  );
}
