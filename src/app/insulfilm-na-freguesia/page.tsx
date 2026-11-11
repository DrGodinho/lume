import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm na Freguesia Jacarepaguá RJ | Varandas & Películas Térmicas - LUME',
  description:
    'Aplicação especializada de insulfilm na Freguesia (Jacarepaguá). Películas Nano Cerâmica para varandas gourmet e cortinas de vidro: bloqueio de até 95% do calor sem alterar a fachada. Garantia de até 10 anos. Orçamento expresso pelo WhatsApp.',
  keywords: [
    'insulfilm na freguesia',
    'insulfilm freguesia jacarepagua',
    'insulfilm freguesia rj',
    'película para varanda freguesia',
    'insulfilm nano ceramica freguesia',
    'insulfilm residencial freguesia',
    'cortina de vidro freguesia insulfilm',
    'lume controle solar freguesia',
    'insulfilm estrada dos tres rios',
    'preco insulfilm freguesia'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-freguesia/' },
  openGraph: {
    title: 'Insulfilm na Freguesia Jacarepaguá RJ | LUME Controle Solar',
    description:
      'Soluções térmicas e de privacidade para apartamentos na Freguesia. Redução drástica de calor em varandas e salas. Garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-freguesia/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/freguesia_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm na Freguesia Jacarepaguá RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Freguesia Jacarepaguá RJ | LUME Controle Solar',
    description:
      'Películas de controle solar para varandas gourmet e residências na Freguesia. Orçamento grátis no WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/freguesia_hero_bg.webp'],
  },
};

