import type { Metadata } from 'next';
import { CopacabanaPage } from '../../views/CopacabanaPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm em Copacabana RJ | Películas Térmicas e Solares - LUME',
  description:
    'Instalação profissional de insulfilm em Copacabana e Leme. Películas Nano Cerâmica resistentes à maresia com até 95% de corte térmico, proteção UV para móveis e garantia de até 10 anos. Orçamento grátis no WhatsApp.',
  keywords: [
    'insulfilm em copacabana',
    'insulfilm copacabana rj',
    'insulfilm leme rj',
    'película solar copacabana',
    'insulfilm nano cerâmica copacabana',
    'insulfilm avenida atlântica',
    'redução de calor copacabana',
    'insulfilm residencial copacabana',
    'insulfilm para varanda copacabana',
    'lume controle solar copacabana',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-copacabana/' },
  openGraph: {
    title: 'Insulfilm em Copacabana RJ | LUME Controle Solar',
    description:
      'Películas de alta tecnologia para apartamentos em Copacabana e Leme. Bloqueio térmico de até 95%, proteção contra maresia e garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-copacabana/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/copacabana_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm em Copacabana RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Copacabana RJ | LUME Controle Solar',
    description:
      'Controle solar, proteção contra maresia e privacidade para apartamentos em Copacabana. Orçamento expresso pelo WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/copacabana_hero_bg.webp'],
  },
};

const copacabanaFaqs = [
  {
    q: 'Quanto custa instalar insulfilm em um apartamento em Copacabana?',
    a: 'O valor depende da película e metragem: a linha Carbono Elite inicia a partir de R$ 90/m² instalado; a linha Dupla Camada (sem espelho interno à noite) a partir de R$ 150/m²; e a Nano Cerâmica de alta performance térmica inicia em R$ 220/m². Oferecemos visita para medição sem compromisso em qualquer endereço de Copacabana e Leme.',
  },
  {
    q: 'A maresia de Copacabana danifica a película com o tempo?',
    a: 'Películas metalizadas convencionais de baixa qualidade costumam oxidar e descascar com a maresia. Na LUME, trabalhamos com películas 100% Cerâmica Pura (Nano Cerâmica), que são isentas de metais e totalmente imunes à corrosão salina, mantendo a tonalidade e a rejeição térmica perfeitas por até 10 anos.',
  },
  {
    q: 'A película Nano Cerâmica reduz a vista do mar ou a claridade da sala?',
    a: 'Não. A tecnologia de nano cerâmica atua filtrando os raios infravermelhos (responsáveis pelo calor) e os raios ultravioleta (que queimam móveis), mantendo excelente transmissão de luz visível (70% a 75%). Você mantém a vista panorâmica do mar e da praia com muito mais frescor.',
  },
  {
    q: 'Os condomínios da Avenida Atlântica e de Copacabana costumam autorizar insulfilm?',
    a: 'Sim! As convenções de condomínio na Zona Sul geralmente proíbem apenas películas espelhadas ou prateadas que alterem a harmonia da fachada. A linha Nano Cerâmica neutra ou transparente é 100% compatível e recomendada, pois não cria efeito refletivo externo.',
  },
  {
    q: 'O insulfilm protege piso de madeira nobre, tapetes e cortinas?',
    a: 'Sim, bloqueamos 99.9% dos raios ultravioleta (UV-A e UV-B), que são os principais causadores de ressecamento, perda de cor e degradação de madeiras nobres, couros, tecidos e obras de arte.',
  },
  {
    q: 'Qual o tempo de instalação para um apartamento em Copacabana?',
    a: 'Geralmente instalamos janelas individuais ou portas de varanda em 1 a 2 horas. Um apartamento completo com varanda e quartos costuma ser concluído no mesmo dia, sem sujeira, sem poeira e com proteção de móveis durante o processo.',
  },
  {
    q: 'Qual a garantia oferecida pela LUME?',
    a: 'Trabalhamos com garantia contratual formal de até 10 anos contra delaminação, formação de bolhas e alteração de tonalidade (garantia de que a película não fica roxa).',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Copacabana', url: 'https://lumecontrolesolar.com.br/insulfilm-em-copacabana/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-copacabana/#localbusiness',
      name: 'LUME Controle Solar - Copacabana & Leme',
      image: 'https://lumecontrolesolar.com.br/copacabana_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-em-copacabana/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9698,
        longitude: -43.1868,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Copacabana' },
        { '@type': 'Neighborhood', name: 'Leme' },
        { '@type': 'Neighborhood', name: 'Arpoador' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 22,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm em Copacabana e Leme RJ',
      serviceType: 'Instalação de Películas de Controle Solar e Proteção Térmica',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-copacabana/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Copacabana',
      },
      description:
        'Aplicação profissional de películas para redução de calor, proteção contra maresia e controle solar com garantia de até 10 anos em Copacabana.',
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
      mainEntity: copacabanaFaqs.map((faq) => ({
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
      <CopacabanaPage faqs={copacabanaFaqs} />
    </>
  );
}
