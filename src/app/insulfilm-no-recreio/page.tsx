import type { Metadata } from 'next';
import { RecreioPage } from '../../views/RecreioPage';

export const metadata: Metadata = {
  title: 'Insulfilm no Recreio RJ | Residencial e Comercial - LUME',
  description: 'Atendimento especializado em insulfilm no Recreio. Máxima rejeição de calor e proteção UV para sua casa ou apartamento. Agende uma visita técnica.',
  keywords: [
    'insulfilm recreio',
    'insulfilm recreio rj',
    'insulfilm recreio dos bandeirantes',
    'insulfilm residencial recreio',
    'insulfilm comercial recreio',
    'insulfilm condomínio recreio'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/' },
  openGraph: {
    title: 'Insulfilm no Recreio dos Bandeirantes RJ | LUME Controle Solar',
    description: 'Películas premium no Recreio. Máxima rejeição de calor e proteção UV 99% para sua casa ou apartamento. Agende uma visita técnica gratuita.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/recreio_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm no Recreio dos Bandeirantes RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Recreio RJ | LUME Controle Solar',
    description: 'Máxima rejeição de calor e proteção UV no Recreio. Visita técnica gratuita.',
    images: ['https://lumecontrolesolar.com.br/recreio_hero_bg.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/#localbusiness',
      'name': 'LUME Controle Solar - Recreio',
      'image': 'https://lumecontrolesolar.com.br/recreio_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/',
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
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Recreio dos Bandeirantes'
      }
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm no Recreio',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Recreio dos Bandeirantes'
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
      <RecreioPage />
    </>
  );
}
