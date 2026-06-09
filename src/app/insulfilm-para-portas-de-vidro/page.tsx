import type { Metadata } from 'next';
import { InsulfilmPortasVidro } from '../../views/InsulfilmPortasVidro';

const pageUrl = 'https://lumecontrolesolar.com.br/insulfilm-para-portas-de-vidro/';
const title = 'Insulfilm para Portas de Vidro no Rio de Janeiro | LUME Controle Solar';
const description =
  'Instalacao de insulfilm para portas de vidro residenciais e comerciais no Rio de Janeiro. Mais privacidade, conforto termico, protecao UV e acabamento profissional.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'insulfilm para portas de vidro',
    'pelicula para porta de vidro',
    'insulfilm residencial para porta de vidro',
    'pelicula jateada para porta de vidro',
    'insulfilm para porta de varanda',
    'pelicula de privacidade para porta de vidro',
    'insulfilm para porta blindex',
    'insulfilm para portas comerciais',
    'insulfilm porta de vidro Rio de Janeiro',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Insulfilm para portas de vidro instalado pela LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Insulfilm para Portas de Vidro',
  alternateName: [
    'Pelicula para porta de vidro',
    'Pelicula de privacidade para porta de vidro',
    'Insulfilm para porta blindex',
  ],
  description,
  url: pageUrl,
  image: 'https://lumecontrolesolar.com.br/og-image.jpg',
  serviceType: 'Instalacao de peliculas para portas de vidro residenciais e comerciais',
  provider: {
    '@type': 'LocalBusiness',
    name: 'LUME Controle Solar',
    url: 'https://lumecontrolesolar.com.br',
    telephone: '+5521965140612',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Estrada do Realengo, 973',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
  },
  areaServed: [
    { '@type': 'Place', name: 'Bangu' },
    { '@type': 'Place', name: 'Campo Grande' },
    { '@type': 'Place', name: 'Realengo' },
    { '@type': 'Place', name: 'Jacarepagua' },
    { '@type': 'Place', name: 'Barra da Tijuca' },
    { '@type': 'Place', name: 'Recreio dos Bandeirantes' },
    { '@type': 'City', name: 'Rio de Janeiro' },
  ],
  offers: {
    '@type': 'Offer',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'LocalBusiness',
      name: 'LUME Controle Solar',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '19',
    bestRating: '5',
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Garantia', value: '5 anos' },
    { '@type': 'PropertyValue', name: 'Protecao UV', value: 'Ate 99%' },
    { '@type': 'PropertyValue', name: 'Aplicacao', value: 'Residencial e comercial' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Pode colocar insulfilm em qualquer porta de vidro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Na maioria dos casos, sim. O ideal e avaliar tipo de vidro, estado da superficie, tamanho da porta e exposicao ao sol. Portas blindex, portas de varanda, portas comerciais e portas internas geralmente podem receber pelicula.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a melhor pelicula para porta de vidro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende do objetivo. Para calor sem escurecer muito, a nano ceramica costuma ser a melhor opcao. Para privacidade total, a jateada e a mais indicada. Para sol forte e fachada, a refletiva funciona muito bem. Para visual escuro e moderno, a carbono e uma boa escolha.',
      },
    },
    {
      '@type': 'Question',
      name: 'Insulfilm em porta de vidro da privacidade a noite?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende da pelicula. Refletiva, carbono e fume oferecem mais privacidade durante o dia. A noite, com luz interna acesa, a privacidade pode diminuir. Para privacidade 24 horas, a pelicula jateada e a escolha mais segura.',
      },
    },
    {
      '@type': 'Question',
      name: 'A pelicula jateada deixa o ambiente escuro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nao. A pelicula jateada bloqueia a visao direta, mas mantem a entrada de luz difusa. Por isso e muito usada em banheiros, escritorios, consultorios e divisorias.',
      },
    },
    {
      '@type': 'Question',
      name: 'Insulfilm reduz o calor da porta de vidro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Peliculas de controle solar ajudam a reduzir a entrada de calor, principalmente quando a porta recebe sol direto. Nano ceramica e refletiva costumam entregar os melhores resultados termicos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quanto custa insulfilm para porta de vidro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O valor depende do tamanho da porta, tipo de pelicula e dificuldade de instalacao. A melhor forma de calcular e enviar as medidas ou uma foto da porta pelo WhatsApp para receber um orcamento.',
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <InsulfilmPortasVidro />
    </>
  );
}