const freguesiaConfig: NeighborhoodConfig = {
  name: 'Freguesia (Jacarepaguá)',
  region: 'Zona Oeste do Rio de Janeiro',
  heroBadge: 'Atendimento Especializado na Freguesia & Jacarepaguá',
  heroBg: '/freguesia_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'na', 'Freguesia', 'Jacarepaguá'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Varandas Gourmet · Conforto Térmico · Cortinas de Vidro',
  description:
    'Aplicação profissional de películas de alta performance para apartamentos e condomínios na Freguesia. Elimine o efeito estufa na varanda e proteja seus móveis com a tecnologia Nano Cerâmica sem alterar a fachada.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20da%20Freguesia%20(Jacarepagu%C3%A1)%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Linha Nano Cerâmica Premium' },
    { target: '99', suffix: '%', label: 'Bloqueio de Raios UV', sublabel: 'Proteção contra desbotamento de móveis' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Sem bolhas e sem desbotamento roxo' },
    { target: '24', suffix: 'h', label: 'Atendimento Ágil', sublabel: 'Medição técnica rápida na Freguesia' },
  ],
  localPainsTitle: 'Desafios Térmicos e de Fachada na Freguesia',
  localPainsSubtitle: 'Diagnóstico Arquitetônico Local',
  localPains: [
    {
      title: 'Efeito Estufa em Varandas Gourmet',
      problem:
        'A Freguesia possui centenas de condomínios modernos com grandes painéis de cortina de vidro virados para o sol poente. À tarde, a varanda se torna inabitável e esquenta toda a sala.',
      solution:
        'A película Nano Cerâmica 70% rejeita até 95% dos raios infravermelhos (calor), permitindo desfrutar da varanda mesmo nos dias mais quentes do verão carioca.',
    },
    {
      title: 'Regras Rígidas de Condomínio',
      problem:
        'A maioria dos condomínios da Estrada dos Três Rios e Rua Araguaia proíbe películas reflexivas ou escuras que alterem a harmonia estética da fachada externa.',
      solution:
        'Nossas películas térmicas mantêm transparência cristalina com padrão neutro de alto luxo, 100% de acordo com as convenções condominiais.',
    },
    {
      title: 'Desbotamento de Sofás e Pisos Vinílicos',
      problem:
        'A radiação ultravioleta diária resseca couros, queima tecidos finos e mancha revestimentos de madeira e vinílico em poucos meses.',
      solution:
        'Filtro UV400 que bloqueia 99% da radiação ultravioleta, preservando integralmente o investimento feito no acabamento do seu lar.',
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
      idealFor: 'Varandas gourmet, cortinas de vidro e salas com sol da tarde.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade & Sem Espelho Noturno',
      tag: 'Visão Noturna Perfeita',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Salas e varandas que exigem privacidade diurna sem reflexo de espelho por dentro à noite.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Controle de Claridade & Calor',
      tag: 'Privacidade Total',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Quartos, home offices e áreas de serviço com excesso de claridade.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Antivandalismo PS4',
      category: 'Segurança & Retenção de Vidro',
      tag: 'Proteção contra Impacto',
      heatRejection: 1,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Portas de vidro, coberturas e janelas baixas sujeitas a choque mecânico e rajadas de vento.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
  ],
  coverageLocations: [
    'Estrada dos Três Rios',
    'Rua Araguaia',
    'Rua Tirol',
    'Estrada do Bananal',
    'Estrada do Pau-Ferro',
    'Rua Comendador Siqueira',
    'Rua Geminiano Góis',
    'Rua Tenente Renato César',
    'Rua Tirol e transversais',
    'Condomínio Reserva da Freguesia',
    'Condomínio Grand Valley',
    'Condomínio Up Barra',
    'Condomínio Mainsheet',
    'Largo da Freguesia',
  ],
  faqs: [
    {
      q: 'A película Nano Cerâmica altera a cor do vidro ou a fachada do condomínio na Freguesia?',
      a: 'Não. A película Nano Cerâmica 70% ou 75% é praticamente invisível a olho nu na fachada, mantendo a tonalidade original do vidro. Ela rejeita o calor através de partículas cerâmicas invisíveis que bloqueiam a radiação infravermelha, estando 100% em conformidade com as regras de condomínio mais exigentes da Freguesia.',
    },
    {
      q: 'Quanto tempo dura a instalação em uma varanda gourmet com cortina de vidro?',
      a: 'Uma cortina de vidro completa com 10 a 16 lâminas é instalada em média em 3 a 5 horas. Nossa equipe realiza o corte sob medida, limpeza técnica profunda e aplicação sem respingos nem sujeira na sala.',
    },
    {
      q: 'Vocês cobram taxa de visita ou deslocamento para orçamento na Freguesia?',
      a: 'Não cobramos taxa de deslocamento. A medição técnica no seu endereço e o orçamento são 100% gratuitos e sem compromisso. Também podemos adiantar uma estimativa imediata se você enviar a quantidade de lâminas ou a largura da varanda pelo WhatsApp.',
    },
    {
      q: 'A película pode ser limpa normalmente após a instalação?',
      a: 'Sim. Após o período de cura (de 3 a 5 dias), a limpeza é simples, feita com pano de microfibra macio, água e detergente neutro. Todas as nossas películas contam com camada anti-risco (hard coat) para garantir longevidade.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Freguesia (Jacarepaguá)', url: 'https://lumecontrolesolar.com.br/insulfilm-na-freguesia/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-freguesia/#localbusiness',
      name: 'LUME Controle Solar - Freguesia Jacarepaguá',
      image: 'https://lumecontrolesolar.com.br/freguesia_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-na-freguesia/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9421,
        longitude: -43.3421,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Freguesia' },
        { '@type': 'Neighborhood', name: 'Jacarepaguá' },
        { '@type': 'Neighborhood', name: 'Pau-Ferro' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 29,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm na Freguesia Jacarepaguá RJ',
      serviceType: 'Aplicação de Películas de Controle Solar e Térmico para Varandas',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-freguesia/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Freguesia (Jacarepaguá)',
      },
      description:
        'Aplicação especializada de insulfilm de alta tecnologia na Freguesia. Nano Cerâmica para varandas e cortinas de vidro com garantia de até 10 anos.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '80.00',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceType: 'https://schema.org/StartingPrice',
          unitText: 'm²',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: freguesiaConfig.faqs.map((faq) => ({
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

export default function FreguesiaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={freguesiaConfig} />
    </>
  );
}

