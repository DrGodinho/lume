import type { Metadata } from 'next';
import { BanguPage } from '../../views/BanguPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Insulfilm em Bangu RJ | Preço, Instalação e Garantia - LUME',
  description: 'Aplicação profissional de insulfilm em Bangu, Rio de Janeiro. Películas a partir de R$ 90/m²: redução de calor, privacidade e proteção UV com garantia de 2 anos. Orçamento grátis no local e pelo WhatsApp.',
  keywords: [
    'insulfilm em bangu',
    'insulfilm bangu rj',
    'preço de insulfilm bangu',
    'insulfilm bangu preço',
    'aplicação de insulfilm bangu',
    'instalação de insulfilm bangu',
    'insulfilm residencial bangu',
    'insulfilm automotivo bangu',
    'lume controle solar bangu'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/' },
  openGraph: {
    title: 'Insulfilm em Bangu RJ | Residencial e Comercial - LUME',
    description: 'Insulfilm em Bangu a partir de R$ 90/m². Redução de calor, privacidade e proteção UV com garantia de 2 anos. Orçamento grátis.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/bangu_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Bangu RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Bangu RJ | LUME Controle Solar',
    description: 'Redução de calor, privacidade e proteção UV em Bangu. Garantia de 2 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/bangu_hero_bg.webp'],
  },
};

const banguFaqs = [
  {
    q: 'Quanto custa instalar insulfilm residencial em Bangu?',
    a: 'O valor varia conforme o tipo de película e a quantidade de m² de vidro: películas a partir de R$ 80/m² (carbono) até R$ 200/m² (nano cerâmica). Quanto mais vidros no mesmo endereço, melhor o custo médio por peça. Oferecemos orçamento gratuito e sem compromisso pelo WhatsApp — basta enviar as medidas ou agendar visita de medição.',
  },
  {
    q: 'Qual o melhor tipo de insulfilm para casas em Bangu?',
    a: 'Para o clima quente da Zona Oeste, recomendamos as películas nano cerâmica ou nano carbono para máxima rejeição de calor. Se privacidade for a prioridade, o G5 fumê é o mais indicado. Para quem não quer alterar a aparência do vidro, a linha transparente é a melhor opção.',
  },
  {
    q: 'O insulfilm residencial danifica o vidro?',
    a: 'Não. A aplicação é feita com produtos específicos para limpeza e adesão, sem riscos ao vidro. A instalação profissional garante que não fiquem arranhados ou manchas residuais.',
  },
  {
    q: 'Quanto tempo dura o insulfilm residencial?',
    a: 'Trabalhamos exclusivamente com películas originais que mantêm suas propriedades térmicas e estabilidade de cor por muito mais tempo que as versões comuns. Elas são resistentes a riscos e não criam as bolhas típicas de materiais inferiores.',
  },
  {
    q: 'Qual o tempo de garantia do serviço?',
    a: 'Oferecemos garantia contratual de 2 anos em todos os nossos serviços de aplicação. Isso cobre bolhas, delaminação e defeitos de instalação, garantindo sua total tranquilidade.',
  },
  {
    q: 'Posso instalar insulfilm em vidro temperado?',
    a: 'Sim, desde que seja usada a película correta. Vidros temperados requerem películas com taxa de absorção de calor adequada para evitar estresse térmico. Avaliamos o tipo de vidro antes da recomendação.',
  },
  {
    q: 'O insulfilm escurece muito o ambiente?',
    a: 'Depende da sua escolha. Películas como o Carbono G5 reduzem bastante a luminosidade (ideal para quartos). Já a Nano Cerâmica rejeita o calor mantendo a transparência quase total do vidro.',
  },
  {
    q: 'Atendem condomínios e empresas em Bangu?',
    a: 'Sim. Atendemos residências em condomínios, lojas de rua, centros comerciais, clínicas, escritórios e qualquer ambiente comercial arquitetônico na região.',
  },
  {
    q: 'Insulfilm é proibido ou ilegal em Bangu?',
    a: 'Não. O insulfilm residencial é permitido. Em alguns prédios pode haver regra de condomínio sobre a fachada, mas películas que mantêm a visão de fora para dentro (refletiva, carbono) costumam estar liberadas. Consulte a convenção do seu condomínio antes de instalar.',
  },
  {
    q: 'Dá para instalar insulfilm à noite ou em qualquer horário?',
    a: 'Sim. A aplicação é feita por dentro do vidro com iluminação controlada, então pode ser agendada à noite ou nos finais de semana. O importante é o vidro estar limpo e seco; a LUME confirma o melhor horário ao fechar o orçamento.',
  },
  {
    q: 'Quanto tempo leva para instalar insulfilm em Bangu?',
    a: 'A instalação de uma janela leva poucos minutos; um projeto de casa ou apartamento inteiro costuma ser concluído no mesmo dia. Quanto mais vidros no mesmo endereço, melhor o aproveitamento de tempo e o custo médio por peça.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/#localbusiness',
      'name': 'LUME Controle Solar - Bangu',
      'image': 'https://lumecontrolesolar.com.br/bangu_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/',
      'telephone': businessInfo.phoneE164,
      'priceRange': '$$',
      'address': businessAddressSchema,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': -22.8753,
        'longitude': -43.4659
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Bangu'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': 5,
        'reviewCount': 3,
        'bestRating': 5,
      },
    },
    {
      '@type': 'Service',
      'name': 'Instalação de Insulfilm em Bangu',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-bangu/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Bangu'
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': banguFaqs.map((item) => ({
        '@type': 'Question',
        'name': item.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.a,
        },
      })),
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BanguPage faqs={banguFaqs} />
    </>
  );
}
