import type { Metadata } from 'next';
import { NanoCeramicaPage } from '../../views/NanoCeramica';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Película Nano Cerâmica RJ | Opções G5, G20, 70% e Window Blue - LUME',
  description: 'Película Nano Cerâmica com opções G5, G20, 70% e Window Blue 75%. Rejeição de até 98% do calor infravermelho. A partir de R$ 180/m² instalado no Rio de Janeiro.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/nano-ceramica/' },
  openGraph: {
    title: 'Película Nano Cerâmica RJ | Opções G5, G20, 70% e Window Blue - LUME',
    description: 'A tecnologia mais avançada em controle solar. Opções G5, G20, 70% e Window Blue 75% com rejeição de até 98% do calor IR a partir de R$ 180/m² instalado no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/nano-ceramica/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/nano-ceramica-hero.webp', width: 1200, height: 630, alt: 'Película Nano Cerâmica LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Nano Cerâmica RJ | LUME Controle Solar',
    description: 'Rejeição de até 98% do calor infravermelho com opções G5, G20, 70% e Window Blue 75%. A partir de R$ 180/m² instalado.',
    images: ['https://lumecontrolesolar.com.br/nano-ceramica-hero.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Nano Cerâmica', url: 'https://lumecontrolesolar.com.br/nano-ceramica/' },
    ]),
    {
      '@type': 'Product',
      name: 'Película Nano Cerâmica LUME',
      image: 'https://lumecontrolesolar.com.br/nano-ceramica-hero.webp',
      description: 'Película nano cerâmica profissional em versões G5, G20, 70% e Window Blue 75% com rejeição de até 98% do calor infravermelho e garantia de até 10 anos.',
      brand: {
        '@type': 'Brand',
        name: 'LUME Controle Solar'
      },
      offers: {
        '@type': 'Offer',
        url: 'https://lumecontrolesolar.com.br/nano-ceramica',
        priceCurrency: 'BRL',
        price: '180.00',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '180.00',
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
          telephone: businessInfo.phoneE164,
          address: businessAddressSchema
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '22',
        bestRating: '5'
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Quais são as opções de Nano Cerâmica disponíveis e valores?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Oferecemos quatro opções especializadas: Nano Cerâmica G5 e G20 a partir de R$ 180/m² (com alta privacidade e rejeição solar), Nano Cerâmica 70% a partir de R$ 200/m² (alta transparência para varandas e fachadas) e Window Blue 75% a partir de R$ 260/m² (linha ultra premium com até 98% de retenção de calor IR).'
          }
        },
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
