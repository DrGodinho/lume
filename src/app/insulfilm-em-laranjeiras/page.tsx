import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm em Laranjeiras RJ | Películas Térmicas e Solares - LUME',
  description:
    'Aplicação especializada de insulfilm em Laranjeiras e Cosme Velho. Películas de alto rendimento térmico Nano Cerâmica com corte de até 95% do calor. Ambientes frescos e agradáveis com garantia de até 10 anos. Orçamento no WhatsApp.',
  keywords: [
    'insulfilm em laranjeiras',
    'insulfilm laranjeiras rj',
    'insulfilm cosme velho',
    'pelicula termica laranjeiras',
    'insulfilm nano ceramica laranjeiras',
    'reducao de calor laranjeiras',
    'insulfilm rua das laranjeiras',
    'lume controle solar laranjeiras'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-laranjeiras/' },
  openGraph: {
    title: 'Insulfilm em Laranjeiras RJ | LUME Controle Solar',
    description:
      'Soluções em redução de calor e controle solar térmico para apartamentos em Laranjeiras e Cosme Velho. Atendimento ágil e garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-laranjeiras/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/laranjeiras_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm em Laranjeiras RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Laranjeiras RJ | LUME Controle Solar',
    description:
      'Conforto térmico de alta performance com películas Nano Cerâmica em Laranjeiras e Cosme Velho.',
    images: ['https://lumecontrolesolar.com.br/laranjeiras_hero_bg.webp'],
  },
};

