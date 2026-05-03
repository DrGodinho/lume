import type { Metadata } from 'next';
import { RealengoPage } from '../../views/RealengoPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Realengo RJ | Instalação Profissional - LUME',
  description: 'Procurando insulfilm em Realengo? A LUME oferece as melhores películas de controle solar com garantia de 5 anos. Reduza o calor e economize energia hoje!',
  keywords: [
    'insulfilm em realengo',
    'insulfilm realengo rj',
    'aplicação de insulfilm realengo',
    'insulfilm residencial realengo',
    'lume controle solar realengo',
    'insulfilm barato realengo'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/' },
  openGraph: {
    title: 'Insulfilm em Realengo RJ | LUME Controle Solar',
    description: 'As melhores películas de controle solar em Realengo. Instalação profissional, garantia de 5 anos e orçamento grátis no local.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/realengo_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Realengo RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Realengo RJ | LUME Controle Solar',
    description: 'Películas de controle solar em Realengo. Instalação profissional e garantia de 5 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/realengo_hero_bg.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/#localbusiness',
      'name': 'LUME Controle Solar - Realengo',
      'image': 'https://lumecontrolesolar.com.br/realengo_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/',
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
        'name': 'Realengo'
      }
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm em Realengo',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Realengo'
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
      <RealengoPage />
    </>
  );
}
