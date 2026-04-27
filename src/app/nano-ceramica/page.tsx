import type { Metadata } from 'next';
import { NanoCeramicaPage } from '../../views/NanoCeramica';

export const metadata: Metadata = {
  title: 'Película Nano Cerâmica | Rejeição de 97% do Calor IR - LUME',
  description: 'Película Nano Cerâmica com rejeição de até 97% do calor infravermelho. Transparência máxima, bloqueio UV 99% e garantia de 5 anos. Orçamento grátis pelo WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/nano-ceramica' },
  openGraph: {
    title: 'Película Nano Cerâmica | Rejeição de 97% do Calor IR - LUME',
    description: 'A tecnologia mais avançada em controle solar. Rejeita 97% do calor com transparência total. Instalação profissional no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/nano-ceramica',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/nano-ceramica-hero.webp', width: 1200, height: 630, alt: 'Película Nano Cerâmica LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Nano Cerâmica | LUME Controle Solar',
    description: 'Rejeita 97% do calor infravermelho com transparência total. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/nano-ceramica-hero.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Película Nano Cerâmica',
  alternateName: 'Insulfilm Nano Cerâmica',
  description: 'Instalação profissional de película nano cerâmica com rejeição de até 97% do calor infravermelho, bloqueio de 99% dos raios UV e transparência máxima. Tecnologia sem metais que não interfere em sinais de GPS, celular ou Wi-Fi.',
  url: 'https://lumecontrolesolar.com.br/nano-ceramica',
  image: 'https://lumecontrolesolar.com.br/nano-ceramica-hero.webp',
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
    price: '220',
    priceCurrency: 'BRL',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '220',
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
    name: 'Especificações Técnicas - Nano Cerâmica',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rejeição de Calor Infravermelho (IRR)', description: 'Até 97%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bloqueio UV', description: '99%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transmissão de Luz (VLT)', description: '40% a 70%' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'TSER (Rejeição Solar Total)', description: 'Até 85%' } },
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
      <NanoCeramicaPage />
    </>
  );
}
