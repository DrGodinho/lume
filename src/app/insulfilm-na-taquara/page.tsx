import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm na Taquara RJ | Redução de Calor e Privacidade - LUME',
  description:
    'Instalação profissional de insulfilm na Taquara (Jacarepaguá). Películas solares a partir de R$ 80/m²: redução de até 8°C no calor, economia de energia e garantia de até 10 anos. Orçamento grátis no local e WhatsApp.',
  keywords: [
    'insulfilm na taquara',
    'insulfilm taquara rj',
    'insulfilm taquara jacarepagua',
    'aplicacao de insulfilm taquara',
    'pelicula solar taquara',
    'insulfilm residencial taquara',
    'insulfilm barato taquara',
    'lume controle solar taquara',
    'insulfilm estrada do tindiba',
    'insulfilm nelson cardoso'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-taquara/' },
  openGraph: {
    title: 'Insulfilm na Taquara RJ | LUME Controle Solar',
    description:
      'Soluções em películas térmicas e privacidade para casas, apartamentos e comércios na Taquara. Garantia de até 10 anos. Orçamento gratuito.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-taquara/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/taquara_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm na Taquara Jacarepaguá RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Taquara RJ | LUME Controle Solar',
    description:
      'Instalação profissional de insulfilm na Taquara. Redução de calor, privacidade e proteção UV com garantia de até 10 anos.',
    images: ['https://lumecontrolesolar.com.br/taquara_hero_bg.webp'],
  },
};

