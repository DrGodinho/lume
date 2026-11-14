import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm na Urca RJ | Películas Anti-Maresia & Nano Cerâmica - LUME',
  description:
    'Aplicação de insulfilm na Urca com resistência absoluta à maresia e bloqueio solar de até 95%. Nano Cerâmica de alta tecnologia com o valor mais justo da Zona Sul. Medição gratuita.',
  keywords: [
    'insulfilm na urca',
    'insulfilm urca rj',
    'pelicula termica urca',
    'insulfilm nano ceramica urca',
    'insulfilm praia vermelha',
    'insulfilm enseada de botafogo urca',
    'pelicula anti maresia urca',
    'lume controle solar urca'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-urca/' },
  openGraph: {
    title: 'Insulfilm na Urca RJ | LUME Controle Solar',
    description:
      'Soluções térmicas e anti-maresia para residências e apartamentos na Urca. Corte de calor extremo e visão panorâmica cristalina.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-urca/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/urca_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm na Urca RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Urca RJ | LUME Controle Solar',
    description:
      'Películas de controle solar resistentes à maresia na Urca. Bloqueio UV e corte térmico de até 95%.',
    images: ['https://lumecontrolesolar.com.br/urca_hero_bg.webp'],
  },
};

const urcaConfig: NeighborhoodConfig = {
  name: 'Urca',
  region: 'Zona Sul do Rio de Janeiro',
  heroBadge: 'Atendimento Especializado na Urca & Praia Vermelha',
  heroBg: '/urca_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'na', 'Urca', 'RJ'],
  heroGoldIndices: [2],
  subtitleBadge: 'Blindagem Anti-Maresia & Conforto Térmico de Elite',
  description:
    'Proteção solar avançada para um dos bairros mais nobres e históricos do Rio. Nossa Nano Cerâmica 100% dielétrica é totalmente imune à maresia da Baía e Praia Vermelha, rejeitando até 95% do calor do sol com a proposta mais vantajosa e transparente da Zona Sul.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20da%20Urca%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Alívio térmico imediato nos vidros' },
    { target: '100', suffix: '%', label: 'Imunidade à Maresia Salina', sublabel: 'Cerâmica pura livre de metais' },
    { target: '99', suffix: '.9%', label: 'Filtro Solar UV400 Máximo', sublabel: 'Preservação de pisos e móveis' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual Formal', sublabel: 'Não oxida e não descasca' },
  ],
  localPainsTitle: 'Desafios Térmicos e Salinos Específicos da Urca',
  localPainsSubtitle: 'Preservação Arquitetônica e Resistência à Maresia',
  localPains: [
    {
      title: 'Proteja-se do Calor sem Perder a Vista da Baía e do Pão de Açúcar',
      problem:
        'Apartamentos na Av. Portugal e Rua Marechal Cantuária possuem vistas espetaculares da enseada. Películas comuns escuras ou metalizadas criam reflexos espelhados incômodos e obscurecem a paisagem marítima.',
      solution:
        'A nanotecnologia cerâmica proporciona transparência cristalina pura com baixa refletividade interna, garantindo contemplação límpida dia e noite enquanto bloqueia o calor radiante.',
    },
    {
      title: 'Blindagem Anti-Maresia sem Oxidação nem Manchas Brancas',
      problem:
        'O ar marinho constante da enseada oxida películas metalizadas baratas em poucos meses, provocando descascamento, bolhas e perda de transparência.',
      solution:
        'Nossa linha Nano Cerâmica é composta por partículas minerais cerâmicas dielétricas (sem nenhum átomo de metal), sendo 100% resistente à corrosão salina com garantia de até 10 anos.',
    },
    {
      title: 'Conformidade Rigorosa com o Patrimônio e Estética da Urca',
      problem:
        'A arquitetura histórica e as convenções condominiais da Urca proíbem películas espelhadas ou chamativas que interfiram na harmonia visual das fachadas.',
      solution:
        'Nossas películas térmicas mantêm o aspecto 100% original e translúcido dos vidros, com aprovação irrestrita em síndicos e comissões arquitetônicas.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Proteção Térmica Máxima & Anti-Maresia',
      tag: 'Mais Pedida na Urca',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Janelas e varandas de frente para o mar, salas com vista livre e coberturas.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade & Alto Conforto Visual',
      tag: 'Sem Espelho Noturno',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Dormitórios e livings voltados para vias de passagem ou edifícios próximos.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Estética Nobre & Redução de Ofuscamento',
      tag: 'Tom Grafite Puro',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Quartos e áreas de home office que necessitam de conforto visual contra claridade.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Antivandalismo PS8',
      category: 'Segurança Reforçada & Retenção de Vidro',
      tag: 'Linha PS8 (200 µm)',
      heatRejection: 2,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Portas de acesso, áreas térreas e janelas expostas a ventos fortes.',
      priceNote: 'A partir de R$ 160/m² instalado',
    },
  ],
  coverageLocations: [
    'Avenida Portugal',
    'Rua Marechal Cantuária',
    'Rua Urbano Santos',
    'Rua São Sebastião',
    'Rua Ramon Franco',
    'Rua Cândido Gaffrée',
    'Praia Vermelha & Praça General Tibúrcio',
    'Fortaleza de São João & Arredores',
    'Quadrilátero Histórico da Urca',
  ],
  faqs: [
    {
      q: 'A película aguenta a maresia constante da orla da Urca?',
      a: 'Sim. Nossa película Nano Cerâmica é formulada sem componentes metálicos (tecnologia dielétrica 100% inorgânica). Ela não oxida, não cria bordas brancas e não descasca sob a névoa salina da Urca, contando com certificado formal de garantia de até 10 anos.',
    },
    {
      q: 'Como a LUME oferece a Nano Cerâmica com valor mais competitivo na Zona Sul?',
      a: 'Nossa estrutura opera sem intermediários ou custos de franquias luxuosas, comprando diretamente dos maiores fabricantes mundiais de poliéster cerâmico. O resultado é a tecnologia de corte térmico mais eficiente do mercado internacional a partir de R$ 200/m² com aplicação inclusa.',
    },
    {
      q: 'O insulfilm vai escurecer a sala ou atrapalhar a visão da Baía?',
      a: 'De forma alguma. Trabalhamos com graduações como Nano Cerâmica 70% e 75%, que são praticamente imperceptíveis a olho nu. Elas filtram a radiação infravermelha de calor sem alterar a cor ou a nitidez da vista para a enseada.',
    },
    {
      q: 'Como agendar uma medição técnica na Urca?',
      a: 'Basta enviar uma mensagem no WhatsApp informando o local. Realizamos visita técnica pontual com medição a laser e demonstração de amostras gratuitamente.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Urca', url: 'https://lumecontrolesolar.com.br/insulfilm-na-urca/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-urca/#localbusiness',
      name: 'LUME Controle Solar - Insulfilm na Urca RJ',
      image: 'https://lumecontrolesolar.com.br/urca_hero_bg.webp',
      telephone: businessInfo.phoneE164,
      url: 'https://lumecontrolesolar.com.br/insulfilm-na-urca/',
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9536,
        longitude: -43.1648,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Urca' },
        { '@type': 'Neighborhood', name: 'Praia Vermelha' },
        { '@type': 'City', name: 'Rio de Janeiro' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 23,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Anti-Maresia e Nano Cerâmica na Urca RJ',
      serviceType: 'Aplicação de Películas de Controle Solar e Térmico de Alto Padrão',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-urca/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Urca',
      },
      description:
        'Instalação de películas térmicas Nano Cerâmica resistentes à maresia na Urca. Bloqueio solar de até 95%, proteção UV total e garantia formal de até 10 anos.',
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
      mainEntity: urcaConfig.faqs.map((faq) => ({
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

export default function UrcaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={urcaConfig} />
    </>
  );
}
