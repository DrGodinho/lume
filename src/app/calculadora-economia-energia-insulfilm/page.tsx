import type { Metadata } from 'next';
import { CalculadoraEconomiaEnergiaPage } from '../../views/CalculadoraEconomiaEnergia';

export const metadata: Metadata = {
  title: 'Calculadora de Economia de Energia com Insulfilm | LUME',
  description:
    'Simule economia mensal e anual com peliculas de controle solar premium. Conteudo tecnico, dados de autoridade e estimativa de payback.',
  keywords: [
    'calculadora economia energia insulfilm',
    'simulador economia ar condicionado',
    'pelicula controle solar economia',
    'insulfilm nano ceramica economia',
    'payback pelicula residencial'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/calculadora-economia-energia-insulfilm/' },
  openGraph: {
    title: 'Calculadora de Economia de Energia com Insulfilm | LUME',
    description:
      'Descubra sua economia estimada com peliculas premium e valide seu investimento com dados tecnicos.',
    url: 'https://lumecontrolesolar.com.br/calculadora-economia-energia-insulfilm/',
    type: 'article',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/novo-logo-lume.png',
        width: 1200,
        height: 630,
        alt: 'Calculadora de Economia de Energia com Insulfilm - LUME',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Economia de Energia com Insulfilm | LUME',
    description:
      'Simule economia de energia e tempo de retorno com peliculas premium de controle solar.',
    images: ['https://lumecontrolesolar.com.br/novo-logo-lume.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Calculadora de Economia de Energia com Insulfilm',
      description:
        'Simulador interativo para estimar economia mensal e anual com peliculas de controle solar.',
      url: 'https://lumecontrolesolar.com.br/calculadora-economia-energia-insulfilm/',
      publisher: {
        '@type': 'Organization',
        name: 'LUME Controle Solar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://lumecontrolesolar.com.br/novo-logo-lume.png',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'A pelicula vai deixar a casa muito escura?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nao necessariamente. Peliculas de Nano Ceramica podem manter alta passagem de luz com forte bloqueio de calor.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual a durabilidade do investimento?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Linhas premium costumam ter garantias de fabrica de 5 a 10 anos, com retorno financeiro em poucos anos.',
          },
        },
      ],
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
      <CalculadoraEconomiaEnergiaPage />
    </>
  );
}

