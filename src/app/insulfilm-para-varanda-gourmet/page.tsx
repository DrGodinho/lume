import type { Metadata } from 'next';
import { VarandaGourmetPage } from '../../views/VarandaGourmetPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm para Varanda Gourmet e Sacadas RJ | Redução de Calor - LUME',
  description:
    'Instalação de insulfilm para varanda gourmet e cortina de vidro no Rio de Janeiro. Película Nano Cerâmica com até 95% de corte térmico, proteção UV para móveis e 100% aprovada por condomínios. Orçamento grátis.',
  keywords: [
    'insulfilm para varanda gourmet',
    'insulfilm cortina de vidro rj',
    'película para sacada de apartamento',
    'redução de calor varanda gourmet',
    'insulfilm reiki rj',
    'insulfilm nano cerâmica varanda',
    'película solar para cortina de vidro',
    'insulfilm sem alterar fachada',
    'película térmica sacada envidraçada',
    'lume controle solar varanda',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-para-varanda-gourmet/' },
  openGraph: {
    title: 'Insulfilm para Varanda Gourmet e Sacadas RJ | LUME Controle Solar',
    description:
      'Solução definitiva contra o calor na cortina de vidro da sua varanda gourmet. Até 95% de rejeição solar, visão nítida e preservação de móveis.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-para-varanda-gourmet/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/varanda_gourmet_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm para Varanda Gourmet e Cortina de Vidro RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Varanda Gourmet e Sacadas RJ | LUME Controle Solar',
    description:
      'Reduza o calor da sua varanda gourmet em até 95% sem perder a vista e dentro das normas do condomínio. Orçamento rápido pelo WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/varanda_gourmet_hero_bg.webp'],
  },
};

const varandaGourmetFaqs = [
  {
    q: 'O condomínio pode multar ou proibir a instalação de insulfilm na cortina de vidro?',
    a: 'As convenções de condomínio proíbem películas espelhadas, prateadas ou que alterem a cor padrão da fachada do edifício. Para resolver isso, utilizamos a linha Nano Cerâmica Neutra/Cristalina (70% ou 75% de transparência), que é totalmente imperceptível pelo lado externo do prédio, garantindo conformidade jurídica absoluta e risco zero de notificação.',
  },
  {
    q: 'Quanto custa instalar insulfilm em uma varanda gourmet envidraçada no Rio de Janeiro?',
    a: 'O investimento médio varia conforme a metragem e a tecnologia escolhida: a linha Carbono Premium inicia a partir de R$ 80/m²; a linha Refletiva (máxima privacidade diurna e rejeição solar) a partir de R$ 90/m²; e a Nano Cerâmica de alta performance térmica inicia em R$ 200/m². Realizamos visita técnica no local com medição exata e orçamento sem compromisso.',
  },
  {
    q: 'A película atrapalha o fechamento ou o deslizamento das lâminas de vidro da sacada?',
    a: 'Não. Nossa equipe é treinada especificamente em sistemas articulados e retráteis (Reiki, cortinas de vidro de diversas marcas). O corte da película é feito respeitando as folgas milimétricas de roldanas, escovas de vedação e travas, permitindo que os vidros girem e corram suavemente.',
  },
  {
    q: 'A película Nano Cerâmica realmente tira o calor da varanda com sol poente?',
    a: 'Sim! O calor sufocante sentido na varanda é transmitido principalmente pelos raios infravermelhos solares. A Nano Cerâmica possui nanopartículas que filtram até 95% dessa radiação térmica, proporcionando uma queda de até 6°C a 8°C na sensação térmica do ambiente e aliviando imediatamente o uso do ar-condicionado.',
  },
  {
    q: 'O insulfilm protege a mesa de madeira, sofás e as plantas da varanda?',
    a: 'Sim, a película filtra 99.9% dos raios ultravioleta (UV-A e UV-B), que são a causa física de desbotamento de tecidos, ressecamento de madeiras nobres, rachaduras em fibras sintéticas e queimaduras em folhagens de plantas.',
  },
  {
    q: 'Qual é o prazo de garantia para aplicação em cortina de vidro?',
    a: 'Oferecemos garantia formal de até 10 anos para a linha Nano Cerâmica contra formação de bolhas, delaminação e perda de cor, com termo de garantia entregue diretamente ao cliente.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Varanda Gourmet', url: 'https://lumecontrolesolar.com.br/insulfilm-para-varanda-gourmet/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-para-varanda-gourmet/#localbusiness',
      name: 'LUME Controle Solar - Insulfilm para Varanda Gourmet',
      image: 'https://lumecontrolesolar.com.br/varanda_gourmet_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-para-varanda-gourmet/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9068,
        longitude: -43.1729,
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Rio de Janeiro' },
        { '@type': 'Neighborhood', name: 'Barra da Tijuca' },
        { '@type': 'Neighborhood', name: 'Recreio dos Bandeirantes' },
        { '@type': 'Neighborhood', name: 'Copacabana' },
        { '@type': 'Neighborhood', name: 'Ipanema' },
        { '@type': 'Neighborhood', name: 'Leblon' },
        { '@type': 'Neighborhood', name: 'Tijuca' },
        { '@type': 'Neighborhood', name: 'Porto Maravilha' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 38,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm para Varanda Gourmet e Sacadas Envidraçadas',
      serviceType: 'Aplicação de Películas de Controle Solar e Térmico para Cortinas de Vidro',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-para-varanda-gourmet/#localbusiness',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Rio de Janeiro - RJ',
      },
      description:
        'Aplicação especializada de películas Nano Cerâmica e proteção solar de alta performance para varandas com cortina de vidro e sacadas articuladas.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '80.00',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: varandaGourmetFaqs.map((faq) => ({
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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VarandaGourmetPage faqs={varandaGourmetFaqs} />
    </>
  );
}

