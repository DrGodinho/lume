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
  '@type': 'Service',
  name: 'Instalação de Película Refletiva Espelhada',
  alternateName: 'Insulfilm Refletivo Prata',
  description: 'Instalação profissional de película refletiva espelhada com efeito "one-way mirror". Privacidade total durante o dia, rejeição de até 78% do calor solar (TSER) e bloqueio de 99% dos raios UV. A solução clássica e eficaz para o calor carioca.',
  url: 'https://lumecontrolesolar.com.br/refletiva',
  image: 'https://lumecontrolesolar.com.br/product-refletiva.webp',
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
    price: '95',
    priceCurrency: 'BRL',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '95',
      priceCurrency: 'BRL',
      unitText: 'm²',
    },
    availability: 'https://schema.org/InStock',
    validFrom: '2025-01-01',
    seller: {
      '@type': 'LocalBusiness',
      name: 'LUME Controle Solar',
    },
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Rejeição de Calor Infravermelho (IRR)', value: '70% a 85%' },
    { '@type': 'PropertyValue', name: 'Bloqueio UV', value: '99%' },
    { '@type': 'PropertyValue', name: 'Transmissão de Luz (VLT)', value: '8% a 35%' },
    { '@type': 'PropertyValue', name: 'TSER (Rejeição Solar Total)', value: '65% a 78%' },
    { '@type': 'PropertyValue', name: 'Privacidade Diurna', value: 'Total (efeito espelho)' },
  ],
  termsOfService: 'Garantia de 5 anos contra bolhas, descolamento e alteração de cor.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '52',
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
      <RefletivaPage />
    </>
  );
}
