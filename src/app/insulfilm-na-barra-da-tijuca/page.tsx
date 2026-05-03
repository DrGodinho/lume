import type { Metadata } from 'next';
import { BarraPage } from '../../views/BarraPage';

export const metadata: Metadata = {
  title: 'Insulfilm na Barra da Tijuca RJ | Residencial e Comercial - LUME',
  description: 'Instalação de insulfilm de alta performance na Barra da Tijuca. Películas nano cerâmica, carbono e espelhadas para o seu conforto. Orçamento gratuito.',
  keywords: [
    'insulfilm barra da tijuca',
    'insulfilm barra rj',
    'insulfilm residencial barra da tijuca',
    'insulfilm comercial barra da tijuca',
    'nano cerâmica barra da tijuca',
    'insulfilm condomínio barra'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/' },
  openGraph: {
    title: 'Insulfilm na Barra da Tijuca RJ | LUME Controle Solar',
    description: 'Películas de alta performance na Barra da Tijuca. Nano cerâmica, carbono e espelhadas. Instalação profissional com garantia de 5 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/barra_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm na Barra da Tijuca RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Barra da Tijuca RJ | LUME Controle Solar',
    description: 'Películas premium na Barra da Tijuca. Nano cerâmica, carbono e espelhadas. Orçamento gratuito.',
    images: ['https://lumecontrolesolar.com.br/barra_hero_bg.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/#localbusiness',
      'name': 'LUME Controle Solar - Barra da Tijuca',
      'image': 'https://lumecontrolesolar.com.br/barra_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/',
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
        'name': 'Barra da Tijuca'
      }
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm na Barra da Tijuca',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Barra da Tijuca'
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
      <BarraPage />
    </>
  );
}
