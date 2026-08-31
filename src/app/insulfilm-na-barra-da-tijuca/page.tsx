import type { Metadata } from 'next';
import { BarraPage } from '../../views/BarraPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Insulfilm na Barra da Tijuca RJ | Preço, Instalação e Garantia - LUME',
  description: 'Aplicação profissional de insulfilm na Barra da Tijuca, Rio de Janeiro. Películas a partir de R$ 90/m²: redução de calor, privacidade e proteção UV com garantia de 2 anos. Orçamento grátis no local e pelo WhatsApp.',
  keywords: [
    'insulfilm barra da tijuca',
    'insulfilm barra rj',
    'preço de insulfilm barra da tijuca',
    'insulfilm barra da tijuca preço',
    'aplicação de insulfilm barra da tijuca',
    'instalação de insulfilm barra da tijuca',
    'insulfilm residencial barra da tijuca',
    'nano cerâmica barra da tijuca',
    'insulfilm condomínio barra',
    'lume controle solar barra',
    'insulfilm barato barra'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/' },
  openGraph: {
    title: 'Insulfilm na Barra da Tijuca RJ | LUME Controle Solar',
    description: 'Películas de alta performance na Barra da Tijuca. Nano cerâmica, carbono e espelhadas. Instalação profissional com garantia de 2 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/barra_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm na Barra da Tijuca RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Barra da Tijuca RJ | LUME Controle Solar',
    description: 'Películas premium na Barra da Tijuca. Nano cerâmica, carbono e espelhadas. Orçamento gratuito.',
    images: ['https://lumecontrolesolar.com.br/barra_hero_bg.webp'],
  },
};

const barraFaqs = [
  {
    q: 'Quanto custa instalar insulfilm residencial na Barra da Tijuca?',
    a: 'O valor varia conforme o tipo de película e a quantidade de m² de vidro: películas a partir de R$ 80/m² (carbono) até R$ 200/m² (nano cerâmica). Quanto mais vidros no mesmo endereço, melhor o custo médio por peça. Oferecemos orçamento gratuito e sem compromisso pelo WhatsApp — basta enviar as medidas ou agendar visita de medição.',
  },
  {
    q: 'Qual o melhor tipo de insulfilm para apartamentos na Barra da Tijuca?',
    a: 'Para o clima quente da Zona Oeste e frente mar, recomendamos as películas nano cerâmica (metal-free) para máxima rejeição de calor sem alterar a vista. Se privacidade for a prioridade, o G5 fumê é o mais indicado. Para quem não quer alterar a aparência do vidro, a linha transparente é a melhor opção.',
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
    q: 'Atendem condomínios e empresas na Barra da Tijuca?',
    a: 'Sim. Atendemos residências em condomínios de luxo, lojas, clínicas e escritórios em toda a região, incluindo Recreio, Jacarepaguá e a Zona Oeste.',
  },
  {
    q: 'Insulfilm é proibido ou ilegal na Barra da Tijuca?',
    a: 'Não. O insulfilm residencial é permitido. Em alguns prédios pode haver regra de condomínio sobre a fachada, mas películas que mantêm a visão de fora para dentro (refletiva, carbono) costumam estar liberadas. Consulte a convenção do seu condomínio antes de instalar.',
  },
  {
    q: 'Dá para instalar insulfilm à noite ou em qualquer horário?',
    a: 'Sim. A aplicação é feita por dentro do vidro com iluminação controlada, então pode ser agendada à noite ou nos finais de semana. O importante é o vidro estar limpo e seco; a LUME confirma o melhor horário ao fechar o orçamento.',
  },
  {
    q: 'Quanto tempo leva para instalar insulfilm na Barra da Tijuca?',
    a: 'A instalação de uma janela leva poucos minutos; um projeto de casa ou apartamento inteiro costuma ser concluído no mesmo dia. Quanto mais vidros no mesmo endereço, melhor o aproveitamento de tempo e o custo médio por peça.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/#localbusiness',
      'name': 'LUME Controle Solar - Barra da Tijuca',
      'image': 'https://lumecontrolesolar.com.br/barra_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/',
      'telephone': businessInfo.phoneE164,
      'priceRange': '$$',
      'address': businessAddressSchema,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': -22.9167,
        'longitude': -43.3667
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Barra da Tijuca'
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
      'name': 'Instalação de Insulfilm na Barra da Tijuca',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Barra da Tijuca'
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': barraFaqs.map((item) => ({
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
      <BarraPage faqs={barraFaqs} />
    </>
  );
}
