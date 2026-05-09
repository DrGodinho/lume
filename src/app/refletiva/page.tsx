import type { Metadata } from 'next';
import { RefletivaPage } from '../../views/Refletiva';

export const metadata: Metadata = {
  title: 'Película Refletiva Espelhada | Privacidade Total - LUME',
  description: 'Película refletiva espelhada com rejeição brutal de calor e privacidade total durante o dia. Efeito espelhado elegante. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/refletiva' },
  openGraph: {
    title: 'Película Refletiva Espelhada | Privacidade Total - LUME',
    description: 'Rejeição de até 78% do calor e privacidade absoluta durante o dia. O clássico que derrota o calor carioca com efeito espelhado elegante.',
    url: 'https://lumecontrolesolar.com.br/refletiva',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/product-refletiva.webp', width: 1200, height: 630, alt: 'Película Refletiva Espelhada LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Refletiva Espelhada | LUME Controle Solar',
    description: 'Privacidade total e rejeição de até 78% do calor. Efeito espelhado elegante. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/product-refletiva.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
  name: 'Película Refletiva Espelhada LUME',
  image: 'https://lumecontrolesolar.com.br/product-refletiva.webp',
  description: 'Película refletiva espelhada profissional com efeito "one-way mirror". Privacidade total durante o dia e rejeição de até 78% do calor solar.',
  brand: {
    '@type': 'Brand',
    name: 'LUME Controle Solar'
  },
  offers: {
    '@type': 'Offer',
    url: 'https://lumecontrolesolar.com.br/refletiva',
    priceCurrency: 'BRL',
    price: '95.00',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '95.00',
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
    reviewCount: '31',
    bestRating: '5'
  },
  review: [
    {
      '@type': 'Review',
      'author': { '@type': 'Person', 'name': 'Mariana Silva' },
      'datePublished': '2025-02-01',
      'reviewBody': 'Fizeram a varanda com a película refletiva. Ficou lindo e muito privativo.',
      'reviewRating': { '@type': 'Rating', 'ratingValue': '5' }
    }
  ]
},
{
  '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'A película refletiva garante privacidade à noite?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'As películas refletivas funcionam por diferencial de luz. Durante o dia, quem está fora vê um espelho. À noite, se a luz interna estiver acesa, o efeito se inverte. Para privacidade total 24h, recomendamos a linha Jateada ou persianas complementares.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Quanto de calor a película refletiva consegue reduzir?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A linha refletiva é uma das mais eficientes, podendo reduzir até 87% do calor solar direto, sendo ideal para janelas que recebem sol forte o dia todo.'
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
      <RefletivaPage />
    </>
  );
}
