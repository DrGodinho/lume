import type { Metadata } from 'next';
import { TetoVidroPage } from '../../views/TetoVidroPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm para Teto de Vidro e Clarabóia RJ | Redução de Calor - LUME',
  description:
    'Instalação de insulfilm para teto de vidro, pergolado e clarabóia no Rio de Janeiro. Redução de até -8°C na sensação térmica, até 97% de corte infravermelho e segurança contra choque térmico. Orçamento grátis.',
  keywords: [
    'insulfilm para teto de vidro',
    'película térmica clarabóia rj',
    'insulfilm para pergolado de vidro',
    'redução calor teto de vidro rj',
    'película solar cobertura zenital',
    'insulfilm cobertura duplex rj',
    'película refletiva claraboia',
    'nano cerâmica teto de vidro',
    'proteção térmica telhado de vidro',
    'lume controle solar teto de vidro',
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-para-teto-de-vidro/' },
  openGraph: {
    title: 'Insulfilm para Teto de Vidro e Clarabóia RJ | LUME Controle Solar',
    description:
      'Solução definitiva para o calor de coberturas e pergolados envidraçados. Até 97% de bloqueio de calor infravermelho e alívio imediato no ar-condicionado.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-para-teto-de-vidro/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/teto_vidro_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm para Teto de Vidro e Clarabóia RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm para Teto de Vidro e Clarabóia RJ | LUME Controle Solar',
    description:
      'Reduza até -8°C a temperatura ambiente sob tetos de vidro e pergolados. Películas antitérmicas de alta eficiência com orçamento no WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/teto_vidro_hero_bg.webp'],
  },
};

const tetoVidroFaqs = [
  {
    q: 'Aplicar película no teto de vidro pode trincar o vidro com o calor?',
    a: 'Esse risco existe apenas se forem aplicadas películas comuns de baixa qualidade ou películas muito escuras com alta taxa de absorção solar em vidros não temperados. Na LUME, realizamos avaliação técnica prévia da composição do vidro (laminado, temperado ou monolítico) e utilizamos películas de alta rejeição e reflexão (como a Nano Cerâmica e a linha Refletiva), que rebatem o calor sem gerar estresse térmico.',
  },
  {
    q: 'A película deve ser instalada por dentro ou por fora da cobertura?',
    a: 'Na maioria das residências e coberturas, a instalação é feita pela face interna do vidro, onde a película fica protegida da poeira, chuva e atrito mecânico, garantindo durabilidade máxima de até 10 anos. Em casos específicos onde o acesso interno é bloqueado por forros ou estruturas altas, dispomos de linhas especiais com tratamento externo resistentes a intempéries.',
  },
  {
    q: 'Consigo reduzir o calor sem perder a luz natural e a visão do céu azul?',
    a: 'Sim! Com a tecnologia Nano Cerâmica, filtramos seletivamente até 97% dos raios infravermelhos (que são os geradores do calor) e 99.9% dos raios ultravioleta, mantendo alta transmissão de luz visível. O ambiente continua iluminado e com vista panorâmica do céu, mas com frescor agradável.',
  },
  {
    q: 'Quanto custa para instalar película em um teto de vidro ou clarabóia no RJ?',
    a: 'O valor instalado inicia a partir de R$ 90/m² na linha Refletiva, R$ 110/m² na linha Dupla Camada e R$ 200/m² na linha Nano Cerâmica. O custo pode variar de acordo com a altura do pé-direito e necessidade de andaimes móveis, com medição e orçamento detalhado sem custo.',
  },
  {
    q: 'A película protege pisos de madeira e móveis localizados sob o pergolado?',
    a: 'Sim, bloqueia 99.9% dos raios ultravioleta (UV), evitando que o sol resseque ou desbote pisos vinílicos, decks de madeira cumaru, sofás e tecidos.',
  },
  {
    q: 'Qual a garantia oferecida pela LUME?',
    a: 'Trabalhamos com garantia contratual de até 10 anos para aplicações internas e suporte técnico completo.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Teto de Vidro', url: 'https://lumecontrolesolar.com.br/insulfilm-para-teto-de-vidro/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-para-teto-de-vidro/#localbusiness',
      name: 'LUME Controle Solar - Insulfilm para Teto de Vidro e Clarabóias',
      image: 'https://lumecontrolesolar.com.br/teto_vidro_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-para-teto-de-vidro/',
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
        { '@type': 'Neighborhood', name: 'São Conrado' },
        { '@type': 'Neighborhood', name: 'Joá' },
        { '@type': 'Neighborhood', name: 'Itanhangá' },
        { '@type': 'Neighborhood', name: 'Leblon' },
        { '@type': 'Neighborhood', name: 'Tijuca' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 29,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Térmico para Teto de Vidro, Clarabóias e Pergolados',
      serviceType: 'Aplicação de Películas de Alta Eficiência Térmica Zenital',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-para-teto-de-vidro/#localbusiness',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Rio de Janeiro - RJ',
      },
      description:
        'Aplicação de películas Nano Cerâmica e Refletivas para controle solar zenital extremo em telhados de vidro e pergolados no RJ.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '90.00',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: tetoVidroFaqs.map((faq) => ({
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
      <TetoVidroPage faqs={tetoVidroFaqs} />
    </>
  );
}

