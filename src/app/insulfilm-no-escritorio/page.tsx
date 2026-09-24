import type { Metadata } from 'next';
import { InsulfilmEscritorio } from '../../views/InsulfilmEscritorio';
import { escritorioFaqs } from '@/content/escritorioFaq';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm para Escritório no RJ | Sem Reflexo no Monitor a partir de R$ 280 - LUME',
  description:
    'Películas para escritório e home office no Rio de Janeiro. Elimine o reflexo na tela do computador, acabe com contraluz em videochamadas e reduza em até 30% a conta de ar-condicionado. Janelas a partir de R$ 280 ~ R$ 350 e divisórias jateadas.',
  keywords: [
    'insulfilm para escritorio',
    'quanto custa insulfilm escritorio',
    'insulfilm home office rj',
    'tirar reflexo monitor sol',
    'pelicula divisoria de vidro escritorio',
    'insulfilm jateado consultorio',
    'nano ceramica escritorio rj',
    'insulfilm comercial rio de janeiro'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-escritorio/' },
  openGraph: {
    title: 'Insulfilm para Escritório no RJ | Produtividade e Conforto Visual',
    description:
      'Mais foco e ergonomia! Trabalhe sem reflexo no monitor e com temperatura amena. Instalação rápida para home office e empresas a partir de R$ 280.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-escritorio/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Escritório - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Escritório | LUME Controle Solar RJ',
    description:
      'Foco e ergonomia: zero reflexo em telas e conforto térmico para o seu expediente de trabalho no RJ a partir de R$ 280 ~ R$ 350.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Soluções por Cômodo', url: 'https://lumecontrolesolar.com.br/#produtos' },
      { name: 'Insulfilm no Escritório', url: 'https://lumecontrolesolar.com.br/insulfilm-no-escritorio/' },
    ]),
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm para Escritórios e Home Offices',
      alternateName: 'Película Anti-Reflexo e Térmica Corporativa',
      description:
        'Instalação profissional de películas de controle solar anti-ofuscamento e divisórias jateadas para escritórios, consultórios e home offices no Rio de Janeiro. Proporciona nitidez visual em monitores, elimina o contraluz em chamadas no Zoom/Meet e reduz até 30% no consumo de ar-condicionado. Garantia de 2 anos.',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-escritorio/',
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
        { '@type': 'AdministrativeArea', name: 'Centro' },
        { '@type': 'AdministrativeArea', name: 'Zona Sul' }
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '280.00',
        highPrice: '750.00',
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
        reviewCount: '112',
        bestRating: '5',
        worstRating: '1',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Redução de Ofuscamento em Telas', value: 'Até 90%' },
        { '@type': 'PropertyValue', name: 'Rejeição de Calor Infravermelho', value: 'Até 82%' },
        { '@type': 'PropertyValue', name: 'Bloqueio de Raios UV', value: '99%' },
        { '@type': 'PropertyValue', name: 'Tempo Médio de Instalação', value: '1h a 2h' },
        { '@type': 'PropertyValue', name: 'Garantia', value: '2 Anos' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: escritorioFaqs.map((faq) => ({
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
      <InsulfilmEscritorio />
    </>
  );
}
