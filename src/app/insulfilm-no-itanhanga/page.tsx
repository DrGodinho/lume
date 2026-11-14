import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm no Itanhangá RJ | Películas para Mansões & Nano Cerâmica - LUME',
  description:
    'Instalação de insulfilm no Itanhangá em condomínios de luxo e mansões. Corte térmico de até 95% para grandes panos de vidro e claraboias. Melhor custo-benefício em Nano Cerâmica do Rio.',
  keywords: [
    'insulfilm no itanhanga',
    'insulfilm itanhanga rj',
    'pelicula termica itanhanga',
    'insulfilm nano ceramica itanhanga',
    'insulfilm condominio greenwood park',
    'insulfilm portinho do itanhanga',
    'pelicula teto de vidro itanhanga',
    'lume controle solar itanhanga'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-itanhanga/' },
  openGraph: {
    title: 'Insulfilm no Itanhangá RJ | LUME Controle Solar',
    description:
      'Películas de controle térmico e segurança para mansões e grandes residências no Itanhangá. Alta tecnologia com o melhor preço instalado.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-itanhanga/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/itanhanga_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm no Itanhangá RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Itanhangá RJ | LUME Controle Solar',
    description:
      'Soluções térmicas e antivandalismo para condomínios fechados no Itanhangá. Garantia de até 10 anos.',
    images: ['https://lumecontrolesolar.com.br/itanhanga_hero_bg.webp'],
  },
};