const laranjeirasConfig: NeighborhoodConfig = {
  name: 'Laranjeiras',
  region: 'Zona Sul do Rio de Janeiro',
  heroBadge: 'Atendimento Especializado em Laranjeiras & Cosme Velho',
  heroBg: '/laranjeiras_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'em', 'Laranjeiras', 'RJ'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Alívio Térmico · Conforto Urbano · Tecnologia Nano Cerâmica',
  description:
    'Controle térmico de excelência para residências em Laranjeiras e Cosme Velho. Amenize a sensação de calor acumulado nos vales urbanos com películas que bloqueiam até 95% da radiação infravermelha, mantendo a luz natural e protegendo seus ambientes.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20de%20Laranjeiras%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20t%C3%A9rmico%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Alívio térmico imediato' },
    { target: '8', suffix: '°C', label: 'Menos na Sensação Térmica', sublabel: 'Climatização eficiente e silenciosa' },
    { target: '99', suffix: '%', label: 'Bloqueio de Raios UV', sublabel: 'Proteção para móveis e pisos' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Durabilidade máxima garantida' },
  ],
  localPainsTitle: 'Desafios do Calor em Laranjeiras',
  localPainsSubtitle: 'Otimização Térmica para o Vale de Laranjeiras',
  localPains: [
    {
      title: 'Calor Retido no Vale Urbano',
      problem:
        'A topografia de Laranjeiras cria um efeito de retenção térmica nas tardes de verão. O calor penetra pelas janelas de prédios na Rua das Laranjeiras e General Glicério e permanece nos cômodos à noite.',
      solution:
        'A película Nano Cerâmica bloqueia o calor antes que ele transpasse o vidro, mantendo as paredes e pisos frios e amenizando a sensação de abafamento.',
    },
    {
      title: 'Conforto para Home Office e Descanso',
      problem:
        'O excesso de luminosidade e calor direto cansa os olhos e sobrecarrega os aparelhos de ar-condicionado durante o horário de trabalho em casa.',
      solution:
        'Filtragem seletiva de luz que reduz o ofuscamento sem escurecer os ambientes, criando um clima agradável e fresco para o dia a dia.',
    },
    {
      title: 'Películas de Alta Estabilidade Ótica',
      problem:
        'Películas inferiores descascam e ficam arroxeadas com facilidade devido à alternância de umidade da serra com o sol intenso.',
      solution:
        'Utilizamos somente poliéster puro com partículas de cerâmica inorgânica, imunes a desbotamentos e com certificado de garantia de até 10 anos.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica IR95',
      category: 'Proteção Térmica Avançada',
      tag: 'Alta Transparência',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 2,
      durability: '10 Anos',
      idealFor: 'Salas com janelas voltadas para o sol da tarde e quartos residenciais.',
      priceNote: 'A partir de R$ 220/m² instalado',
    },
    {
      name: 'Carbono Elite Térmico',
      category: 'Controle de Calor & Claridade',
      tag: 'Excelente Custo-Benefício',
      heatRejection: 4,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Quartos infantis, home offices e áreas de serviço.',
      priceNote: 'A partir de R$ 90/m² instalado',
    },
    {
      name: 'Dupla Camada Cerâmica',
      category: 'Privacidade & Conforto Térmico',
      tag: 'Sem Espelho Noturno',
      heatRejection: 4,
      uvBlock: 5,
      privacy: 4,
      durability: '7 Anos',
      idealFor: 'Salas e apartamentos com vista direta para edifícios vizinhos.',
      priceNote: 'A partir de R$ 150/m² instalado',
    },
    {
      name: 'Película Jateada Elegance',
      category: 'Design & Privacidade 24h',
      tag: 'Luz Difusa',
      heatRejection: 2,
      uvBlock: 4,
      privacy: 5,
      durability: '10 Anos',
      idealFor: 'Janelas de banheiro, cozinhas e divisórias residenciais.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
  ],
  coverageLocations: [
    'Rua das Laranjeiras',
    'Rua General Glicério',
    'Rua Alice',
    'Rua Pinheiro Machado',
    'Rua Conde de Baependi',
    'Rua Presidente Carlos de Campos',
    'Praça São Salvador',
    'Rua Cosme Velho',
    'Rua Mário Portela',
    'Rua Belisário Távora',
    'Rua Soares Cabral',
    'Largo do Boticário e arredores',
  ],
  faqs: [
    {
      q: 'A película Nano Cerâmica ajuda a reduzir o calor mesmo em dias sem vento em Laranjeiras?',
      a: 'Sim. O calor entra nas residências através da radiação infravermelha do sol que atinge o vidro e irradia para móveis e paredes. A película reflete e absorve seletivamente até 95% dessa energia térmica no próprio vidro, impedindo o acúmulo de calor no interior do apartamento.',
    },
    {
      q: 'A aplicação do insulfilm danifica esquadrias antigas de madeira ou alumínio?',
      a: 'Não. Nossa aplicação é limpa e não agride as esquadrias. Nossos técnicos utilizam protetores absorventes e produtos neutros de instalação, respeitando a conservação de prédios clássicos em Laranjeiras.',
    },
    {
      q: 'Vocês realizam medição gratuita no meu endereço?',
      a: 'Sim! Agendamos a visita técnica gratuita para tirar medidas precisas e apresentar o catálogo de amostras na Rua das Laranjeiras, General Glicério, Cosme Velho ou qualquer rua da região.',
    },
    {
      q: 'A película fica escura por dentro à noite?',
      a: 'Com a linha Nano Cerâmica, a visibilidade continua clara e transparente tanto de dia quanto à noite, sem criar efeito de espelho interno com as lâmpadas acesas.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Laranjeiras', url: 'https://lumecontrolesolar.com.br/insulfilm-em-laranjeiras/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-laranjeiras/#localbusiness',
      name: 'LUME Controle Solar - Laranjeiras & Cosme Velho',
      image: 'https://lumecontrolesolar.com.br/laranjeiras_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-em-laranjeiras/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9341,
        longitude: -43.1895,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Laranjeiras' },
        { '@type': 'Neighborhood', name: 'Cosme Velho' },
        { '@type': 'Neighborhood', name: 'Silvestre' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 25,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Térmico em Laranjeiras RJ',
      serviceType: 'Aplicação de Películas de Controle Térmico e Redução de Calor',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-laranjeiras/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Laranjeiras',
      },
      description:
        'Instalação de películas térmicas de alta tecnologia em Laranjeiras e Cosme Velho. Bloqueio de até 95% do calor com garantia de até 10 anos.',
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
      mainEntity: laranjeirasConfig.faqs.map((faq) => ({
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

export default function LaranjeirasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={laranjeirasConfig} />
    </>
  );
}

