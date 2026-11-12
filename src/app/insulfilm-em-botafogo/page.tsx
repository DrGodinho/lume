import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm em Botafogo RJ | Películas Térmicas Nano Cerâmica - LUME',
  description:
    'Aplicação especializada de insulfilm em Botafogo e Humaitá. Películas Nano Cerâmica com corte térmico de até 95%, alívio imediato do calor e 100% de conformidade com fachadas de condomínios. Garantia de até 10 anos.',
  keywords: [
    'insulfilm em botafogo',
    'insulfilm botafogo rj',
    'insulfilm humaita rj',
    'pelicula termica botafogo',
    'insulfilm nano ceramica botafogo',
    'reducao de calor botafogo',
    'insulfilm voluntarios da patria',
    'lume controle solar botafogo',
    'insulfilm para varanda botafogo'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-botafogo/' },
  openGraph: {
    title: 'Insulfilm em Botafogo RJ | LUME Controle Solar',
    description:
      'Controle solar térmico de alta performance para apartamentos em Botafogo e Humaitá. Rejeição de até 95% do calor infravermelho sem alterar a estética do vidro.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-botafogo/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/botafogo_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm em Botafogo RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Botafogo RJ | LUME Controle Solar',
    description:
      'Alívio térmico e proteção solar com Nano Cerâmica em Botafogo e Humaitá. Orçamento expresso pelo WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/botafogo_hero_bg.webp'],
  },
};

const botafogoConfig: NeighborhoodConfig = {
  name: 'Botafogo & Humaitá',
  region: 'Zona Sul do Rio de Janeiro',
  heroBadge: 'Atendimento Premium em Botafogo & Humaitá',
  heroBg: '/botafogo_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'em', 'Botafogo', 'RJ'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Alívio Térmico · Tecnologia Nano Cerâmica · Conforto Solar',
  description:
    'Soluções de alta performance térmica para residências e edifícios em Botafogo e Humaitá. Reduza o calor extremo do sol da tarde nas varandas e salas integradas, economizando na climatização sem alterar a transparência do vidro.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20de%20Botafogo%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20t%C3%A9rmico%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Barreira térmica definitiva' },
    { target: '8', suffix: '°C', label: 'Redução na Sensação Térmica', sublabel: 'Ambiente fresco e agradável' },
    { target: '99', suffix: '%', label: 'Bloqueio de Raios UV', sublabel: 'Proteção para pisos e móveis finos' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Sem bolhas e sem alteração de tom' },
  ],
  localPainsTitle: 'Desafios Térmicos em Botafogo e Humaitá',
  localPainsSubtitle: 'Diagnóstico de Climatização Urbana',
  localPains: [
    {
      title: 'Fim do Efeito Estufa nas Varandas Integradas e Salas',
      problem:
        'Lançamentos modernos e apartamentos em ruas como Voluntários da Pátria, Mena Barreto e Sorocaba acumulam calor intenso no sol poente, tornando o living desconfortável e superaquecendo o ar-condicionado.',
      solution:
        'A película Nano Cerâmica bloqueia até 95% do calor solar antes dele atravessar o vidro, reduzindo a temperatura em até 8°C e aliviando a conta de luz imediatamente.',
    },
    {
      title: 'Aprovação 100% em Convenções Condominiais',
      problem:
        'Condomínios de alto padrão na Zona Sul proíbem rigorosamente filmes metalizados ou espelhados que alterem a harmonia da fachada externa.',
      solution:
        'Nossas soluções de Nano Cerâmica são totalmente neutras e sem brilho metálico, filtrando o calor seletivamente sem mudar a tonalidade nem a estética da fachada.',
    },
    {
      title: 'Proteção UV: Blindagem para Móveis, Pisos e Pele',
      problem:
        'A incidência contínua de raios solares queima cortinas de linho, desbota pisos nobres de taco/madeira e resseca marcenarias sob medida.',
      solution:
        'Filtro solar UV de 99,9% que protege a saúde da sua família contra raios nocivos e blinda o patrimônio interno contra desbotamento precoce.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Proteção Térmica Máxima',
      tag: 'Alta Transparência',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Varandas gourmet integradas, livings e janelões com vista livre para o Pão de Açúcar.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade & Conforto Térmico',
      tag: 'Sem Espelho Noturno',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Salas e quartos que necessitam de conforto térmico somado à privacidade diurna.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Controle de Luminosidade & Calor',
      tag: 'Grafite Nobre',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Quartos, escritórios e consultórios com forte reflexo e claridade.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Refletiva',
      category: 'Rejeição Solar Comercial',
      tag: 'Alta Eficiência',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Salas comerciais e fachadas envidraçadas na Praia de Botafogo.',
      priceNote: 'A partir de R$ 90/m² instalado',
    },
  ],
  coverageLocations: [
    'Rua Voluntários da Pátria',
    'Rua São Clemente',
    'Rua Mena Barreto',
    'Rua Real Grandeza',
    'Praia de Botafogo',
    'Rua General Polidoro',
    'Rua Sorocaba',
    'Rua Visconde de Ouro Preto',
    'Rua Visconde de Silva (Humaitá)',
    'Rua Humaitá',
    'Largo dos Leões',
    'Botafogo Praia Shopping e proximidades',
  ],
  faqs: [
    {
      q: 'A película Nano Cerâmica realmente não altera a fachada do prédio em Botafogo?',
      a: 'Sim! A película Nano Cerâmica 70% foi desenvolvida especificamente para condomínios com convenções rígidas de fachada. Ela possui índice de reflexão similar ao próprio vidro incolor, rejeitando o calor de forma seletiva sem criar reflexo espelhado ou tom escuro por fora.',
    },
    {
      q: 'Qual é a economia média no uso do ar-condicionado?',
      a: 'Ao bloquear até 95% do calor infravermelho diretamente na esquadria de vidro, o ar-condicionado atinge a temperatura desejada muito mais rápido e opera em rotação econômica. Em dias quentes, a economia de energia na climatização pode alcançar até 30%.',
    },
    {
      q: 'A LUME realiza visita técnica e medição gratuita em Botafogo e Humaitá?',
      a: 'Sim, realizamos visitas técnicas com medição de vidros sem nenhum custo ou compromisso em qualquer endereço de Botafogo e Humaitá, apresentando amostras reais das películas aplicadas.',
    },
    {
      q: 'A película pode ser instalada em portas de correr de varanda?',
      a: 'Com certeza. Realizamos a aplicação sob medida em portas de correr, basculantes e cortinas de vidro articuladas, com corte milimétrico de precisão e acabamento rente às borrachas de vedação.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Botafogo', url: 'https://lumecontrolesolar.com.br/insulfilm-em-botafogo/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-botafogo/#localbusiness',
      name: 'LUME Controle Solar - Botafogo & Humaitá',
      image: 'https://lumecontrolesolar.com.br/botafogo_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-em-botafogo/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9519,
        longitude: -43.1843,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Botafogo' },
        { '@type': 'Neighborhood', name: 'Humaitá' },
        { '@type': 'Neighborhood', name: 'Urca' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 33,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Térmico em Botafogo RJ',
      serviceType: 'Aplicação de Películas de Controle Térmico e Redução de Calor',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-botafogo/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Botafogo',
      },
      description:
        'Aplicação de películas Nano Cerâmica de alta rejeição térmica para apartamentos e varandas em Botafogo e Humaitá com garantia de até 10 anos.',
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
      mainEntity: botafogoConfig.faqs.map((faq) => ({
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

export default function BotafogoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={botafogoConfig} />
    </>
  );
}

