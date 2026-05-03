import type { Metadata } from 'next';
import { CampoGrandePage } from '../../views/CampoGrandePage';

export const metadata: Metadata = {
  title: 'Insulfilm em Campo Grande RJ | Residencial e Comercial - LUME',
  description: 'Instalação de insulfilm residencial e comercial em Campo Grande, Rio de Janeiro. Proteção contra calor e privacidade total. Atendimento local e garantia.',
  keywords: [
    'insulfilm em campo grande rj',
    'insulfilm residencial campo grande',
    'aplicação de insulfilm campo grande',
    'insulfilm automotivo campo grande',
    'melhor insulfilm campo grande'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande/' },
  openGraph: {
    title: 'Insulfilm em Campo Grande RJ | LUME Controle Solar',
    description: 'Especialistas em insulfilm em Campo Grande. Proteção contra o calor carioca com garantia de 5 anos. Orçamento grátis no local.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/campogrande_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Campo Grande RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Campo Grande RJ | LUME Controle Solar',
    description: 'Proteção contra calor e privacidade total em Campo Grande. Garantia de 5 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/campogrande_hero_bg.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande/#localbusiness',
      'name': 'LUME Controle Solar - Campo Grande',
      'image': 'https://lumecontrolesolar.com.br/campogrande_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande/',
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
        'name': 'Campo Grande'
      }
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm em Campo Grande',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Campo Grande'
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
      <CampoGrandePage />
    </>
  );
}
