import type { Metadata } from 'next';
import { IpanemaPage } from '../../views/IpanemaPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm em Ipanema RJ | Películas Nano Cerâmica de Luxo - LUME',
  description:
    'Instalação de insulfilm em Ipanema e Vieira Souto. Películas Nano Cerâmica de alta performance com até 95% de bloqueio de calor, transparência cristalina e conformidade com condomínios de alto padrão. Orçamento no WhatsApp.',
  keywords: [
    'insulfilm em ipanema',
    'insulfilm ipanema rj',
    'insulfilm vieira souto',
    'insulfilm nano cerâmica ipanema',
    'película térmica ipanema',
    'redução de calor ipanema',
    'insulfilm residencial ipanema',
    'insulfilm arpoador',
    'lume controle solar ipanema',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-ipanema/' },
  openGraph: {
    title: 'Insulfilm em Ipanema RJ | LUME Controle Solar',
    description:
      'Películas térmicas de luxo para apartamentos em Ipanema. Até 95% de corte térmico, preservação da vista e garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-ipanema/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/ipanema_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm em Ipanema RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Ipanema RJ | LUME Controle Solar',
    description:
      'Soluções térmicas e de privacidade para residências de alto padrão em Ipanema. Garantia formal de até 10 anos.',
    images: ['https://lumecontrolesolar.com.br/ipanema_hero_bg.webp'],
  },
};

const ipanemaFaqs = [
  {
    q: 'Qual o tipo de insulfilm mais indicado para apartamentos na orla de Ipanema?',
    a: 'A película Nano Cerâmica 70% ou 75% é a campeã indiscutível em Ipanema. Ela bloqueia a radiação infravermelha responsável pelo calor extremo do sol poente, sem escurecer a sala e sem alterar o visual externo da fachada do prédio.',
  },
  {
    q: 'O insulfilm atende às exigências das convenções de condomínio na Vieira Souto e Prudente de Morais?',
    a: 'Sim. Nossas películas de Nano Cerâmica são isentas de efeito espelhado e 100% livres de metais. Elas preservam a uniformidade arquitetônica do edifício, sendo aprovadas por síndicos e comissões de fachada.',
  },
  {
    q: 'Quanto custa instalar película solar em Ipanema?',
    a: 'Trabalhamos com valores transparentes: a linha Carbono a partir de R$ 90/m², Dupla Camada a partir de R$ 150/m² e a Nano Cerâmica premium a partir de R$ 220/m² instalado. Agendamos a visita técnica para medição gratuita em qualquer condomínio de Ipanema.',
  },
  {
    q: 'A instalação do insulfilm suja as paredes ou molha o piso de madeira nobre?',
    a: 'De forma alguma. Nossa equipe é treinada para atuar em imóveis de alto luxo: protegemos pisos, rodapés e móveis com mantas impermeáveis durante a aplicação, deixando o ambiente impecavelmente limpo e seco.',
  },
  {
    q: 'O insulfilm protege tapetes persas, obras de arte e marcenaria planejada?',
    a: 'Sim! Com 99.9% de retenção dos raios UV, nossas películas eliminam o principal agente de fotodegradação que causa o desbotamento prematuro de tecidos, vernizes e quadros decorativos.',
  },
  {
    q: 'As películas possuem garantia?',
    a: 'Sim, fornecemos certificado de garantia formal de até 10 anos contra defeitos de fábrica, descolamento, bolhas e alteração de cor.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Ipanema', url: 'https://lumecontrolesolar.com.br/insulfilm-em-ipanema/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-ipanema/#localbusiness',
      name: 'LUME Controle Solar - Ipanema & Arpoador',
      image: 'https://lumecontrolesolar.com.br/ipanema_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-em-ipanema/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9838,
        longitude: -43.2045,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Ipanema' },
        { '@type': 'Neighborhood', name: 'Arpoador' },
        { '@type': 'AdministrativeArea', name: 'Zona Sul' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 26,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Películas Solares de Luxo em Ipanema RJ',
      serviceType: 'Aplicação de Películas Nano Cerâmica e Controle Solar',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-ipanema/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Ipanema',
      },
      description:
        'Aplicação profissional de películas térmicas de nano cerâmica e proteção solar de alta fidelidade óptica em Ipanema, Rio de Janeiro.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '90.00',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceType: 'https://schema.org/StartingPrice',
          unitText: 'm²',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: ipanemaFaqs.map((faq) => ({
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
      <IpanemaPage faqs={ipanemaFaqs} />
    </>
  );
}
