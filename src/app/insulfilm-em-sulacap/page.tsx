import type { Metadata } from 'next';
import { SulacapPage } from '../../views/SulacapPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Sulacap RJ | Residencial e Comercial - LUME',
  description: 'Aplicação profissional de insulfilm no Jardim Sulacap e região. Redução de calor, privacidade e proteção UV com garantia de 5 anos. Orçamento grátis no local.',
  keywords: [
    'insulfilm em sulacap',
    'insulfilm jardim sulacap rj',
    'aplicação de insulfilm sulacap',
    'insulfilm residencial sulacap',
    'insulfilm para janelas sulacap',
    'lume controle solar sulacap'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-sulacap/' },
  openGraph: {
    title: 'Insulfilm em Sulacap RJ | Residencial e Comercial - LUME',
    description: 'Aplicação profissional de insulfilm em Sulacap, Rio de Janeiro. Redução de calor, privacidade e proteção UV com garantia de 5 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-sulacap/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/hero-bg-v2.png', width: 1200, height: 630, alt: 'Insulfilm em Sulacap RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Sulacap RJ | LUME Controle Solar',
    description: 'Redução de calor, privacidade e proteção UV em Sulacap. Garantia de 5 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/hero-bg-v2.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-sulacap/#localbusiness',
      'name': 'LUME Controle Solar - Sulacap',
      'image': 'https://lumecontrolesolar.com.br/hero-bg-v2.png',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-sulacap/',
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
        'latitude': -22.8872,
        'longitude': -43.3942
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Jardim Sulacap'
      }
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm em Sulacap',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-sulacap/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Jardim Sulacap'
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
      <SulacapPage />
    </>
  );
}
