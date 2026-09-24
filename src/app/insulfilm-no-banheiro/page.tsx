import type { Metadata } from 'next';
import { InsulfilmBanheiro } from '../../views/InsulfilmBanheiro';
import { banheiroFaqs } from '@/content/banheiroFaq';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm para Banheiro no RJ | Jateado e Privacidade 24h a partir de R$ 180 - LUME',
  description:
    'Películas jateadas para básculas e boxes de banheiro no Rio de Janeiro. Privacidade total 24h mesmo com a luz acesa, à prova de vapor e umidade. Básculas a partir de R$ 180 e boxes a partir de R$ 320 instalados.',
  keywords: [
    'insulfilm para banheiro',
    'insulfilm jateado banheiro',
    'quanto custa insulfilm banheiro',
    'insulfilm para box de banheiro',
    'pelicula para bascula banheiro',
    'pelicula privacidade luz acesa',
    'insulfilm jateado rj',
    'insulfilm banheiro preco',
    'adesivo jateado box rj'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-banheiro/' },
  openGraph: {
    title: 'Insulfilm para Banheiro no RJ | Privacidade 24h com Luz Acesa',
    description:
      'Privacidade total em básculas e boxes sem perder a claridade natural. Película jateada à prova de vapor com garantia de 2 anos. Orçamento rápido pelo WhatsApp.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-banheiro/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Banheiro - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Banheiro | LUME Controle Solar RJ',
    description:
      'Privacidade 24h para básculas e boxes: película Jateada resistente à umidade a partir de R$ 180 com instalação no Rio.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Soluções por Cômodo', url: 'https://lumecontrolesolar.com.br/#produtos' },
      { name: 'Insulfilm no Banheiro', url: 'https://lumecontrolesolar.com.br/insulfilm-no-banheiro/' },
    ]),
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Jateado para Banheiros',
      alternateName: 'Película Jateada e Fosca para Básculas e Boxes',
      description:
        'Instalação profissional de películas jateadas e foscas para básculas, janelas e boxes de vidro temperado em banheiros no Rio de Janeiro. Garante privacidade total 24 horas por dia mesmo com a lâmpada acesa, mantém a passagem de luz natural e resiste perfeitamente ao vapor quente do chuveiro. Garantia oficial de 2 anos.',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-banheiro/',
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
        lowPrice: '180.00',
        highPrice: '680.00',
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
        reviewCount: '115',
        bestRating: '5',
        worstRating: '1',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Privacidade', value: 'Total 24h Bidirecional' },
        { '@type': 'PropertyValue', name: 'Passagem de Luz Natural', value: 'Até 80%' },
        { '@type': 'PropertyValue', name: 'Resistência ao Vapor', value: '100% Impermeável' },
        { '@type': 'PropertyValue', name: 'Tempo Médio de Aplicação', value: '40min a 1h30' },
        { '@type': 'PropertyValue', name: 'Garantia', value: '2 Anos' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: banheiroFaqs.map((faq) => ({
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
      <InsulfilmBanheiro />
    </>
  );
}
