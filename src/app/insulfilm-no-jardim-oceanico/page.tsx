import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm no Jardim Oceânico RJ | Privacidade & Antivandalismo - LUME',
  description:
    'Instalação de insulfilm de alto padrão no Jardim Oceânico (Barra da Tijuca). Películas para privacidade em prédios baixos, películas de segurança antivandalismo e Nano Cerâmica. Garantia de até 10 anos. Atendimento VIP no local.',
  keywords: [
    'insulfilm no jardim oceanico',
    'insulfilm jardim oceanico barra da tijuca',
    'pelicula seguranca jardim oceanico',
    'insulfilm olegario maciel',
    'insulfilm antivandalismo jardim oceanico',
    'insulfilm privacidade predio baixo barra',
    'lume controle solar jardim oceanico',
    'insulfilm nano ceramica barra da tijuca',
    'insulfilm praia do pepe'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-oceanico/' },
  openGraph: {
    title: 'Insulfilm no Jardim Oceânico RJ | LUME Controle Solar',
    description:
      'Privacidade absoluta, segurança antivandalismo e proteção térmica para apartamentos e coberturas no Jardim Oceânico. Atendimento VIP com garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-oceanico/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/jardim_oceanico_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm no Jardim Oceânico Barra da Tijuca RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Jardim Oceânico RJ | LUME Controle Solar',
    description:
      'Privacidade, películas de segurança e controle solar no Jardim Oceânico (Barra da Tijuca). Orçamento sem compromisso.',
    images: ['https://lumecontrolesolar.com.br/jardim_oceanico_hero_bg.webp'],
  },
};

