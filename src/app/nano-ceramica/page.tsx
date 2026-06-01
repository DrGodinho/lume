import type { Metadata } from 'next';
import { NanoCeramicaPage } from '../../views/NanoCeramica';

export const metadata: Metadata = {
  title: 'Película Nano Cerâmica | Rejeição de 97% do Calor IR - LUME',
  description: 'Película Nano Cerâmica com rejeição de até 97% do calor infravermelho. Transparência máxima, bloqueio UV 99% e garantia de 5 anos. Orçamento grátis pelo WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/nano-ceramica' },
  openGraph: {
    title: 'Película Nano Cerâmica | Rejeição de 97% do Calor IR - LUME',
    description: 'A tecnologia mais avançada em controle solar. Rejeita 97% do calor com transparência total. Instalação profissional no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/nano-ceramica',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/nano-ceramica-hero.webp', width: 1200, height: 630, alt: 'Película Nano Cerâmica LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Nano Cerâmica | LUME Controle Solar',
    description: 'Rejeita 97% do calor infravermelho com transparência total. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/nano-ceramica-hero.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Película Nano Cerâmica LUME',
      image: 'https://lumecontrolesolar.com.br/nano-ceramica-hero.webp',
      description: 'Película nano cerâmica profissional com rejeição de até 97% do calor infravermelho e transparência máxima. A tecnologia mais avançada em controle solar.',
      brand: {
        '@type': 'Brand',
        name: 'LUME Controle Solar'
      },
      offers: {
        '@type': 'Offer',
        url: 'https://lumecontrolesolar.com.br/nano-ceramica',
        priceCurrency: 'BRL',
        price: '220.00',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '220.00',
          priceCurrency: 'BRL',
          unitText: 'm²'
        },
        availability: 'https://schema.org/InStock',
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
          merchantReturnDays: 0,
          applicableCountry: 'BR'
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
            addressCountry: 'BR'
          }
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '35',
        bestRating: '5'
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'O Insulfilm Nano Cerâmica interfere no sinal do celular ou GPS?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Não. Diferente das películas metalizadas, a Nano Cerâmica não possui metal em sua composição, garantindo que o sinal de 5G, Wi-Fi e GPS funcione perfeitamente.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Posso colocar Nano Cerâmica na varanda gourmet?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Sim! É a película ideal para varandas, pois bloqueia até 97% do calor sem escurecer o vidro, preservando a vista e a luminosidade natural.'
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
      <NanoCeramicaPage />
    </>
  );
}
