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
  '@type': 'Product',
  name: 'Película de Carbono Premium LUME',
  image: 'https://lumecontrolesolar.com.br/carbono-hero.webp',
  description: 'Película de carbono profissional com visual grafite sofisticado, rejeição térmica de até 80% e bloqueio de 99% dos raios UV. Garantia de 5 anos.',
  brand: {
    '@type': 'Brand',
    name: 'LUME Controle Solar',
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
      unitText: 'm²',
    },
    availability: 'https://schema.org/InStock',
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      merchantReturnDays: 0,
      applicableCountry: 'BR',
    },
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
        addressCountry: 'BR',
      },
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '22',
    bestRating: '5',
  },
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