const jardimOceanicoConfig: NeighborhoodConfig = {
  name: 'Jardim Oceânico (Barra da Tijuca)',
  region: 'Zona Oeste do Rio de Janeiro',
  heroBadge: 'Atendimento VIP no Jardim Oceânico · Barra da Tijuca',
  heroBg: '/jardim_oceanico_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'no', 'Jardim', 'Oceânico', 'Barra'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Privacidade Total · Películas Antivandalismo · Alto Padrão',
  description:
    'Soluções de alta sofisticação arquitetônica para os edifícios e coberturas do Jardim Oceânico. Garanta privacidade plena em relação à rua, controle térmico de até 95% do calor e máxima segurança com películas antivandalismo.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20do%20Jardim%20Oce%C3%A2nico%20(Barra)%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '100', suffix: '%', label: 'Privacidade Diurna', sublabel: 'Visão externa bloqueada com luz natural' },
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Conforto térmico Nano Cerâmica' },
    { target: '300', suffix: ' µm', label: 'Espessura de Segurança', sublabel: 'Linha Antivandalismo PS4 a PS12' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Películas de estabilidade ótica comprovada' },
  ],
  localPainsTitle: 'Particularidades do Jardim Oceânico',
  localPainsSubtitle: 'Privacidade e Segurança em Prédios Baixos',
  localPains: [
    {
      title: 'Privacidade em Prédios Baixos e Térreos',
      problem:
        'A tipologia única do Jardim Oceânico (prédios de até 3 andares em ruas arborizadas como Olegário Maciel e Érico Veríssimo) deixa os moradores expostos aos olhares de pedestres nas calçadas.',
      solution:
        'Películas Dupla Camada e Carbono Premium com efeito de privacidade unidirecional diurna: quem está fora não vê nada por dentro, sem necessidade de cortinas fechadas.',
    },
    {
      title: 'Segurança & Proteção Antivandalismo',
      problem:
        'Apartamentos nos primeiros pavimentos, varandas lineares e portas de vidro de acesso exigem barreira reforçada contra quebra acidental, estilhaços ou tentativas de invasão.',
      solution:
        'Películas de segurança PS4 (100 µm) e PS8 (200 µm) que ancoram o vidro mesmo sob forte impacto mecânico, impedindo fragmentos cortantes e invasões rápidas.',
    },
    {
      title: 'Sol da Orla e Maresia na Praia do Pepê',
      problem:
        'A proximidade do mar traz calor intenso, reflexo forte e maresia corrosiva que costuma degradar películas metalizadas comuns de baixa qualidade.',
      solution:
        'Nano Cerâmica pura 100% dielétrica (sem metais), totalmente imune à oxidação salina e maresia, com até 10 anos de garantia sem bolhas nem desbotamento.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Película de Segurança Antivandalismo',
      category: 'Proteção & Retenção de Vidro',
      tag: 'Segurança Reforçada (PS8)',
      highlight: true,
      heatRejection: 3,
      uvBlock: 5,
      privacy: 3,
      durability: '10 Anos',
      idealFor: 'Apartamentos térreos, portas de entrada de vidro, janelas voltadas para a rua e coberturas.',
      priceNote: 'A partir de R$ 160/m² instalado (linha PS8)',
    },
    {
      name: 'Nano Cerâmica',
      category: 'Controle Térmico sem Escurecer',
      tag: 'Alta Performance',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 2,
      durability: '10 Anos',
      idealFor: 'Salas, varandas de frente e janelas panorâmicas com vista livre.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade Superior',
      tag: 'Sem Espelho Noturno',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Quartos e livings com janela voltada para calçadas ou prédios vizinhos.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Controle de Luminosidade',
      tag: 'Conforto & Discrição',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Áreas de serviço, quartos infantis e escritórios residenciais.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
  ],
  coverageLocations: [
    'Avenida Olegário Maciel',
    'Avenida Érico Veríssimo',
    'Avenida Comandante Júlio de Moura',
    'Avenida General Guedes da Fontoura',
    'Rua Fernando Mattos',
    'Rua Belisário Távora',
    'Rua Alda Garrido',
    'Praça São Perpétuo (Praça do Ó)',
    'Praça Professor José Bernardino',
    'Avenida Ministro Ivan Lins',
    'Avenida Gilberto Amado',
    'Rua Dulce Rodrigues',
    'Praia do Pepê e proximidades',
  ],
  faqs: [
    {
      q: 'A película de segurança antivandalismo impede mesmo que o vidro quebre?',
      a: 'A película absorve o choque mecânico e, caso o vidro seja trincado ou quebrado por pedras, impacto ou tentativa de intrusão, o filme de poliéster de alta densidade (100 a 300 micras) mantém 100% dos fragmentos unidos na moldura, inviabilizando a passagem rápida e evitando acidentes cortantes graves.',
    },
    {
      q: 'É possível ter privacidade durante o dia sem ter que fechar as cortinas no Jardim Oceânico?',
      a: 'Sim! Com as películas Dupla Camada ou Carbono G20, a incidência de luz solar cria um efeito ótico reflexivo para quem olha de fora, garantindo que ninguém na rua consiga ver o interior do apartamento, enquanto você enxerga perfeitamente a rua e as árvores com máxima nitidez.',
    },
    {
      q: 'A maresia da praia do Pepê pode danificar a película?',
      a: 'Nossas películas de Nano Cerâmica e Carbono são totalmente livres de alumínio e ligas metálicas oxidáveis. Portanto, não sofrem oxidação, manchas brancas ou descascamento causado pelo salitre do mar da Barra.',
    },
    {
      q: 'Vocês atendem aos sábados no Jardim Oceânico?',
      a: 'Sim. Compreendemos a rotina dos condomínios residenciais e oferecemos atendimento flexível, inclusive aos sábados pela manhã ou em horários agendados previamente.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Jardim Oceânico (Barra)', url: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-oceanico/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-oceanico/#localbusiness',
      name: 'LUME Controle Solar - Jardim Oceânico Barra da Tijuca',
      image: 'https://lumecontrolesolar.com.br/jardim_oceanico_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-oceanico/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -23.0076,
        longitude: -43.3149,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Jardim Oceânico' },
        { '@type': 'Neighborhood', name: 'Barra da Tijuca' },
        { '@type': 'Neighborhood', name: 'Praia do Pepê' },
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
      name: 'Instalação de Insulfilm no Jardim Oceânico RJ',
      serviceType: 'Aplicação de Películas de Alta Performance, Privacidade e Antivandalismo',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-jardim-oceanico/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Jardim Oceânico (Barra da Tijuca)',
      },
      description:
        'Instalação de insulfilm de alta performance, privacidade para edifícios baixos e películas de segurança antivandalismo no Jardim Oceânico, Barra da Tijuca.',
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
      mainEntity: jardimOceanicoConfig.faqs.map((faq) => ({
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

export default function JardimOceanicoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={jardimOceanicoConfig} />
    </>
  );
}

