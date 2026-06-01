import type { Metadata } from 'next';
import { CarbonoPage } from '../../views/Carbono';

export const metadata: Metadata = {
  title: 'PelÃ­cula de Carbono Premium | Privacidade e Controle Solar',
  description: 'PelÃ­cula de Carbono Premium com visual grafite sofisticado, rejeiÃ§Ã£o tÃ©rmica de atÃ© 80% e estabilidade de cor garantida. OrÃ§amento grÃ¡tis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/carbono' },
  openGraph: {
    title: 'PelÃ­cula de Carbono Premium | Privacidade e ReduÃ§Ã£o de Calor - LUME',
    description: 'Visual grafite sofisticado com rejeiÃ§Ã£o tÃ©rmica de atÃ© 80%. A pelÃ­cula que une estÃ©tica e performance no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/carbono',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/carbono-hero.webp', width: 1200, height: 630, alt: 'PelÃ­cula de Carbono Premium LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PelÃ­cula de Carbono Premium | LUME Controle Solar',
    description: 'Visual grafite sofisticado com rejeiÃ§Ã£o tÃ©rmica de atÃ© 80%. OrÃ§amento grÃ¡tis.',
    images: ['https://lumecontrolesolar.com.br/carbono-hero.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'PelÃ­cula de Carbono Premium LUME',
  image: 'https://lumecontrolesolar.com.br/carbono-hero.webp',
  description: 'PelÃ­cula de carbono profissional com visual grafite sofisticado, rejeiÃ§Ã£o tÃ©rmica de atÃ© 80% e bloqueio de 99% dos raios UV. Garantia de 5 anos.',
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
      unitText: 'mÂ²',
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
    reviewCount: '28',
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
