import type { Metadata } from 'next';
import { CarbonoPage } from '../../views/Carbono';

export const metadata: Metadata = {
  title: 'Película de Carbono Premium | Privacidade e Controle Solar',
  description: 'Película de Carbono Premium com visual grafite sofisticado, rejeição térmica de até 80% e estabilidade de cor garantida. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/carbono' },
  openGraph: {
    title: 'Película de Carbono Premium | Privacidade e Redução de Calor - LUME',
    description: 'Visual grafite sofisticado com rejeição térmica de até 80%. A película que une estética e performance no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/carbono',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/carbono-hero.webp', width: 1200, height: 630, alt: 'Película de Carbono Premium LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película de Carbono Premium | LUME Controle Solar',
    description: 'Visual grafite sofisticado com rejeição térmica de até 80%. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/carbono-hero.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
  name: 'Película de Carbono Premium LUME',
  image: 'https://lumecontrolesolar.com.br/carbono-hero.webp',
  description: 'Película de carbono profissional com visual grafite sofisticado, rejeição térmica de até 80% e bloqueio de 99% dos raios UV. Garantia de 5 anos.',
  brand: {
    '@type': 'Brand',
    name: 'LUME Controle Solar'
  },
  offers: {
    '@type': 'Offer',
    url: 'https://lumecontrolesolar.com.br/carbono',
    priceCurrency: 'BRL',
    price: '80.00',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '80.00',
      priceCurrency: 'BRL',
      unitText: 'm²'
    },
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'LocalBusiness',
      name: 'LUME Controle Solar',
      image: 'https://lumecontrolesolar.com.br/logo-lume.png',
      telephone: '+5521965140612',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Estrada do Realengo, 973',
        addressLocality: 'Bangu',
        addressRegion: 'RJ',
        addressCountry: 'BR'
      }
    }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '28',
    bestRating: '5'
  },
  review: [
    {
      '@type': 'Review',
      'author': { '@type': 'Person', 'name': 'Carlos Mendes' },
      'datePublished': '2025-01-15',
      'reviewBody': 'Trabalho impecável! Instalaram a película no meu apartamento e a redução de calor foi imediata.',
      'reviewRating': { '@type': 'Rating', 'ratingValue': '5' }
    },
    {
      '@type': 'Review',
      'author': { '@type': 'Person', 'name': 'Mariana Silva' },
      'datePublished': '2025-02-01',
      'reviewBody': 'A LUME me passou muita confiança. Ficou lindo e muito privativo.',
      'reviewRating': { '@type': 'Rating', 'ratingValue': '5' }
    }
  ]
},
{
  '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'A película Carbono G5 tira a visão de dentro para fora à noite?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A linha Carbono Premium possui excelente nitidez ótica. No entanto, por ser um grau muito escuro (G5), a visibilidade noturna para fora é reduzida. Recomendamos o Carbono G20 para quem prioriza visão noturna perfeita.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Qual a diferença entre o Insulfilm Carbono e o filme comum?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'O filme comum desbota e fica roxo em poucos meses. O Carbono Premium possui estabilidade de cor permanente e oferece uma rejeição de calor muito superior (até 80%).'
          }
        }
      ]
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
      <CarbonoPage />
    </>
  );
}
