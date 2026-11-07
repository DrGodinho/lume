import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm em São Conrado RJ | Películas Térmicas Nano Cerâmica - LUME',
  description:
    'Aplicação especializada de insulfilm em São Conrado. Películas Nano Cerâmica resistentes à maresia para condomínios de alto padrão: bloqueio de até 95% do calor solar sem alterar a fachada. Garantia de até 10 anos. Atendimento VIP no local.',
  keywords: [
    'insulfilm em sao conrado',
    'insulfilm sao conrado rj',
    'pelicula termica sao conrado',
    'insulfilm nano ceramica sao conrado',
    'insulfilm sao conrado green',
    'insulfilm mendes de morais',
    'insulfilm village sao conrado',
    'pelicula resistente a maresia sao conrado',
    'lume controle solar sao conrado'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-sao-conrado/' },
  openGraph: {
    title: 'Insulfilm em São Conrado RJ | LUME Controle Solar',
    description:
      'Soluções de controle térmico e proteção solar para grandes panos de vidro em São Conrado. Resistência absoluta à maresia e garantia de 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-sao-conrado/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/saoconrado_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm em São Conrado RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em São Conrado RJ | LUME Controle Solar',
    description:
      'Películas térmicas de alta tecnologia imunes à maresia para edifícios e residências em São Conrado.',
    images: ['https://lumecontrolesolar.com.br/saoconrado_hero_bg.webp'],
  },
};

const saoConradoConfig: NeighborhoodConfig = {
  name: 'São Conrado',
  region: 'Zona Sul do Rio de Janeiro',
  heroBadge: 'Atendimento Exclusivo em São Conrado',
  heroBg: '/saoconrado_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'em', 'São', 'Conrado', 'RJ'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Grandes Panos de Vidro · Imune à Maresia · Nano Cerâmica',
  description:
    'Controle solar e térmico de alto padrão para os edifícios e residências exclusivas de São Conrado. Corte até 95% do calor solar e elimine os efeitos corrosivos da maresia sem perder a vista privilegiada para o mar e a Pedra da Gávea.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20de%20S%C3%A3o%20Conrado%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20t%C3%A9rmico%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Barreira térmica definitiva' },
    { target: '100', suffix: '%', label: 'Imunidade à Maresia', sublabel: 'Película cerâmica livre de metais' },
    { target: '99', suffix: '%', label: 'Bloqueio de Raios UV', sublabel: 'Proteção para móveis e acervos finos' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Sem bolhas, descascamento ou desbotamento' },
  ],
  localPainsTitle: 'Particularidades Térmicas de São Conrado',
  localPainsSubtitle: 'Exigências de Luxo Frente ao Mar e Montanha',
  localPains: [
    {
      title: 'Grandes Vãos de Vidro e Insolação Refletida',
      problem:
        'Condomínios como São Conrado Green, Village São Conrado e edifícios da Av. Mendes de Morais possuem panos de vidro gigantescos que recebem forte calor do sol e o reflexo contínuo da praia.',
      solution:
        'A película Nano Cerâmica dissipa a radiação solar diretamente no vidro, estabilizando o ambiente com elegância e sem sobrecarregar o ar-condicionado.',
    },
    {
      title: 'Maresia Agressiva da Praia de São Conrado',
      problem:
        'Filmes metalizados de baixa qualidade oxidam, ganham manchas brancas e descascam em poucos meses devido à névoa salina vinda do oceano.',
      solution:
        'Nossa linha Nano Cerâmica é 100% cerâmica pura dielétrica, totalmente livre de partículas metálicas, garantindo durabilidade perfeita por até 10 anos.',
    },
    {
      title: 'Preservação da Vista para o Mar e Pedra da Gávea',
      problem:
        'Películas escuras ou espelhadas estragam a vista panorâmica e causam reflexos incômodos nas salas e varandas envidraçadas.',
      solution:
        'Transparência cristalina de até 70% com reflexão ótica neutra, preservando a vista cinematográfica tanto de dia quanto à noite.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Proteção Térmica Máxima & Anti-Maresia',
      tag: 'Alta Performance',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 2,
      durability: '10 Anos',
      idealFor: 'Grandes panos de vidro da orla, livings panorâmicos e varandas envidraçadas.',
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
      idealFor: 'Quartos e salas voltadas para vias de acesso ou edifícios vizinhos.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Controle de Luminosidade',
      tag: 'Grafite Elegante',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Quartos, home cinema e ambientes com alta intensidade de claridade.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Película de Segurança PS8 Antivandalismo',
      category: 'Proteção Antivandalismo & Rajadas',
      tag: 'Retenção Estrutural Pesada',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 2,
      durability: '10 Anos',
      idealFor: 'Portas de correr panorâmicas, claraboias e coberturas contra fortes rajadas de vento.',
      priceNote: 'A partir de R$ 160/m² instalado',
    },
  ],
  coverageLocations: [
    'Avenida Prefeito Mendes de Morais',
    'Estrada da Gávea',
    'Avenida Niemeyer',
    'Rua São Conrado',
    'Rua Bertha Lutz',
    'Rua Capuri',
    'Rua Princesa Diana de Gales',
    'Condomínio São Conrado Green',
    'Condomínio Village São Conrado',
    'Condomínio Chácara da Tijuca',
    'Edifício Praia Mar',
    'Niemeyer 360 Residence',
    'Fashion Mall e imediações',
  ],
  faqs: [
    {
      q: 'A maresia de São Conrado não vai oxidar a película com o tempo?',
      a: 'Não. Ao contrário de películas comuns que contêm alumínio e metais ferrosos que oxidam e criam manchas esbranquiçadas, a película Nano Cerâmica da LUME é composta exclusivamente por partículas nanocerâmicas inorgânicas, sendo 100% resistente ao salitre e imune à corrosão marinha.',
    },
    {
      q: 'A película pode ser instalada em vidros de pé-direito duplo ou de grande porte?',
      a: 'Sim. Nossa equipe é especializada em grandes envidraçamentos e coberturas de alto padrão em São Conrado, utilizando equipamentos apropriados de elevação, andaimes seguros e corte de alta precisão.',
    },
    {
      q: 'A película reduz a claridade ou a vista para o mar?',
      a: 'Não. A Nano Cerâmica atua de forma seletiva: filtra 95% do calor infravermelho e 99% da radiação UV sem bloquear a passagem da luz visível, mantendo a vista deslumbrante da praia e das montanhas.',
    },
    {
      q: 'Como é feito o orçamento em São Conrado?',
      a: 'Basta entrar em contato pelo WhatsApp. Realizamos atendimento personalizado com visita técnica e medição gratuita em qualquer condomínio ou residência de São Conrado.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'São Conrado', url: 'https://lumecontrolesolar.com.br/insulfilm-em-sao-conrado/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-sao-conrado/#localbusiness',
      name: 'LUME Controle Solar - São Conrado',
      image: 'https://lumecontrolesolar.com.br/saoconrado_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-em-sao-conrado/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9997,
        longitude: -43.2642,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'São Conrado' },
        { '@type': 'Neighborhood', name: 'Praia de São Conrado' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 32,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Térmico em São Conrado RJ',
      serviceType: 'Aplicação de Películas de Controle Solar e Térmico de Alto Padrão',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-sao-conrado/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'São Conrado',
      },
      description:
        'Aplicação de películas Nano Cerâmica imunes à maresia para condomínios de alto luxo em São Conrado, com bloqueio térmico de até 95% e garantia de até 10 anos.',
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
      mainEntity: saoConradoConfig.faqs.map((faq) => ({
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

export default function SaoConradoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={saoConradoConfig} />
    </>
  );
}

