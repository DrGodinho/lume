import type { Metadata } from 'next';
import { SantoCristoPage } from '../../views/SantoCristoPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm em Santo Cristo RJ | Porto Maravilha - LUME',
  description:
    'Instalação profissional de insulfilm em Santo Cristo e Porto Maravilha. Películas Nano Cerâmica e Carbono com até 95% de corte térmico, privacidade para novos condomínios residenciais e garantia de até 10 anos. Orçamento grátis no WhatsApp.',
  keywords: [
    'insulfilm em santo cristo',
    'insulfilm santo cristo rj',
    'insulfilm porto maravilha',
    'insulfilm porto maravilha rj',
    'insulfilm cury porto maravilha',
    'insulfilm residencial santo cristo',
    'insulfilm para varanda porto maravilha',
    'película solar santo cristo',
    'redução de calor santo cristo',
    'insulfilm nano cerâmica santo cristo',
    'lume controle solar santo cristo',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-santo-cristo/' },
  openGraph: {
    title: 'Insulfilm em Santo Cristo RJ | Porto Maravilha - LUME Controle Solar',
    description:
      'Soluções de alta performance térmica e privacidade para novos apartamentos em Santo Cristo e Porto Maravilha. Redução de calor de até 95% e garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-santo-cristo/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/hero-bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm em Santo Cristo e Porto Maravilha - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Santo Cristo RJ | LUME Controle Solar',
    description:
      'Redução de calor, privacidade e proteção UV em Santo Cristo e Porto Maravilha. Garantia de até 10 anos. Orçamento expresso via WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/hero-bg.webp'],
  },
};

const santoCristoFaqs = [
  {
    q: 'Quanto custa instalar insulfilm em um apartamento em Santo Cristo?',
    a: 'O valor varia conforme a película e a metragem: por exemplo, em um fechamento recente de varanda com 11 vidros (5,78 m²) em Santo Cristo, o valor total instalado na linha Refletiva ficou em apenas R$ 636,22; na Nano Cerâmica G20 (a preferida dos condomínios) ficou em R$ 1.041,08; e na Nano Cerâmica 75% Transparente (para regras estritas de fachada) ficou em R$ 1.388,11. O orçamento e a medição no seu apartamento são 100% gratuitos pelo WhatsApp.',
  },
  {
    q: 'As regras de condomínio dos novos prédios do Porto Maravilha permitem insulfilm?',
    a: 'Sim! A maioria dos condomínios residenciais permite películas desde que não alterem drasticamente o padrão arquitetônico externo. Para isso, a linha Nano Cerâmica é a mais indicada, pois bloqueia até 95% do calor do sol mantendo a transparência cristalina do vidro. Caso sua prioridade seja privacidade sem reflexo de espelho, o Carbono neutro também é amplamente aceito.',
  },
  {
    q: 'O insulfilm tira a vista da Baía de Guanabara ou do Porto Maravilha?',
    a: 'Não. Películas modernas de controle solar de alta tecnologia, como a Nano Cerâmica 70% ou 75%, são quase imperceptíveis ao olho humano. Você continua desfrutando da luz natural e da vista panorâmica da cidade, enquanto o calor radiante do sol é filtrado antes de entrar no apartamento.',
  },
  {
    q: 'Existe desconto para fechar junto com vizinhos do mesmo condomínio?',
    a: 'Sim! Empreendimentos como os residenciais Cury (Rio Wonder, Baía do Rio, Pateo Nazaret, Epicentro) e condomínios vizinhos contam com valores promocionais e taxa de deslocamento unificada quando dois ou mais apartamentos fecham a instalação na mesma data.',
  },
  {
    q: 'O insulfilm protege piso laminado, cortinas e sofás contra o sol?',
    a: 'Com certeza. Nossas películas filtram 99.9% dos raios ultravioleta (UV), que são os principais responsáveis pelo ressecamento de couro, desbotamento de tecidos, pisos de madeira e queima de plantas próximas à janela.',
  },
  {
    q: 'Quanto tempo leva a instalação das películas?',
    a: 'Para janelas individuais ou portas de correr, a instalação leva cerca de 1 a 2 horas. Um apartamento inteiro com varanda e todos os quartos costuma ser finalizado com perfeição no mesmo dia, sem sujeira e sem necessidade de quebra-quebra.',
  },
  {
    q: 'Qual o prazo de garantia oferecido pela LUME?',
    a: 'Trabalhamos com garantia contratual de até 10 anos contra bolhas, descascamento, descolamento e alteração de tonalidade (as películas não ficam roxas com o tempo). Todos os serviços acompanham termo de garantia formal.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Santo Cristo', url: 'https://lumecontrolesolar.com.br/insulfilm-em-santo-cristo/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-santo-cristo/#localbusiness',
      name: 'LUME Controle Solar - Santo Cristo & Porto Maravilha',
      image: 'https://lumecontrolesolar.com.br/hero-bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-em-santo-cristo/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.8986,
        longitude: -43.2033,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Santo Cristo' },
        { '@type': 'AdministrativeArea', name: 'Porto Maravilha' },
        { '@type': 'AdministrativeArea', name: 'Centro' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 19,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm em Santo Cristo e Porto Maravilha',
      serviceType: 'Instalação de Películas de Controle Solar',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-santo-cristo/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Santo Cristo',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: santoCristoFaqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
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
      <SantoCristoPage faqs={santoCristoFaqs} />
    </>
  );
}
