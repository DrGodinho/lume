import type { Metadata } from 'next';
import { JacarepaguaPage } from '../../views/JacarepaguaPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Jacarepaguá RJ | Residencial e Comercial - LUME',
  description: 'Especialistas em películas de controle solar em Jacarepaguá e região. Redução de até 80% do calor e 99% de proteção UV. Orçamento rápido via WhatsApp.',
  keywords: [
    'insulfilm em jacarepaguá',
    'insulfilm jacarepaguá rj',
    'aplicação de insulfilm jacarepaguá',
    'insulfilm residencial jacarepaguá',
    'insulfilm freguesia jacarepaguá',
    'insulfilm taquara jacarepaguá'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/' },
  openGraph: {
    title: 'Insulfilm em Jacarepaguá RJ | LUME Controle Solar',
    description: 'Películas de controle solar em Jacarepaguá. Redução de até 80% do calor e proteção UV 99%. Orçamento rápido e garantia de 5 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Jacarepaguá RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Jacarepaguá RJ | LUME Controle Solar',
    description: 'Redução de até 80% do calor em Jacarepaguá. Proteção UV 99% e garantia de 5 anos.',
    images: ['https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/#localbusiness',
      'name': 'LUME Controle Solar - Jacarepaguá',
      'image': 'https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/',
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
        'name': 'Jacarepaguá'
      }
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm em Jacarepaguá',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Jacarepaguá'
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
      <JacarepaguaPage />
    </>
  );
}
