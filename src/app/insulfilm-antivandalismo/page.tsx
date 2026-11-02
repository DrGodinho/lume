import type { Metadata } from 'next';
import { AntivandalismoPage } from '../../views/AntivandalismoPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Película Antivandalismo e Segurança RJ | PS4, PS8 e PS12 - LUME',
  description:
    'Instalação de película antivandalismo e segurança no Rio de Janeiro. Linhas PS4, PS8 e PS12 de até 300 micras com retenção total de estilhaços e proteção contra arrombamentos em casas e lojas. Orçamento grátis.',
  keywords: [
    'película antivandalismo rj',
    'insulfilm de segurança rj',
    'película ps4 ps8 ps12',
    'película antivandalismo residencial rj',
    'insulfilm anti invasão',
    'película de proteção para vidro',
    'insulfilm antivandalismo para vitrine',
    'película para box de banheiro',
    'retenção de estilhaços vidro temperado',
    'lume controle solar antivandalismo',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-antivandalismo/' },
  openGraph: {
    title: 'Película Antivandalismo e Segurança RJ | LUME Controle Solar',
    description:
      'Proteja sua família e seu patrimônio contra invasões, arrombamentos e acidentes. Linhas de segurança PS4, PS8 e PS12 instaladas com garantia técnica de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-antivandalismo/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/antivandalismo_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Película Antivandalismo e Segurança RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Película Antivandalismo e Segurança RJ | LUME Controle Solar',
    description:
      'Retenção total de estilhaços e resistência extrema contra marretadas e invasões. Linhas PS4, PS8 e PS12 com medição gratuita no RJ.',
    images: ['https://lumecontrolesolar.com.br/antivandalismo_hero_bg.webp'],
  },
};

const antivandalismoFaqs = [
  {
    q: 'A película antivandalismo impede que o vidro quebre?',
    a: 'Nenhuma película impede que o vidro se rompa internamente se receber uma marretada violenta. O que a película antivandalismo faz é criar uma couraça de alta tenacidade através do poliéster multicamadas e cola acrílica estrutural: quando o vidro trinca, ele não cai nem abre passagem. Ele permanece como uma barreira rígida e inexpugnável, exigindo dezenas de golpes sucessivos e barulho excessivo, o que faz os invasores desistirem da tentativa.',
  },
  {
    q: 'A película de segurança é transparente ou muda a cor da janela?',
    a: 'Trabalhamos com a linha 100% Incolor Cristalina, que é completamente invisível aos olhos e não altera em absolutamente nada a transparência ou a estética do vidro. Para quem também precisa de controle de calor ou privacidade, temos opções combinadas de segurança com Nano Cerâmica ou Fumê.',
  },
  {
    q: 'Qual a diferença prática entre as linhas PS4, PS8 e PS12?',
    a: 'A diferença é a espessura do filme e a quantidade de camadas de poliéster. O PS4 tem 100 micras e é indicado para acidentes domésticos (evita cortes graves se uma criança esbarrar em uma porta de vidro ou box). O PS8 tem 200 micras e é a mais recomendada para sacadas e residências contra pedradas e chutes violentos. O PS12 tem 300 micras e é a blindagem pesada para lojas, farmácias e locais com risco severo de invasão.',
  },
  {
    q: 'Quanto custa a aplicação de película antivandalismo no Rio de Janeiro?',
    a: 'O valor instalado inicia a partir de R$ 110/m² na linha PS4, R$ 160/m² na linha PS8 e R$ 240/m² na linha PS12. Fornecemos orçamento prévio imediato pelo WhatsApp e avaliação técnica no imóvel.',
  },
  {
    q: 'Pode ser instalada em box de banheiro para evitar acidentes?',
    a: 'Sim, é altamente recomendada! O vidro temperado de box de banheiro pode sofrer quebra espontânea devido a choque térmico ou fadiga de roldanas. Com a película de segurança, os fragmentos cortantes ficam 100% colados na lâmina, eliminando qualquer risco de cortes graves.',
  },
  {
    q: 'Qual a garantia oferecida pela LUME?',
    a: 'Oferecemos garantia formal de até 10 anos contra amarelamento, formação de bolhas e perda de adesão mecânica.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Película Antivandalismo', url: 'https://lumecontrolesolar.com.br/insulfilm-antivandalismo/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-antivandalismo/#localbusiness',
      name: 'LUME Controle Solar - Películas Antivandalismo e Segurança',
      image: 'https://lumecontrolesolar.com.br/antivandalismo_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-antivandalismo/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9068,
        longitude: -43.1729,
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Rio de Janeiro' },
        { '@type': 'Neighborhood', name: 'Barra da Tijuca' },
        { '@type': 'Neighborhood', name: 'Recreio dos Bandeirantes' },
        { '@type': 'Neighborhood', name: 'Copacabana' },
        { '@type': 'Neighborhood', name: 'Ipanema' },
        { '@type': 'Neighborhood', name: 'Leblon' },
        { '@type': 'Neighborhood', name: 'Tijuca' },
        { '@type': 'Neighborhood', name: 'Centro' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 31,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Película Antivandalismo e Segurança PS4, PS8 e PS12',
      serviceType: 'Aplicação de Películas de Segurança e Retenção de Estilhaços para Vidros',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-antivandalismo/#localbusiness',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Rio de Janeiro - RJ',
      },
      description:
        'Instalação de películas de alta tenacidade contra impactos acidentais, invasões e arrombamentos em vidros residenciais e comerciais no RJ.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '160.00',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: antivandalismoFaqs.map((faq) => ({
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
      <AntivandalismoPage faqs={antivandalismoFaqs} />
    </>
  );
}

