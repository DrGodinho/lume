import type { Metadata } from 'next';
import { RecreioPage } from '../../views/RecreioPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Insulfilm no Recreio RJ | Preço, Instalação e Garantia - LUME',
  description: 'Aplicação profissional de insulfilm no Recreio dos Bandeirantes, Rio de Janeiro. Películas a partir de R$ 90/m²: redução de calor, privacidade e proteção UV com garantia de 2 anos. Orçamento grátis no local e pelo WhatsApp.',
  keywords: [
    'insulfilm recreio',
    'insulfilm recreio rj',
    'preço de insulfilm recreio',
    'insulfilm recreio preço',
    'insulfilm recreio dos bandeirantes',
    'aplicação de insulfilm recreio',
    'instalação de insulfilm recreio',
    'insulfilm residencial recreio',
    'insulfilm condomínio recreio',
    'lume controle solar recreio',
    'insulfilm barato recreio'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/' },
  openGraph: {
    title: 'Insulfilm no Recreio dos Bandeirantes RJ | LUME Controle Solar',
    description: 'Películas premium no Recreio. Máxima rejeição de calor e proteção UV 99% para sua casa ou apartamento. Agende uma visita técnica gratuita.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/recreio_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm no Recreio dos Bandeirantes RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Recreio RJ | LUME Controle Solar',
    description: 'Máxima rejeição de calor e proteção UV no Recreio. Visita técnica gratuita.',
    images: ['https://lumecontrolesolar.com.br/recreio_hero_bg.webp'],
  },
};

const recreioFaqs = [
  {
    q: 'Quanto custa instalar insulfilm residencial no Recreio?',
    a: 'O valor varia conforme o tipo de película e a quantidade de m² de vidro: películas a partir de R$ 90/m² (carbono) até R$ 240/m² (nano cerâmica). Quanto mais vidros no mesmo endereço, melhor o custo médio por peça. Oferecemos orçamento gratuito e sem compromisso pelo WhatsApp — basta enviar as medidas ou agendar visita de medição.',
  },
  {
    q: 'Qual o melhor tipo de insulfilm para apartamentos no Recreio?',
    a: 'Para as Glebas A e B, onde a incidência solar é alta, as películas de Nano Cerâmica são as campeãs por barrarem o calor mantendo a transparência. Se a busca for por privacidade, a linha Carbono Premium G5 ou G20 é a mais indicada.',
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
    q: 'Atendem condomínios e empresas no Recreio?',
    a: 'Sim. Atendemos residências em condomínios, lojas de rua, clínicas e escritórios no Recreio e região, incluindo Barra da Tijuca, Jacarepaguá e a Zona Oeste.',
  },
  {
    q: 'Insulfilm é proibido ou ilegal no Recreio?',
    a: 'Não. O insulfilm residencial é permitido. Em alguns prédios pode haver regra de condomínio sobre a fachada, mas películas que mantêm a visão de fora para dentro (refletiva, carbono) costumam estar liberadas. Consulte a convenção do seu condomínio antes de instalar.',
  },
  {
    q: 'Dá para instalar insulfilm à noite ou em qualquer horário?',
    a: 'Sim. A aplicação é feita por dentro do vidro com iluminação controlada, então pode ser agendada à noite ou nos finais de semana. O importante é o vidro estar limpo e seco; a LUME confirma o melhor horário ao fechar o orçamento.',
  },
  {
    q: 'Quanto tempo leva para instalar insulfilm no Recreio?',
    a: 'A instalação de uma janela leva poucos minutos; um projeto de casa ou apartamento inteiro costuma ser concluído no mesmo dia. Quanto mais vidros no mesmo endereço, melhor o aproveitamento de tempo e o custo médio por peça.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/#localbusiness',
      'name': 'LUME Controle Solar - Recreio',
      'image': 'https://lumecontrolesolar.com.br/recreio_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/',
      'telephone': businessInfo.phoneE164,
      'priceRange': '$$',
      'address': businessAddressSchema,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': -22.9707,
        'longitude': -43.3666
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Recreio dos Bandeirantes'
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
      'name': 'Instalação de Insulfilm no Recreio',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-recreio/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Recreio dos Bandeirantes'
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': recreioFaqs.map((item) => ({
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
      <RecreioPage faqs={recreioFaqs} />
    </>
  );
}
