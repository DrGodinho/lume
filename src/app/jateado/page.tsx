import type { Metadata } from 'next';
import { JateadoPage } from '../../views/Jateado';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Película Jateada Fosca | Privacidade Decorativa - LUME',
  description: 'Película jateada fosca para privacidade total em banheiros e divisórias. Efeito vidro jateado com custo acessível. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/jateado' },
  openGraph: {
    title: 'Película Jateada Fosca | Privacidade Decorativa - LUME',
    description: 'Privacidade total em banheiros e divisórias sem escurecer o ambiente. Efeito vidro jateado com acabamento sofisticado e fácil limpeza.',
    url: 'https://lumecontrolesolar.com.br/jateado',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/product-jateado-v2.webp', width: 1200, height: 630, alt: 'Película Jateada Fosca LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Jateada Fosca | LUME Controle Solar',
    description: 'Privacidade total sem escurecer o ambiente. Ideal para banheiros e divisórias. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/product-jateado-v2.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Película Jateada Fosca LUME',
  image: 'https://lumecontrolesolar.com.br/product-jateado-v2.webp',
  description: 'Película jateada fosca profissional para privacidade total sem escurecer o ambiente. Ideal para boxes de banheiro e divisórias de escritório.',
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
      telephone: businessInfo.phoneE164,
      address: businessAddressSchema,
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
      <JateadoPage />
    </>
  );
}
