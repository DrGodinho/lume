import type { Metadata } from 'next';
import { RealengoPage } from '../../views/RealengoPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Insulfilm em Realengo RJ | Preço, Instalação e Garantia - LUME',
  description: 'Aplicação profissional de insulfilm em Realengo, Rio de Janeiro. Películas a partir de R$ 90/m²: redução de calor, privacidade e proteção UV com garantia de 2 anos. Orçamento grátis no local e pelo WhatsApp.',
  keywords: [
    'insulfilm em realengo',
    'insulfilm realengo rj',
    'preço de insulfilm realengo',
    'insulfilm realengo preço',
    'aplicação de insulfilm realengo',
    'instalação de insulfilm realengo',
    'insulfilm residencial realengo',
    'lume controle solar realengo',
    'insulfilm barato realengo'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/' },
  openGraph: {
    title: 'Insulfilm em Realengo RJ | LUME Controle Solar',
    description: 'As melhores películas de controle solar em Realengo. Instalação profissional, garantia de 2 anos e orçamento grátis no local.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/realengo_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Realengo RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Realengo RJ | LUME Controle Solar',
    description: 'Películas de controle solar em Realengo. Instalação profissional e garantia de 2 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/realengo_hero_bg.webp'],
  },
};

const realengoFaqs = [
  {
    q: 'Quanto custa instalar insulfilm residencial em Realengo?',
    a: 'O valor varia conforme o tipo de película e a quantidade de m² de vidro: películas a partir de R$ 80/m² (carbono) até R$ 200/m² (nano cerâmica). Quanto mais vidros no mesmo endereço, melhor o custo médio por peça. Oferecemos orçamento gratuito e sem compromisso pelo WhatsApp — basta enviar as medidas ou agendar visita de medição.',
  },
  {
    q: 'Qual o melhor tipo de insulfilm para casas em Realengo?',
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
    q: 'Atendem condomínios e empresas em Realengo?',
    a: 'Sim. Atendemos residências em condomínios, lojas de rua, centros comerciais, clínicas, escritórios e qualquer ambiente comercial arquitetônico na região, incluindo Vila Militar e Sulacap.',
  },
  {
    q: 'Insulfilm é proibido ou ilegal em Realengo?',
    a: 'Não. O insulfilm residencial é permitido. Em alguns prédios pode haver regra de condomínio sobre a fachada, mas películas que mantêm a visão de fora para dentro (refletiva, carbono) costumam estar liberadas. Consulte a convenção do seu condomínio antes de instalar.',
  },
  {
    q: 'Dá para instalar insulfilm à noite ou em qualquer horário?',
    a: 'Sim. A aplicação é feita por dentro do vidro com iluminação controlada, então pode ser agendada à noite ou nos finais de semana. O importante é o vidro estar limpo e seco; a LUME confirma o melhor horário ao fechar o orçamento.',
  },
  {
    q: 'Quanto tempo leva para instalar insulfilm em Realengo?',
    a: 'A instalação de uma janela leva poucos minutos; um projeto de casa ou apartamento inteiro costuma ser concluído no mesmo dia. Quanto mais vidros no mesmo endereço, melhor o aproveitamento de tempo e o custo médio por peça.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/#localbusiness',
      'name': 'LUME Controle Solar - Realengo',
      'image': 'https://lumecontrolesolar.com.br/realengo_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/',
      'telephone': businessInfo.phoneE164,
      'priceRange': '$$',
      'address': businessAddressSchema,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': -22.8978,
        'longitude': -43.4320
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Realengo'
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
      'name': 'Instalação de Insulfilm em Realengo',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-realengo/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Realengo'
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': realengoFaqs.map((item) => ({
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
      <RealengoPage faqs={realengoFaqs} />
    </>
  );
}
