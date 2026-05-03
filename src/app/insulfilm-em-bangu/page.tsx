import type { Metadata } from 'next';
import { BanguPage } from '../../views/BanguPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Bangu RJ | Residencial e Comercial - LUME',
  description: 'Aplicação profissional de insulfilm em Bangu, Rio de Janeiro. Redução de calor, privacidade e proteção UV com garantia de 5 anos. Orçamento grátis no local.',
  keywords: [
    'insulfilm em bangu',
    'insulfilm bangu rj',
    'aplicação de insulfilm bangu',
    'insulfilm residencial bangu',
    'insulfilm automotivo bangu',
    'lume controle solar bangu'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/' },
  openGraph: {
    title: 'Insulfilm em Bangu RJ | Residencial e Comercial - LUME',
    description: 'Aplicação profissional de insulfilm em Bangu, Rio de Janeiro. Redução de calor, privacidade e proteção UV com garantia de 5 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/bangu_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Bangu RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Bangu RJ | LUME Controle Solar',
    description: 'Redução de calor, privacidade e proteção UV em Bangu. Garantia de 5 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/bangu_hero_bg.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/#localbusiness',
      'name': 'LUME Controle Solar - Bangu',
      'image': 'https://lumecontrolesolar.com.br/bangu_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/',
      'telephone': '+5521965140612',
      'priceRange': '$$',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Estrada do Realengo, 973',
        'addressLocality': 'Bangu',
        'addressRegion': 'RJ',
        'postalCode': '21820-000',
        'addressCountry': 'BR'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': -22.8753,
        'longitude': -43.4659
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Bangu'
      }
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm em Bangu',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Bangu'
      }
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
      <BanguPage />
    </>
  );
}
