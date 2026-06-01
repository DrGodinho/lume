import type { Metadata } from 'next';
import { DuplaCamadaPage } from '../../views/DuplaCamada';

export const metadata: Metadata = {
  title: 'PelÃ­cula Dupla Camada G5 | MÃ¡xima RejeiÃ§Ã£o de Calor - LUME',
  description: 'PelÃ­cula Dupla Camada com camada refletiva externa e fumÃª interna. MÃ¡xima rejeiÃ§Ã£o de calor sem reflexo interno noturno. OrÃ§amento grÃ¡tis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/dupla-camada' },
  openGraph: {
    title: 'PelÃ­cula Dupla Camada G5 | MÃ¡xima RejeiÃ§Ã£o de Calor - LUME',
    description: 'Camada refletiva + fumÃª interna: o melhor dos dois mundos. MÃ¡xima rejeiÃ§Ã£o de calor sem reflexo interno Ã  noite. InstalaÃ§Ã£o no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/dupla-camada',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/product-smoke.webp', width: 1200, height: 630, alt: 'PelÃ­cula Dupla Camada G5 LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PelÃ­cula Dupla Camada G5 | LUME Controle Solar',
    description: 'MÃ¡xima rejeiÃ§Ã£o de calor sem reflexo interno Ã  noite. OrÃ§amento grÃ¡tis.',
    images: ['https://lumecontrolesolar.com.br/product-smoke.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'PelÃ­cula Dupla Camada G5/G20 LUME',
  image: 'https://lumecontrolesolar.com.br/product-smoke.webp',
  description: 'PelÃ­cula dupla camada profissional com tecnologia de deposiÃ§Ã£o a vÃ¡cuo. Camada refletiva externa para mÃ¡xima rejeiÃ§Ã£o de calor e camada fumÃª interna para eliminar o reflexo noturno.',
  brand: {
    '@type': 'Brand',
    name: 'LUME Controle Solar',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://lumecontrolesolar.com.br/dupla-camada',
    priceCurrency: 'BRL',
    price: '120.00',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '120.00',
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
    reviewCount: '26',
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
      <DuplaCamadaPage />
    </>
  );
}
