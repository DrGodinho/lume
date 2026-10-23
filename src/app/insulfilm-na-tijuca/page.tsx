import type { Metadata } from 'next';
import { TijucaPage } from '../../views/TijucaPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm na Tijuca RJ | Redução de Calor e Privacidade - LUME',
  description:
    'Instalação de insulfilm na Tijuca, Saens Peña e Maracanã. Películas Nano Cerâmica e Carbono com até 8°C de redução térmica, corte de 99.9% dos raios UV e garantia de até 10 anos. Orçamento grátis pelo WhatsApp.',
  keywords: [
    'insulfilm na tijuca',
    'insulfilm tijuca rj',
    'insulfilm saens peña',
    'insulfilm conde de bonfim',
    'insulfilm maracanã',
    'película solar tijuca',
    'redução de calor tijuca',
    'insulfilm residencial tijuca',
    'lume controle solar tijuca',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-tijuca/' },
  openGraph: {
    title: 'Insulfilm na Tijuca RJ | LUME Controle Solar',
    description:
      'Soluções profissionais de controle térmico e privacidade na Tijuca. Até 8°C a menos no ambiente e até 10 anos de garantia.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-tijuca/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/tijuca_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm na Tijuca RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Tijuca RJ | LUME Controle Solar',
    description:
      'Conforto térmico e privacidade para apartamentos e casas na Grande Tijuca. Orçamento expresso pelo WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/tijuca_hero_bg.webp'],
  },
};

const tijucaFaqs = [
  {
    q: 'Quanto custa instalar insulfilm em um apartamento na Tijuca?',
    a: 'Nossos preços partem de R$ 90/m² instalado na linha Carbono Elite (a mais procurada para quartos e salas com muito sol); R$ 150/m² na linha Dupla Camada (sem reflexo interno à noite); e R$ 220/m² na linha Nano Cerâmica de alta performance térmica. A medição no local é 100% gratuita em qualquer rua da Tijuca.',
  },
  {
    q: 'O insulfilm realmente reduz a temperatura nos quartos e salas da Tijuca?',
    a: 'Sim. Em apartamentos tijucanos que recebem o sol da tarde, a redução térmica média fica entre 5°C e 8°C na sensação ambiente. As películas bloqueiam a entrada da radiação infravermelha, impedindo que o calor fique acumulado nas paredes e móveis.',
  },
  {
    q: 'Qual película é recomendada para quem trabalha em home office e sofre com sol na tela?',
    a: 'A linha Carbono Elite G20 ou G35 é excelente para escritórios e salas de TV. Ela suaviza o excesso de claridade que causa cansaço visual e reflexos nas telas de computador, sem escurecer excessivamente o espaço.',
  },
  {
    q: 'Atendem prédios antigos e com janelas de ferro ou madeira na Tijuca?',
    a: 'Sim! Temos ampla experiência na arquitetura tradicional tijucana (janelões de guilhotina, esquadrias de ferro, madeira ou alumínio). Nossos instaladores realizam o corte milimétrico no formato exato de cada folha de vidro.',
  },
  {
    q: 'Qual o tempo de instalação para um apartamento completo?',
    a: 'Geralmente concluímos a aplicação de um apartamento inteiro (sala, varanda e quartos) em um único período (cerca de 2 a 4 horas), sem necessidade de quebra-quebra ou poeira.',
  },
  {
    q: 'Qual a garantia oferecida pela LUME?',
    a: 'Todas as nossas películas acompanham garantia de até 10 anos contra defeitos de fábrica, descolamento, bolhas e alteração de tonalidade (as películas não desbotam e não ficam roxas).',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Tijuca', url: 'https://lumecontrolesolar.com.br/insulfilm-na-tijuca/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-tijuca/#localbusiness',
      name: 'LUME Controle Solar - Tijuca & Grande Tijuca',
      image: 'https://lumecontrolesolar.com.br/tijuca_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-na-tijuca/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9248,
        longitude: -43.2329,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Tijuca' },
        { '@type': 'Neighborhood', name: 'Maracanã' },
        { '@type': 'Neighborhood', name: 'Vila Isabel' },
        { '@type': 'Neighborhood', name: 'Grajaú' },
        { '@type': 'AdministrativeArea', name: 'Grande Tijuca' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 20,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm e Películas Solares na Tijuca RJ',
      serviceType: 'Instalação de Películas de Controle Solar e Conforto Térmico',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-tijuca/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Tijuca',
      },
      description:
        'Instalação profissional de insulfilm residencial para alívio térmico, redução de claridade e privacidade na Tijuca e Zona Norte do Rio.',
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
      mainEntity: tijucaFaqs.map((faq) => ({
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
      <TijucaPage faqs={tijucaFaqs} />
    </>
  );
}
