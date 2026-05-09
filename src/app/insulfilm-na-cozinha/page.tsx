import type { Metadata } from 'next';
import { InsulfilmCozinha } from '../../views/InsulfilmCozinha';

export const metadata: Metadata = {
  title: 'Insulfilm para Cozinha | Conforto e Proteção UV - LUME',
  description: 'Películas de controle solar perfeitas para cozinhas. Reduza o calor sem perder a claridade, proteja seus móveis planejados e tenha mais conforto no preparo de refeições.',
  keywords: [
    'insulfilm para cozinha',
    'pelicula para vidro de cozinha',
    'redução de calor na cozinha',
    'proteger moveis do sol',
    'pelicula nanoceramica cozinha',
    'insulfilm jateado cozinha',
    'lume controle solar'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-cozinha' },
  openGraph: {
    title: 'Insulfilm para Cozinha | Conforto e Proteção Térmica',
    description: 'Transforme o ambiente da sua cozinha. Películas avançadas que reduzem o calor e protegem móveis sem escurecer o ambiente. Orçamento grátis.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-cozinha',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Cozinha - LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Cozinha | LUME Controle Solar',
    description: 'Conforto térmico no coração da sua casa. Redução de calor sem perda de luminosidade.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Insulfilm para Cozinhas',
  alternateName: 'Película de Controle Solar para Cozinha',
  description: 'Instalação profissional de películas de alta performance em cozinhas residenciais. Ideal para reduzir calor, proteger eletrodomésticos e móveis planejados dos raios UV sem perder a iluminação natural. Instalação rápida e higiênica.',
  url: 'https://lumecontrolesolar.com.br/insulfilm-na-cozinha',
  image: 'https://lumecontrolesolar.com.br/og-image.jpg',
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
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'LocalBusiness',
      name: 'LUME Controle Solar',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '19',
    bestRating: '5',
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Proteção UV', value: 'Até 99%' },
    { '@type': 'PropertyValue', name: 'Rejeição de Calor', value: 'Alta Performance Térmica' },
    { '@type': 'PropertyValue', name: 'Tipos Recomendados', value: 'Nano Cerâmica e Jateada' },
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsulfilmCozinha />
    </>
  );
}
