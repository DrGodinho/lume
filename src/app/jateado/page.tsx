import type { Metadata } from 'next';
import { JateadoPage } from '../../views/Jateado';

export const metadata: Metadata = {
  title: 'PelÃ­cula Jateada Fosca | Privacidade Decorativa - LUME',
  description: 'PelÃ­cula jateada fosca para privacidade total em banheiros e divisÃ³rias. Efeito vidro jateado com custo acessÃ­vel. OrÃ§amento grÃ¡tis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/jateado' },
  openGraph: {
    title: 'PelÃ­cula Jateada Fosca | Privacidade Decorativa - LUME',
    description: 'Privacidade total em banheiros e divisÃ³rias sem escurecer o ambiente. Efeito vidro jateado com acabamento sofisticado e fÃ¡cil limpeza.',
    url: 'https://lumecontrolesolar.com.br/jateado',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/product-jateado-v2.webp', width: 1200, height: 630, alt: 'PelÃ­cula Jateada Fosca LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PelÃ­cula Jateada Fosca | LUME Controle Solar',
    description: 'Privacidade total sem escurecer o ambiente. Ideal para banheiros e divisÃ³rias. OrÃ§amento grÃ¡tis.',
    images: ['https://lumecontrolesolar.com.br/product-jateado-v2.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'PelÃ­cula Jateada Fosca LUME',
  image: 'https://lumecontrolesolar.com.br/product-jateado-v2.webp',
  description: 'PelÃ­cula jateada fosca profissional para privacidade total sem escurecer o ambiente. Ideal para boxes de banheiro e divisÃ³rias de escritÃ³rio.',
  brand: {
    '@type': 'Brand',
    name: 'LUME Controle Solar',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://lumecontrolesolar.com.br/jateado',
    priceCurrency: 'BRL',
    price: '90.00',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '90.00',
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
    reviewCount: '24',
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
      <JateadoPage />
    </>
  );
}