const itanhangaConfig: NeighborhoodConfig = {
  name: 'Itanhangá',
  region: 'Zona Oeste do Rio de Janeiro',
  heroBadge: 'Atendimento VIP em Condomínios Fechados do Itanhangá',
  heroBg: '/itanhanga_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'no', 'Itanhangá', 'RJ'],
  heroGoldIndices: [2],
  subtitleBadge: 'Grandes Vãos de Vidro & Alto Padrão com o Melhor Preço',
  description:
    'Especialistas em climatização e proteção solar para mansões e residências de arquitetura imponente no Itanhangá. Redução de até 8°C na sensação térmica em grandes vãos de vidro e claraboias com a linha Nano Cerâmica mais avançada e acessível do mercado carioca.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20do%20Itanhang%C3%A1%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20minha%20resid%C3%AAncia.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Grandes vãos de vidro e fachadas' },
    { target: '35', suffix: '%', label: 'Economia na Fatura de Luz', sublabel: 'Ar-condicionado mais eficiente' },
    { target: '99', suffix: '.9%', label: 'Filtro UV400 Absoluto', sublabel: 'Proteção para pisos e obras nobres' },
    { target: '10', suffix: ' Anos', label: 'Garantia Formal Certificada', sublabel: 'Durabilidade máxima assegurada' },
  ],
  localPainsTitle: 'Particularidades Térmicas e Arquitetônicas do Itanhangá',
  localPainsSubtitle: 'Grandes Áreas Envidraçadas em Vales Tropicais',
  localPains: [
    {
      title: 'Fim do Efeito Forno em Panos de Vidro com Pé-Direito Duplo',
      problem:
        'Mansões no Portinho, Greenwood Park e arredores do Itanhangá Golf Club contam com vãos monumentais de vidro e claraboias que concentram calor extremo nas salas e mezaninos.',
      solution:
        'A Nano Cerâmica dissipa a radiação infravermelha antes que ela penetre no ambiente, reduzindo a temperatura em até 8°C e permitindo desfrutar dos livings com conforto absoluto.',
    },
    {
      title: 'Proteção UV: Blindagem para Madeiras Nobres, Estofados e Pele',
      problem:
        'A insolação agressiva sem barreiras descolora assoalhos de madeira maciça, danifica tapeçarias e móveis de design e causa danos precoces à pele de quem frequenta as áreas envidraçadas.',
      solution:
        'Filtro solar UV de 99,9% que funciona como um escudo protetor contra o envelhecimento precoce dos materiais nobres e preserva a saúde de toda a família.',
    },
    {
      title: 'Segurança Reforçada contra Tempestades e Quebras (Antivandalismo)',
      problem:
        'A proximidade do Maciço da Tijuca provoca rajadas repentinas de vento e tempestades que podem projetar galhos ou objetos contra grandes portas de vidro.',
      solution:
        'Películas de segurança PS4 e PS8 que aumentam a rigidez estrutural do vidro e retêm todos os fragmentos presos à película em caso de impacto, impedindo acidentes com crianças e pets.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Proteção Térmica Máxima & Transparência',
      tag: 'Mais Escolhida no Itanhangá',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Pé-direito duplo, claraboias, tetos de vidro e livings integrados à piscina.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Antivandalismo PS8',
      category: 'Segurança Estrutural & Retenção de Vidro',
      tag: 'Segurança Reforçada',
      heatRejection: 2,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Portas de correr panorâmicas, guarda-corpos e vãos térreos de residências.',
      priceNote: 'A partir de R$ 160/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade & Rejeição Térmica Robusta',
      tag: 'Sem Espelho Noturno',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Suítes máster e salas íntimas com forte incidência de sol da tarde.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Estética Grafite & Redução de Brilho',
      tag: 'Tom Grafite Nobre',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Espaços gourmet, quartos e home theaters.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
  ],
  coverageLocations: [
    'Condomínio Portinho do Itanhangá',
    'Condomínio Greenwood Park',
    'Condomínio Reserva do Itanhangá',
    'Condomínio Floresta da Barra',
    'Estrada da Barra da Tijuca',
    'Estrada do Itanhangá',
    'Itanhangá Golf Club & Arredores',
    'Morro do Banco & Eixo Residencial',
    'Estrada do Joá (Acesso Itanhangá)',
  ],
  faqs: [
    {
      q: 'A LUME atende com instalação em tetos de vidro e claraboias no Itanhangá?',
      a: 'Sim. Dispomos de equipe técnica habilitada com andaimes, escadas telescópicas e equipamentos de segurança para instalação em pé-direito duplo, claraboias e coberturas envidraçadas.',
    },
    {
      q: 'Por que a Nano Cerâmica da LUME tem o melhor preço do Rio?',
      a: 'Temos fornecimento direto das fábricas internacionais de poliéster cerâmico em escala industrial, sem intermediários comerciais. Por isso oferecemos películas de altíssima rejeição térmica (até 95%) a partir de R$ 200/m² instalado com garantia de até 10 anos.',
    },
    {
      q: 'A película aguenta o calor forte do vale do Itanhangá sem criar bolhas?',
      a: 'Sim. Utilizamos filmes de primeira linha com adesivo acrílico de cura rápida e camada anti-risco de alta densidade. Nossas películas não delaminam, não criam bolhas e mantêm estabilidade de cor por até 10 anos garantidos em contrato.',
    },
    {
      q: 'Como solicitar orçamento para residências de grande metragem no Itanhangá?',
      a: 'Basta entrar em contato via WhatsApp. Enviamos um técnico sênior para medição a laser, análise de insolação de cada fachada e elaboração de proposta personalizada no mesmo dia.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Itanhangá', url: 'https://lumecontrolesolar.com.br/insulfilm-no-itanhanga/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-itanhanga/#localbusiness',
      name: 'LUME Controle Solar - Insulfilm no Itanhangá RJ',
      image: 'https://lumecontrolesolar.com.br/itanhanga_hero_bg.webp',
      telephone: businessInfo.phoneE164,
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-itanhanga/',
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9961,
        longitude: -43.2981,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Itanhangá' },
        { '@type': 'City', name: 'Rio de Janeiro' },
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
      name: 'Instalação de Insulfilm Térmico e Nano Cerâmica no Itanhangá RJ',
      serviceType: 'Aplicação de Películas de Controle Solar e Térmico para Residências de Alto Luxo',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-itanhanga/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Itanhangá',
      },
      description:
        'Instalação especializada de películas de controle solar, Nano Cerâmica e antivandalismo em mansões e condomínios no Itanhangá. Bloqueio térmico de até 95% e garantia de até 10 anos.',
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
      mainEntity: itanhangaConfig.faqs.map((faq) => ({
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

export default function ItanhangaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={itanhangaConfig} />
    </>
  );
}
