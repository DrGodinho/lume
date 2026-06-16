import type { Metadata } from 'next';
import { InsulfilmPortasVidro } from '../../views/InsulfilmPortasVidro';

const pageUrl = 'https://lumecontrolesolar.com.br/insulfilm-para-portas-de-vidro/';
const title = 'Insulfilm para Portas de Vidro no Rio de Janeiro | LUME Controle Solar';
const description =
  'Instalação de insulfilm para portas de vidro residenciais e comerciais no Rio de Janeiro. Mais privacidade, conforto térmico, proteção UV e acabamento profissional.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'insulfilm para portas de vidro',
    'película para porta de vidro',
    'insulfilm residencial para porta de vidro',
    'película jateada para porta de vidro',
    'insulfilm para porta de varanda',
    'película de privacidade para porta de vidro',
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
    'Película para porta de vidro',
    'Película de privacidade para porta de vidro',
    'Insulfilm para porta blindex',
  ],
  description,
  url: pageUrl,
  image: 'https://lumecontrolesolar.com.br/og-image.jpg',
  serviceType: 'Instalação de películas para portas de vidro residenciais e comerciais',
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
    { '@type': 'Place', name: 'Jacarepaguá' },
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
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Garantia', value: '5 anos' },
    { '@type': 'PropertyValue', name: 'Proteção UV', value: 'Até 99%' },
    { '@type': 'PropertyValue', name: 'Aplicação', value: 'Residencial e comercial' },
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
        text: 'Na maioria dos casos, sim. O ideal é avaliar tipo de vidro, estado da superfície, tamanho da porta e exposição ao sol. Portas blindex, portas de varanda, portas comerciais e portas internas geralmente podem receber película.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a melhor película para porta de vidro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende do objetivo. Para calor sem escurecer muito, a nano cerâmica costuma ser a melhor opção. Para privacidade total, a jateada é a mais indicada. Para sol forte e fachada, a refletiva funciona muito bem. Para visual escuro e moderno, a carbono é uma boa escolha.',
      },
    },
    {
      '@type': 'Question',
      name: 'Insulfilm em porta de vidro dá privacidade à noite?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende da película. Refletiva, carbono e fumê oferecem mais privacidade durante o dia. À noite, com luz interna acesa, a privacidade pode diminuir. Para privacidade 24 horas, a película jateada é a escolha mais segura.',
      },
    },
    {
      '@type': 'Question',
      name: 'A película jateada deixa o ambiente escuro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. A película jateada bloqueia a visão direta, mas mantém a entrada de luz difusa. Por isso é muito usada em banheiros, escritórios, consultórios e divisórias.',
      },
    },
    {
      '@type': 'Question',
      name: 'Insulfilm reduz o calor da porta de vidro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Películas de controle solar ajudam a reduzir a entrada de calor, principalmente quando a porta recebe sol direto. Nano cerâmica e refletiva costumam entregar os melhores resultados térmicos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quanto custa insulfilm para porta de vidro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O valor depende do tamanho da porta, tipo de película e dificuldade de instalação. A melhor forma de calcular é enviar as medidas ou uma foto da porta pelo WhatsApp para receber um orçamento.',
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
