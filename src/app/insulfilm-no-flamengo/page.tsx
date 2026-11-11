import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm no Flamengo RJ | Películas Térmicas Nano Cerâmica - LUME',
  description:
    'Aplicação especializada de insulfilm no Flamengo e Catete. Películas Nano Cerâmica para redução de calor em janelões e varandas com preservação da vista da Baía. Bloqueio de 95% do calor solar e garantia de até 10 anos.',
  keywords: [
    'insulfilm no flamengo',
    'insulfilm flamengo rj',
    'insulfilm praia do flamengo',
    'pelicula termica flamengo',
    'insulfilm nano ceramica flamengo',
    'insulfilm senador vergueiro',
    'insulfilm marques de abrantes',
    'lume controle solar flamengo',
    'reducao de calor flamengo'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-flamengo/' },
  openGraph: {
    title: 'Insulfilm no Flamengo RJ | LUME Controle Solar',
    description:
      'Controle solar e conforto térmico para apartamentos amplos no Flamengo. Redução de calor com máxima transparência e garantia de 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-flamengo/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/flamengo_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm no Flamengo RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Flamengo RJ | LUME Controle Solar',
    description:
      'Películas de controle térmico de alta tecnologia para edifícios residenciais no Flamengo. Orçamento no WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/flamengo_hero_bg.webp'],
  },
};

const flamengoConfig: NeighborhoodConfig = {
  name: 'Flamengo',
  region: 'Zona Sul do Rio de Janeiro',
  heroBadge: 'Atendimento Premium no Flamengo & Catete',
  heroBg: '/flamengo_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'no', 'Flamengo', 'RJ'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Alívio Térmico · Proteção UV de Móveis · Vista Panorâmica',
  description:
    'Soluções de alta performance térmica para os amplos apartamentos e edifícios clássicos do Flamengo. Bloqueie até 95% do calor do sol da manhã e da tarde sem perder a luminosidade e a vista espetacular para o Parque do Flamengo e a Baía de Guanabara.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20do%20Flamengo%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20t%C3%A9rmico%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Conforto térmico absoluto' },
    { target: '99', suffix: '%', label: 'Bloqueio de Raios UV', sublabel: 'Preservação de pisos nobres e sofás' },
    { target: '8', suffix: '°C', label: 'Redução na Sensação Térmica', sublabel: 'Climatização mais rápida e econômica' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Películas de estabilidade garantida' },
  ],
  localPainsTitle: 'Particularidades Térmicas no Flamengo',
  localPainsSubtitle: 'Conforto em Prédios Históricos e Clássicos',
  localPains: [
    {
      title: 'Janelões Amplos e Sol da Manhã Feroz',
      problem:
        'Apartamentos na Praia do Flamengo e Senador Vergueiro contam com janelas monumentais de ponta a ponta. O sol da manhã aquece o ambiente precocemente, mantendo a sala abafada ao longo de todo o dia.',
      solution:
        'A película Nano Cerâmica filtra os raios de calor infravermelho mantendo 70% da luz natural, estabilizando o clima com leveza e frescor.',
    },
    {
      title: 'Preservação de Pisos de Madeira e Obras de Arte',
      problem:
        'A forte incidência de raios UV descolora assoalhos de taco peroba, cortinas e mobília de valor em salas com grandes aberturas de vidro.',
      solution:
        'Proteção UV400 com 99.9% de filtragem, criando uma barreira transparente que impede o envelhecimento precoce de acabamentos nobres.',
    },
    {
      title: 'Preservação da Vista da Baía e Pão de Açúcar',
      problem:
        'Moradores temem que películas escuras ou espelhadas estraguem a vista privilegiada do Parque do Flamengo e da enseada.',
      solution:
        'A tecnologia Nano Cerâmica é totalmente neutra e anti-reflexiva, garantindo nitidez cristalina tanto de dia quanto à noite.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Proteção Térmica & Transparência',
      tag: 'Alta Performance',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Janelões panorâmicos da Praia do Flamengo, livings e varandas envidraçadas.',
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
      idealFor: 'Quartos e salas com janelas próximas a prédios vizinhos na Senador Vergueiro e Paissandu.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Controle de Luminosidade',
      tag: 'Tonalidade Grafite',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Quartos, home offices e ambientes com excesso de brilho solar.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Antivandalismo PS4',
      category: 'Proteção & Estabilidade',
      tag: 'Retenção Estrutural',
      heatRejection: 1,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Janelas basculantes antigas e portas de vidro temperado.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
  ],
  coverageLocations: [
    'Praia do Flamengo',
    'Rua Senador Vergueiro',
    'Rua Marquês de Abrantes',
    'Rua Paissandu',
    'Rua Corrêa Dutra',
    'Rua Ferreira Viana',
    'Rua Silveira Martins',
    'Rua Buarque de Macedo',
    'Rua Barão do Flamengo',
    'Largo do Machado',
    'Avenida Oswaldo Cruz',
    'Rua Dois de Dezembro',
  ],
  faqs: [
    {
      q: 'A película Nano Cerâmica reduz a vista do Parque do Flamengo e do mar?',
      a: 'Não. A Nano Cerâmica foi projetada com alta transmissão de luz visível (70%), atuando no espectro invisível da luz infravermelha. Você mantém a vista deslumbrante e nítida para a Baía de Guanabara, mas sem o calor escaldante.',
    },
    {
      q: 'O insulfilm pode ser aplicado em janelas antigas com esquadria de ferro ou madeira no Flamengo?',
      a: 'Sim. Nossos técnicos realizam a preparação minuciosa do vidro, removendo qualquer resíduo antigo e aplicando o filme com corte de precisão ajustado milimetricamente às molduras clássicas dos edifícios do Flamengo.',
    },
    {
      q: 'A película ajuda a proteger o piso de madeira contra o sol?',
      a: 'Com certeza. Ao cortar 99% dos raios ultravioleta (UVA e UVB), a película evita que o sol queime o verniz, clareie ou rache tábuas de madeira nobre e tacos clássicos.',
    },
    {
      q: 'Quanto tempo dura a instalação em um apartamento no Flamengo?',
      a: 'A aplicação em uma sala de estar com janelão completo dura em média de 2 a 3 horas. Nosso trabalho é extremamente limpo, com proteção de rodapés, cortinas e estofados durante todo o processo.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Flamengo', url: 'https://lumecontrolesolar.com.br/insulfilm-no-flamengo/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-flamengo/#localbusiness',
      name: 'LUME Controle Solar - Flamengo & Catete',
      image: 'https://lumecontrolesolar.com.br/flamengo_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-flamengo/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9329,
        longitude: -43.1764,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Flamengo' },
        { '@type': 'Neighborhood', name: 'Catete' },
        { '@type': 'Neighborhood', name: 'Largo do Machado' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 28,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Térmico no Flamengo RJ',
      serviceType: 'Aplicação de Películas de Controle Solar e Térmico para Janelas',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-flamengo/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Flamengo',
      },
      description:
        'Aplicação de películas térmicas Nano Cerâmica para apartamentos no Flamengo com retenção de calor de até 95% e garantia de até 10 anos.',
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
      mainEntity: flamengoConfig.faqs.map((faq) => ({
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

export default function FlamengoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={flamengoConfig} />
    </>
  );
}