const taquaraConfig: NeighborhoodConfig = {
  name: 'Taquara (Jacarepaguá)',
  region: 'Zona Oeste do Rio de Janeiro',
  heroBadge: 'Atendimento Rápido e Medição Gratuita na Taquara',
  heroBg: '/taquara_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'na', 'Taquara', 'Jacarepaguá'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Alívio Térmico · Economia de Energia · Garantia de 10 Anos',
  description:
    'Aplicação profissional de películas de controle térmico e privacidade para residências, condomínios e lojas na Taquara. Reduza a sensação térmica em até 8°C e economize na conta de luz com garantia contra bolhas e desbotamento.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20da%20Taquara%20(Jacarepagu%C3%A1)%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '8', suffix: '°C', label: 'Redução na Sensação Térmica', sublabel: 'Conforto imediato sem forçar o ar' },
    { target: '99', suffix: '%', label: 'Bloqueio de Raios UV', sublabel: 'Proteção contra queimaduras solares e móveis' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Películas de poliéster virgem certificadas' },
    { target: '24', suffix: 'h', label: 'Instalação Ágil', sublabel: 'Aplicação sob medida no local com acabamento fino' },
  ],
  localPainsTitle: 'Desafios do Calor e Conforto na Taquara',
  localPainsSubtitle: 'Otimização Térmica para o Subúrbio Carioca',
  localPains: [
    {
      title: 'Calor Intenso & Alta Conta de Luz',
      problem:
        'A Taquara registra temperaturas elevadas quase o ano todo. Janelas sem proteção transformam salas e quartos em estufas, forçando aparelhos de ar-condicionado a trabalhar no limite.',
      solution:
        'Películas solares térmicas que bloqueiam até 95% do calor antes que ele entre no ambiente, gerando economia real de até 30% na tarifa de energia.',
    },
    {
      title: 'Ofuscamento e Reflexo em Telas',
      problem:
        'O excesso de claridade direta cansa a vista e impede o trabalho confortável em computadores ou a visualização nítida de televisores durante o dia.',
      solution:
        'Linhas Carbono Premium e Dupla Camada que equilibram a transmissão de luz visível, proporcionando luz agradável e sem reflexos irritantes.',
    },
    {
      title: 'Películas Baratas que Ficam Roxas e com Bolhas',
      problem:
        'Muitos moradores relatam terem instalado películas comuns que, após 6 meses de sol na Taquara, ficaram cheias de bolhas, com cheiro de cola queimada e tom roxo.',
      solution:
        'Na LUME trabalhamos apenas com películas originais com camada anti-risco e pigmentação em carbono/cerâmica pura, garantidas por escrito por até 10 anos.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Eficiência Energética & Térmica',
      tag: 'Alta Performance',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 2,
      durability: '10 Anos',
      idealFor: 'Apartamentos com alta insolação, salas amplas e varandas envidraçadas.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Controle de Calor & Privacidade',
      tag: 'Melhor Custo-Benefício',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Quartos, home office, janelas de condomínio e fachadas comerciais.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade Total sem Espelho Noturno',
      tag: 'Conforto Noturno',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Salas e quartos onde se busca privacidade sem perder a visão do exterior à noite.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Película Jateada Decorativa',
      category: 'Design & Privacidade Interna',
      tag: 'Elegância & Luz Difusa',
      heatRejection: 2,
      uvBlock: 4,
      privacy: 5,
      durability: '10 Anos',
      idealFor: 'Divisórias de cozinha, banheiros, consultórios e escritórios na Taquara.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
  ],
  coverageLocations: [
    'Avenida Nelson Cardoso',
    'Estrada do Tindiba',
    'Estrada do Rio Grande',
    'Estrada Rodrigues Caldas',
    'Rua Marechal José Bevilacqua',
    'Estrada do Boiúna',
    'Rua André Rocha',
    'Largo da Taquara',
    'Taquara Plaza Shopping',
    'Condomínio Rio da Prata',
    'Condomínio Moradas da Taquara',
    'Colônia Juliano Moreira',
    'Rua Iperó',
    'Rua Apiacás',
  ],
  faqs: [
    {
      q: 'Quanto custa para colocar insulfilm em um apartamento padrão na Taquara?',
      a: 'O custo varia conforme a metragem e a película escolhida: a linha Carbono Premium inicia a partir de R$ 80/m² instalado, a Dupla Camada a partir de R$ 110/m² e a Nano Cerâmica de alta rejeição térmica a partir de R$ 200/m². Fazemos a medição gratuita no seu endereço na Taquara para passar o orçamento exato.',
    },
    {
      q: 'A instalação faz muita poeira ou bagunça na casa?',
      a: 'Não. Nossa aplicação é 100% limpa, realizada com água desmineralizada e soluções neutras de fixação. Protegemos os rodapés, pisos e móveis com panos absorventes durante todo o processo de limpeza e aplicação.',
    },
    {
      q: 'O insulfilm realmente ajuda a economizar na conta de luz?',
      a: 'Sim. Ao bloquear até 95% do calor do sol diretamente no vidro, a temperatura do ambiente permanece estável, permitindo que o ar-condicionado atinja a temperatura programada muito mais rápido e opere em potência moderada, gerando economia mensal consistente.',
    },
    {
      q: 'Vocês atendem clínicas e escritórios comerciais na Taquara?',
      a: 'Sim! Atendemos residências em condomínios fechados, prédios e comércios no polo comercial da Taquara, inclusive com opções de películas jateadas decorativas para consultórios e salas de reunião.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Taquara (Jacarepaguá)', url: 'https://lumecontrolesolar.com.br/insulfilm-na-taquara/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-taquara/#localbusiness',
      name: 'LUME Controle Solar - Taquara Jacarepaguá',
      image: 'https://lumecontrolesolar.com.br/taquara_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-na-taquara/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9238,
        longitude: -43.3712,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Taquara' },
        { '@type': 'Neighborhood', name: 'Jacarepaguá' },
        { '@type': 'Neighborhood', name: 'Rio Grande' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 26,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm na Taquara Jacarepaguá RJ',
      serviceType: 'Aplicação de Películas de Controle Solar e Conforto Térmico',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-taquara/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Taquara (Jacarepaguá)',
      },
      description:
        'Instalação de insulfilm residencial e comercial na Taquara. Redução de calor, privacidade e economia de energia com garantia de até 10 anos.',
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
      mainEntity: taquaraConfig.faqs.map((faq) => ({
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

export default function TaquaraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={taquaraConfig} />
    </>
  );
}

