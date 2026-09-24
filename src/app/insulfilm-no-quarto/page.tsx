import type { Metadata } from 'next';
import { InsulfilmQuarto } from '../../views/InsulfilmQuarto';
import { quartoFaqs } from '@/content/quartoFaq';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm para Quarto no RJ | Blackout e Sono Perfeito a partir de R$ 280 - LUME',
  description:
    'Películas blackout e térmicas para quarto que bloqueiam até 99% da luz e 82% do calor. Durma no escuro total com privacidade 24h. Janelas de quarto a partir de R$ 280 ~ R$ 350 instaladas no Rio de Janeiro.',
  keywords: [
    'insulfilm para quarto',
    'quanto custa insulfilm quarto',
    'insulfilm para quarto preco rj',
    'pelicula blackout para quarto',
    'escurecer janela de quarto',
    'pelicula para dormir de dia',
    'dupla camada g5 quarto',
    'carbono g5 quarto',
    'insulfilm quarto rj',
    'insulfilm barra da tijuca quarto'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-quarto/' },
  openGraph: {
    title: 'Insulfilm para Quarto no RJ | Escurecimento Total e Conforto Térmico',
    description:
      'Durma em paz! Bloqueie 99% da luz solar matinal e o calor da tarde com películas profissionais. Instalações para quartos a partir de R$ 280 com garantia de 2 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-quarto/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/og-image.jpg', width: 1200, height: 630, alt: 'Insulfilm para Quarto - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Quarto | LUME Controle Solar RJ',
    description:
      'Escuro total para o melhor sono: películas Dupla Camada e Carbono G5 com instalação residencial limpa no RJ a partir de R$ 280 ~ R$ 350.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Soluções por Cômodo', url: 'https://lumecontrolesolar.com.br/#produtos' },
      { name: 'Insulfilm no Quarto', url: 'https://lumecontrolesolar.com.br/insulfilm-no-quarto/' },
    ]),
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm para Quartos e Dormitórios',
      alternateName: 'Película Blackout e Controle Térmico para Quarto',
      description:
        'Instalação profissional de películas de alto poder de escurecimento e isolamento térmico em quartos residenciais no Rio de Janeiro. Ideal para quem trabalha em turnos, precisa de escuridão total para dormir de dia, quer proteger bebês e crianças do sol forte ou eliminar o calor acumulado da tarde. Películas Dupla Camada G5 e Carbono G5 com 2 anos de garantia.',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-quarto/',
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
        highPrice: '1150.00',
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
        reviewCount: '138',
        bestRating: '5',
        worstRating: '1',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Bloqueio de Luz Visível', value: 'Até 99%' },
        { '@type': 'PropertyValue', name: 'Rejeição de Calor Térmico', value: 'Até 82%' },
        { '@type': 'PropertyValue', name: 'Bloqueio UV', value: '99%' },
        { '@type': 'PropertyValue', name: 'Privacidade', value: 'Total 24h' },
        { '@type': 'PropertyValue', name: 'Tempo Médio de Instalação', value: '1h a 1h30' },
        { '@type': 'PropertyValue', name: 'Garantia', value: '2 Anos' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: quartoFaqs.map((faq) => ({
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
      <InsulfilmQuarto />
    </>
  );
}
