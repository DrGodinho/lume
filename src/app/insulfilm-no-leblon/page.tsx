import type { Metadata } from 'next';
import { LeblonPage } from '../../views/LeblonPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm no Leblon RJ | Películas Térmicas de Alto Padrão - LUME',
  description:
    'Instalação de insulfilm no Leblon e Delfim Moreira. Películas Nano Cerâmica de alta tecnologia com 95% de bloqueio térmico, proteção UV absoluta e preservação total de fachadas nobres. Orçamento exclusivo no WhatsApp.',
  keywords: [
    'insulfilm no leblon',
    'insulfilm leblon rj',
    'insulfilm delfim moreira',
    'insulfilm alto leblon',
    'insulfilm nano cerâmica leblon',
    'película solar leblon',
    'redução de calor leblon',
    'insulfilm residencial leblon',
    'lume controle solar leblon',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-leblon/' },
  openGraph: {
    title: 'Insulfilm no Leblon RJ | LUME Controle Solar',
    description:
      'Películas térmicas de prestígio para apartamentos no Leblon. Rejeição de calor de até 95%, discrição arquitetônica e garantia formal de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-leblon/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/leblon_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm no Leblon RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Leblon RJ | LUME Controle Solar',
    description:
      'Soluções em películas térmicas de luxo para apartamentos no Leblon. Medição e atendimento VIP.',
    images: ['https://lumecontrolesolar.com.br/leblon_hero_bg.webp'],
  },
};

const leblonFaqs = [
  {
    q: 'Qual película é recomendada para varandas e salas com grandes vidros no Leblon?',
    a: 'Para imóveis na Delfim Moreira, Ataulfo de Paiva e Alto Leblon, a Nano Cerâmica G70 é a mais indicada. Ela bloqueia quase a totalidade da radiação de calor sem escurecer o ambiente e sem alterar o padrão estético externo da fachada.',
  },
  {
    q: 'As convenções de condomínio no Leblon aprovam a película Nano Cerâmica?',
    a: 'Sim, com ampla aceitação. Por ser transparente e livre de metais, a Nano Cerâmica não reflete como espelho e não quebra a harmonia visual do prédio, sendo amplamente liberada por administradoras e comissões condominiais.',
  },
  {
    q: 'Como funciona o processo de atendimento e medição no Leblon?',
    a: 'Oferecemos atendimento com hora marcada e pontualidade rigorosa. O técnico da LUME comparece ao imóvel com amostras físicas de películas, tira as medidas milimétricas e apresenta a cotação formal sem qualquer custo ou compromisso.',
  },
  {
    q: 'O serviço de instalação é limpo e seguro para pisos nobres?',
    a: 'Sim. Nossa equipe é especializada em residências de altíssimo padrão: cobrimos pisos de taco, mármore ou madeira nobre com mantas protetoras impermeáveis. A aplicação é executada com máxima limpeza e discrição.',
  },
  {
    q: 'O insulfilm protege estofados de couro, madeiras e obras de arte?',
    a: 'Sim, a barreira de 99.9% contra radiação ultravioleta impede a oxidação, ressecamento e o desbotamento acelerado de peças de design, tapetes e acervos de arte expostos à luz natural.',
  },
  {
    q: 'Qual o tempo de garantia oferecido pela LUME?',
    a: 'Todas as nossas instalações de Nano Cerâmica e linhas nobres contam com certificado de garantia de até 10 anos contra bolhas, descascamento e alteração de tonalidade.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Leblon', url: 'https://lumecontrolesolar.com.br/insulfilm-no-leblon/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-leblon/#localbusiness',
      name: 'LUME Controle Solar - Leblon & Alto Leblon',
      image: 'https://lumecontrolesolar.com.br/leblon_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-leblon/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9847,
        longitude: -43.2238,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Leblon' },
        { '@type': 'Neighborhood', name: 'Alto Leblon' },
        { '@type': 'AdministrativeArea', name: 'Zona Sul' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 24,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Aplicação de Insulfilm de Alto Padrão no Leblon RJ',
      serviceType: 'Aplicação de Películas Térmicas de Nano Cerâmica e Controle Solar',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-leblon/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Leblon',
      },
      description:
        'Instalação de películas térmicas de alta tecnologia com corte térmico de 95%, proteção UV total e preservação de fachadas nobres no Leblon.',
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
      mainEntity: leblonFaqs.map((faq) => ({
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
      <LeblonPage faqs={leblonFaqs} />
    </>
  );
}
