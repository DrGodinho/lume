import type { Metadata } from 'next';
import { InsulfilmBanheiro } from '../../views/InsulfilmBanheiro';

export const metadata: Metadata = {
  title: 'Insulfilm para Banheiro | Privacidade e Luz Natural - LUME',
  description: 'Película jateada para banheiros. Tenha privacidade total sem perder a luminosidade natural. Instalação rápida, limpa e profissional no Rio de Janeiro.',
  keywords: [
    'insulfilm para banheiro',
    'pelicula jateada banheiro',
    'privacidade para box de banheiro',
    'pelicula fosca para vidro',
    'insulfilm jateado rio de janeiro',
    'película para banheiro sem obra',
    'lume controle solar'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-banheiro' },
  openGraph: {
    title: 'Insulfilm para Banheiro | Privacidade com Elegância',
    description: 'Transforme o vidro do seu banheiro com película jateada. Privacidade total, luminosidade natural e design sofisticado. Orçamento grátis.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-banheiro',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Banheiro - LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Banheiro | LUME Controle Solar',
    description: 'Privacidade total sem perder a luz natural. Película jateada profissional para banheiros.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Insulfilm para Banheiros',
  alternateName: 'Película Jateada para Banheiro',
  description: 'Instalação profissional de película jateada em vidros de banheiros residenciais. Ideal para garantir privacidade total sem perder a luminosidade natural. Instalação rápida, limpa e sem necessidade de obras.',
  url: 'https://lumecontrolesolar.com.br/insulfilm-no-banheiro',
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
    { '@type': 'PropertyValue', name: 'Privacidade', value: 'Total' },
    { '@type': 'PropertyValue', name: 'Transmissão de Luz', value: 'Alta (difusa)' },
    { '@type': 'PropertyValue', name: 'Tipo Recomendado', value: 'Película Jateada' },
    { '@type': 'PropertyValue', name: 'Resistência à Umidade', value: 'Sim, adequada para ambientes úmidos' },
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsulfilmBanheiro />
    </>
  );
}
