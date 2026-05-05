import type { Metadata } from 'next';
import { InsulfilmSala } from '../../views/InsulfilmSala';

export const metadata: Metadata = {
  title: 'Insulfilm para Sala | Conforto e Proteção - LUME',
  description: 'Películas para sala que reduzem reflexo na TV, diminuem gasto com ar-condicionado e valorizam o imóvel. Nano Cerâmica, Reflexiva e Carbono G20 com instalação profissional.',
  keywords: [
    'insulfilm para sala',
    'pelicula para sala de estar',
    'reduzir reflexo tv',
    'diminuir gasto ar condicionado',
    'valorizar imovel',
    'nano ceramica sala',
    'refletiva sala',
    'carbono g20 sala',
    'insulfilm sala de estar',
    'pelicula para tv sala'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-sala' },
  openGraph: {
    title: 'Insulfilm para Sala | Conforto Térmico e Visual',
    description: 'Assista TV sem reflexo, reduza o calor e valorize seu imóvel com a película certa para sua sala de estar. Orçamento grátis.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-sala',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Sala - LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Sala | LUME Controle Solar',
    description: 'Mais conforto na sua sala: menos reflexo na TV, menos gasto com ar-condicionado e valorização do imóvel.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Insulfilm para Salas de Estar',
  alternateName: 'Película de Controle Solar para Sala',
  description: 'Instalação profissional de películas de alta performance em salas de estar residenciais. Ideal para reduzir reflexo na TV, diminuir o consumo de ar-condicionado, proteger móveis do sol e valorizar o imóvel. Películas Nano Cerâmica, Reflexiva e Carbono G20 disponíveis.',
  url: 'https://lumecontrolesolar.com.br/insulfilm-na-sala',
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
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Redução de Reflexo na TV', value: 'Até 90%' },
    { '@type': 'PropertyValue', name: 'Rejeição de Calor', value: 'Alta a Muito Alta' },
    { '@type': 'PropertyValue', name: 'Proteção UV', value: 'Até 99%' },
    { '@type': 'PropertyValue', name: 'Tipos Recomendados', value: 'Nano Cerâmica, Reflexiva e Carbono G20' },
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsulfilmSala />
    </>
  );
}