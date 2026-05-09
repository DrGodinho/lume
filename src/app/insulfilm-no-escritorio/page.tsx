import type { Metadata } from 'next';
import { InsulfilmEscritorio } from '../../views/InsulfilmEscritorio';

export const metadata: Metadata = {
  title: 'Insulfilm para Escritório | Conforto e Produtividade - LUME',
  description: 'Películas de controle solar para escritórios, home office e salas comerciais no Rio de Janeiro. Elimine o glare nas telas, reduza o calor e economize energia com instalação profissional LUME.',
  keywords: [
    'insulfilm para escritório',
    'película para vidro de escritório',
    'insulfilm home office',
    'redução de calor escritório',
    'anti glare película',
    'insulfilm sala comercial',
    'película jateada divisória',
    'insulfilm nanoceramica escritório',
    'lume controle solar'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-escritorio' },
  openGraph: {
    title: 'Insulfilm para Escritório | Produtividade e Conforto Térmico',
    description: 'Transforme seu escritório em um ambiente produtivo. Películas que eliminam o glare, reduzem o calor e protegem equipamentos. Orçamento grátis no RJ.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-escritorio',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Escritório - LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Escritório | LUME Controle Solar',
    description: 'Produtividade máxima com conforto térmico. Eliminação de glare e redução de calor para ambientes de trabalho.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Instalação de Insulfilm para Escritórios',
  alternateName: 'Película de Controle Solar para Escritório e Home Office',
  description: 'Instalação profissional de películas de alta performance em escritórios, salas comerciais e home offices. Ideal para eliminar glare em monitores, reduzir calor, economizar energia e garantir privacidade em divisórias de vidro. Instalação rápida sem interrupção do expediente.',
  url: 'https://lumecontrolesolar.com.br/insulfilm-no-escritorio',
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
    reviewCount: '47',
    bestRating: '5',
    worstRating: '1',
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Proteção UV', value: 'Até 99%' },
    { '@type': 'PropertyValue', name: 'Rejeição de Calor', value: 'Alta Performance Térmica' },
    { '@type': 'PropertyValue', name: 'Tipos Recomendados', value: 'Nano Cerâmica, Jateada e Carbono G20' },
    { '@type': 'PropertyValue', name: 'Aplicação', value: 'Escritórios, Home Office, Salas Comerciais e Divisórias de Vidro' },
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsulfilmEscritorio />
    </>
  );
}
