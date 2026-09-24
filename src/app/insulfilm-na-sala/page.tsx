import type { Metadata } from 'next';
import { InsulfilmSala } from '../../views/InsulfilmSala';
import { salaFaqs } from '@/content/salaFaq';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm para Sala no RJ | Zero Reflexo na TV e Térmico a partir de R$ 280 - LUME',
  description:
    'Películas para sala que eliminam o reflexo na Smart TV, reduzem até 82% do calor e protegem sofás e pisos. Instalações para janelas de sala a partir de R$ 280 ~ R$ 350. Nano Cerâmica, Carbono e Refletiva no Rio de Janeiro.',
  keywords: [
    'insulfilm para sala',
    'quanto custa insulfilm para sala',
    'insulfilm para sala preco',
    'pelicula para sala de estar',
    'tirar reflexo sol tv sala',
    'pelicula para janela de sala rj',
    'nano ceramica sala de estar',
    'insulfilm porta de varanda sala',
    'insulfilm residencial rio de janeiro',
    'insulfilm barra da tijuca sala'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-sala/' },
  openGraph: {
    title: 'Insulfilm para Sala no RJ | Zero Reflexo na TV e Conforto Térmico',
    description:
      'Assista TV sem reflexo, reduza até 82% do calor e valorize sua sala de estar. Instalação profissional com garantia de 2 anos a partir de R$ 280. Orçamento rápido pelo WhatsApp.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-sala/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Sala - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Sala | LUME Controle Solar RJ',
    description:
      'Mais conforto na sua sala: zero reflexo na TV, redução térmica e preservação de sofás e pisos. Janelas a partir de R$ 280 ~ R$ 350.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Soluções por Cômodo', url: 'https://lumecontrolesolar.com.br/#produtos' },
      { name: 'Insulfilm na Sala', url: 'https://lumecontrolesolar.com.br/insulfilm-na-sala/' },
    ]),
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm para Salas de Estar',
      alternateName: 'Película de Controle Solar e Térmico para Sala',
      description:
        'Instalação profissional de películas de alta performance em salas residenciais no Rio de Janeiro. Ideal para eliminar reflexo na Smart TV, diminuir o calor solar, proteger móveis e pisos contra raios UV e garantir privacidade. Opções em Nano Cerâmica, Carbono e Refletiva com garantia de 2 anos.',
      url: 'https://lumecontrolesolar.com.br/insulfilm-na-sala/',
      image: 'https://lumecontrolesolar.com.br/og-image.jpg',
      provider: {
        '@type': 'LocalBusiness',
        name: 'LUME Controle Solar',
        url: 'https://lumecontrolesolar.com.br',
        telephone: businessInfo.phoneE164,
        address: businessAddressSchema,
      },
      areaServed: [
        { '@type': 'City', name: 'Rio de Janeiro' },
        { '@type': 'AdministrativeArea', name: 'Barra da Tijuca' },
        { '@type': 'AdministrativeArea', name: 'Recreio dos Bandeirantes' },
        { '@type': 'AdministrativeArea', name: 'Jacarepaguá' },
        { '@type': 'AdministrativeArea', name: 'Campo Grande' },
        { '@type': 'AdministrativeArea', name: 'Zona Sul' }
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '280.00',
        highPrice: '890.00',
        offerCount: '3',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'LocalBusiness',
          name: 'LUME Controle Solar',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Redução de Reflexo na TV', value: 'Até 90%' },
        { '@type': 'PropertyValue', name: 'Rejeição de Calor Infravermelho', value: 'Até 82%' },
        { '@type': 'PropertyValue', name: 'Bloqueio de Raios UV', value: '99%' },
        { '@type': 'PropertyValue', name: 'Tempo Médio de Instalação', value: '1h30 a 3h' },
        { '@type': 'PropertyValue', name: 'Garantia', value: '2 Anos' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: salaFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsulfilmSala />
    </>
  );
}
