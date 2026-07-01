import type { Metadata } from 'next';
import { InsulfilmQuarto } from '../../views/InsulfilmQuarto';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Insulfilm para Quarto | Escurecimento Total e Privacidade - LUME',
  description: 'Películas para quarto que proporcionam escuridão total para dormir bem e privacidade completa. Dupla Camada e Carbono G5 com instalação profissional no Rio de Janeiro.',
  keywords: [
    'insulfilm para quarto',
    'pelicula para quarto dormir',
    'escurecer quarto',
    'insulfilmdupla camada quarto',
    'carbono g5 quarto',
    'pelicula blackout quarto',
    'privacidade quarto',
    'insulfilm rio de janeiro'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-quarto' },
  openGraph: {
    title: 'Insulfilm para Quarto | Escurecimento e Privacidade Total',
    description: 'Descanso de verdade! Películas que bloqueiam luz, calor e garantem privacidade total no seu quarto. Orçamento grátis.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-quarto',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Quarto - LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Quarto | LUME Controle Solar',
    description: 'Escurecimento total e privacidade para seu quarto. Dorme em paz com a proteção certa.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Insulfilm para Quartos',
  alternateName: 'Película de Escurecimento para Quarto',
  description: 'Instalação profissional de películas de alta performance em quartos residenciais. Ideal para quem busca escuridão total, privacidade e proteção térmica para ter o melhor sono possível. Películas Dupla Camada e Carbono G5 disponíveis.',
  url: 'https://lumecontrolesolar.com.br/insulfilm-no-quarto',
  image: 'https://lumecontrolesolar.com.br/og-image.jpg',
  provider: {
    '@type': 'LocalBusiness',
    name: 'LUME Controle Solar',
    url: 'https://lumecontrolesolar.com.br',
    telephone: businessInfo.phoneE164,
    address: businessAddressSchema,
  },
  areaServed: {
    '@type': 'City',
    name: 'Rio de Janeiro',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'LocalBusiness',
      name: 'LUME Controle Solar',
    },
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Escurecimento', value: 'Até 95%' },
    { '@type': 'PropertyValue', name: 'Rejeição de Calor', value: 'Alta Performance' },
    { '@type': 'PropertyValue', name: 'Privacidade', value: 'Total 24h' },
    { '@type': 'PropertyValue', name: 'Tipos Recomendados', value: 'Dupla Camada e Carbono G5' },
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsulfilmQuarto />
    </>
  );
}
