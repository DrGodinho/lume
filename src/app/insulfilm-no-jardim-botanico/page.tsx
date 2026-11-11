import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm no Jardim Botânico RJ | Películas Térmicas Nano Cerâmica - LUME',
  description:
    'Aplicação especializada de insulfilm no Jardim Botânico e Gávea. Películas térmicas Nano Cerâmica de alta performance: corte de até 95% do calor, proteção UV total para acervos e garantia de até 10 anos. Atendimento VIP no local.',
  keywords: [
    'insulfilm no jardim botanico',
    'insulfilm jardim botanico rj',
    'insulfilm gavea rj',
    'pelicula termica jardim botanico',
    'insulfilm nano ceramica jardim botanico',
    'protecao uv obras de arte insulfilm',
    'insulfilm lopes quintas',
    'lume controle solar jardim botanico'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-botanico/' },
  openGraph: {
    title: 'Insulfilm no Jardim Botânico RJ | LUME Controle Solar',
    description:
      'Soluções térmicas de altíssimo padrão para casas e coberturas no Jardim Botânico e Gávea. Rejeição de calor com transparência cristalina e garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-botanico/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/jardimbotanico_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm no Jardim Botânico RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Jardim Botânico RJ | LUME Controle Solar',
    description:
      'Controle solar térmico e proteção UV para residências exclusivas no Jardim Botânico e Gávea.',
    images: ['https://lumecontrolesolar.com.br/jardimbotanico_hero_bg.webp'],
  },
};

const jardimBotanicoConfig: NeighborhoodConfig = {
  name: 'Jardim Botânico & Gávea',
  region: 'Zona Sul do Rio de Janeiro',
  heroBadge: 'Atendimento VIP no Jardim Botânico & Gávea',
  heroBg: '/jardimbotanico_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'no', 'Jardim', 'Botânico', 'RJ'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Alívio Térmico · Proteção UV Absoluta · Alto Padrão',
  description:
    'Soluções de controle solar e climatização de alta sofisticação para casas nobres, mezaninos e coberturas no Jardim Botânico e Gávea. Bloqueie até 95% do calor mantendo a integração visual perfeita com a natureza e protegendo acervos de arte e móveis finos.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20do%20Jardim%20Bot%C3%A2nico%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20t%C3%A9rmico%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Barreira térmica Nano Cerâmica' },
    { target: '99', suffix: '%', label: 'Proteção UV400 Máxima', sublabel: 'Preservação de quadros e móveis' },
    { target: '8', suffix: '°C', label: 'Redução na Sensação Térmica', sublabel: 'Climatização sustentável' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Películas de estabilidade garantida' },
  ],
  localPainsTitle: 'Exigências Térmicas no Jardim Botânico e Gávea',
  localPainsSubtitle: 'Preservação Patrimonial e Conforto Solar',
  localPains: [
    {
      title: 'Grandes Vãos de Vidro e Insolação Contínua',
      problem:
        'Residências e coberturas em ruas nobres como Lopes Quintas, Visconde de Carandaí e Marquês de São Vicente possuem fachadas envidraçadas que acumulam intensa carga térmica durante todo o dia.',
      solution:
        'A tecnologia Nano Cerâmica dissipa a energia solar no vidro, mantendo os interiores frescos sem necessidade de sobrecarregar o ar-condicionado.',
    },
    {
      title: 'Proteção de Obras de Arte e Madeiras Nobres',
      problem:
        'Acervos artísticos, tapetes orientais, cortinas finas e marcenaria de design sofrem descoloração e ressecamento irreversíveis provocados pela radiação UV.',
      solution:
        'Filtragem UV400 com 99.9% de retenção atua como um verniz protetor invisível que salvaguarda o patrimônio decorativo por gerações.',
    },
    {
      title: 'Integração com a Natureza sem Reflexo',
      problem:
        'Moradores exigem manter a vista exuberante da mata e do Cristo Redentor sem o efeito de espelhamento que prejudica a contemplação do jardim.',
      solution:
        'Películas 100% ópticas e incolores com baixa refletividade interna e externa, proporcionando transparência total dia e noite.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Proteção Térmica & Preservação UV',
      tag: 'Alta Performance',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Grandes panos de vidro, mezaninos, salas voltadas para o jardim e claraboias.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Conforto Térmico & Privacidade',
      tag: 'Sem Espelho Noturno',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Quartos e livings com vista para ruas ou vizinhos na Gávea e Jardim Botânico.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Controle de Luminosidade',
      tag: 'Tonalidade Suave',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Bibliotecas, home cinema, escritórios e quartos.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Antivandalismo PS4',
      category: 'Segurança & Retenção de Vidro',
      tag: 'Proteção de Esquadrias',
      heatRejection: 1,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Portas de correr para áreas externas, claraboias e painéis de jardim.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
  ],
  coverageLocations: [
    'Rua Jardim Botânico',
    'Rua Visconde de Carandaí',
    'Rua Lopes Quintas',
    'Rua Abreu Fialho',
    'Rua Von Martius',
    'Rua Marquês de Sabará',
    'Rua Corcovado',
    'Rua Pacheco Leão',
    'Estrada da Gávea',
    'Rua Marquês de São Vicente (Gávea)',
    'Praça Santos Dumont',
    'Parque Lage e proximidades',
  ],
  faqs: [
    {
      q: 'A película Nano Cerâmica é recomendada para proteção de obras de arte e tapetes no Jardim Botânico?',
      a: 'Sim, é a solução mais recomendada por arquitetos e curadores de arte. Ela bloqueia 99.9% dos raios ultravioleta e 95% do infravermelho (os dois maiores causadores de desbotamento e quebra de fibras em tecidos, couros e telas), sem alterar as cores naturais da iluminação ambiente.',
    },
    {
      q: 'A película pode ser instalada em claraboias ou tetos de vidro?',
      a: 'Sim. Possuímos linha específica para insolação zenital (teto de vidro), controlando o calor perpendicular extremo com segurança total contra estresse térmico do vidro.',
    },
    {
      q: 'Como é feito o agendamento de orçamento no Jardim Botânico e Gávea?',
      a: 'Basta entrar em contato pelo WhatsApp. Realizamos o atendimento VIP no endereço com apresentação de mostruário técnico e medição detalhada de cada vão sem qualquer custo.',
    },
    {
      q: 'A instalação preserva a vista do Cristo Redentor e do verde ao redor?',
      a: 'Absolutamente. Nossas películas da linha Nano Cerâmica 70% possuem tecnologia anti-reflexo que preserva 100% da nitidez da paisagem, eliminando apenas o calor abrasador.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Jardim Botânico', url: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-botanico/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-botanico/#localbusiness',
      name: 'LUME Controle Solar - Jardim Botânico & Gávea',
      image: 'https://lumecontrolesolar.com.br/jardimbotanico_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-botanico/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9684,
        longitude: -43.2289,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Jardim Botânico' },
        { '@type': 'Neighborhood', name: 'Gávea' },
        { '@type': 'Neighborhood', name: 'Horto' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 30,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Térmico no Jardim Botânico RJ',
      serviceType: 'Aplicação de Películas de Controle Térmico e Proteção UV para Residências Nobres',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-botanico/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Jardim Botânico',
      },
      description:
        'Instalação de películas térmicas Nano Cerâmica de alta performance para residências e coberturas no Jardim Botânico e Gávea com garantia de até 10 anos.',
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
      mainEntity: jardimBotanicoConfig.faqs.map((faq) => ({
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

export default function JardimBotanicoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={jardimBotanicoConfig} />
    </>
  );
}

