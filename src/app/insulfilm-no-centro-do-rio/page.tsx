import type { Metadata } from 'next';
import { CentroRioPage } from '../../views/CentroRioPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm no Centro do Rio de Janeiro RJ | LUME Controle Solar',
  description:
    'Aplicação profissional de insulfilm no Centro do Rio de Janeiro para apartamentos (Reviver Centro), escritórios e consultórios. Películas térmicas Nano Cerâmica, Carbono e Jateado fosco com garantia de até 10 anos. Orçamento grátis pelo WhatsApp.',
  keywords: [
    'insulfilm no centro do rio',
    'insulfilm centro rj',
    'insulfilm comercial centro rj',
    'insulfilm reviver centro',
    'insulfilm para escritorios centro rj',
    'pelicula jateada centro rio de janeiro',
    'insulfilm nano ceramica centro rj',
    'insulfilm para divisorias de vidro centro rj',
    'reducao de calor escritorios centro rj',
    'lume controle solar centro rj',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-centro-do-rio/' },
  openGraph: {
    title: 'Insulfilm no Centro do Rio de Janeiro RJ | LUME Controle Solar',
    description:
      'Soluções de alta performance térmica, controle de reflexo em telas e privacidade para apartamentos do Reviver Centro e empresas no Centro do Rio. Redução de calor de até 95% e garantia de até 10 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-centro-do-rio/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/hero-bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm no Centro do Rio de Janeiro - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Centro do Rio de Janeiro RJ | LUME Controle Solar',
    description:
      'Controle solar, anti-reflexo para escritórios e privacidade para apartamentos no Centro do Rio. Garantia de até 10 anos. Orçamento expresso via WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/hero-bg.webp'],
  },
};

const centroRioFaqs = [
  {
    q: 'Quanto custa instalar insulfilm em um imóvel no Centro do Rio?',
    a: 'O valor varia conforme a película e a metragem: a linha Carbono (ideal para privacidade e conforto) parte de R$ 80/m² a R$ 90/m²; a linha Jateada para divisórias de escritório parte de R$ 100/m²; e a Nano Cerâmica térmica de alta performance parte de R$ 180 a R$ 220/m². O orçamento para residências ou empresas no Centro é 100% gratuito pelo WhatsApp.',
  },
  {
    q: 'Vocês atendem escritórios e empresas fora do horário comercial no Centro?',
    a: 'Sim! Sabemos que muitas empresas na Av. Rio Branco, Carioca e Cinelândia não podem parar suas operações durante o expediente. Por isso, oferecemos agendamento em horários flexíveis, incluindo início da manhã, período noturno e finais de semana.',
  },
  {
    q: 'O insulfilm resolve o reflexo do sol nos computadores e monitores de trabalho?',
    a: 'Com certeza. O excesso de luz solar direta nas telas causa cansaço visual e atrapalha a leitura. Nossas películas de controle solar filtram até 80% do ofuscamento, permitindo trabalhar com conforto mantendo a luz natural agradável.',
  },
  {
    q: 'Os novos prédios do programa Reviver Centro permitem insulfilm nas janelas?',
    a: 'Sim! Os condomínios residenciais do Reviver Centro e edifícios revitalizados acolhem películas de controle solar, especialmente as linhas Nano Cerâmica e Carbono Neutro, que não criam efeito espelhado agressivo e respeitam as fachadas urbanas.',
  },
  {
    q: 'A LUME emite Nota Fiscal para empresas e pessoas jurídicas?',
    a: 'Sim, emitimos Nota Fiscal de serviço completa para todas as empresas, escritórios, consultórios e condomínios, acompanhada de termo de garantia formal de até 10 anos.',
  },
  {
    q: 'Quais regiões do Centro do Rio são atendidas com visita técnica?',
    a: 'Atendemos todo o Centro e regiões vizinhas: Av. Rio Branco, Presidente Vargas, Cinelândia, Carioca, Castelo, Praça XV, Lapa, Bairro de Fátima, Cruz Vermelha, Saúde, Gamboa e Santo Cristo.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Centro do Rio de Janeiro', url: 'https://lumecontrolesolar.com.br/insulfilm-no-centro-do-rio/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-centro-do-rio/#localbusiness',
      name: 'LUME Controle Solar - Centro do Rio de Janeiro',
      image: 'https://lumecontrolesolar.com.br/hero-bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-centro-do-rio/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9068,
        longitude: -43.1729,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Centro' },
        { '@type': 'Neighborhood', name: 'Lapa' },
        { '@type': 'Neighborhood', name: 'Cinelândia' },
        { '@type': 'Neighborhood', name: 'Carioca' },
        { '@type': 'Neighborhood', name: 'Castelo' },
        { '@type': 'AdministrativeArea', name: 'Reviver Centro' },
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
      name: 'Instalação de Insulfilm no Centro do Rio de Janeiro',
      serviceType: 'Instalação de Películas de Controle Solar e Jateado',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-centro-do-rio/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Centro',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: centroRioFaqs.map((item) => ({
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
      <CentroRioPage faqs={centroRioFaqs} />
    </>
  );
}
