import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm na Gávea RJ | Películas Térmicas Nano Cerâmica - LUME',
  description:
    'Aplicação especializada de insulfilm na Gávea. Películas térmicas Nano Cerâmica para apartamentos e casarões: bloqueio de até 95% do calor sem perder a vista da mata. Melhor custo-benefício da região, garantia de até 10 anos.',
  keywords: [
    'insulfilm na gavea',
    'insulfilm gavea rj',
    'pelicula termica gavea',
    'insulfilm nano ceramica gavea',
    'insulfilm marques de sao vicente',
    'insulfilm alto da gavea',
    'pelicula para janelas gavea',
    'lume controle solar gavea'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-gavea/' },
  openGraph: {
    title: 'Insulfilm na Gávea RJ | LUME Controle Solar',
    description:
      'Soluções de controle térmico e proteção solar para apartamentos e residências nobres na Gávea. Bloqueio de calor com transparência cristalina.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-gavea/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/gavea_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm na Gávea RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Gávea RJ | LUME Controle Solar',
    description:
      'Películas de controle solar e Nano Cerâmica de alta tecnologia para imóveis na Gávea. Proteção UV e corte térmico.',
    images: ['https://lumecontrolesolar.com.br/gavea_hero_bg.webp'],
  },
};

const gaveaConfig: NeighborhoodConfig = {
  name: 'Gávea',
  region: 'Zona Sul do Rio de Janeiro',
  heroBadge: 'Atendimento Técnico de Alto Padrão na Gávea',
  heroBg: '/gavea_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'na', 'Gávea', 'RJ'],
  heroGoldIndices: [2],
  subtitleBadge: 'Corte Térmico com Transparência Pura & Melhor Preço',
  description:
    'Conforto térmico de padrão internacional para apartamentos e residências na Gávea. Nossa Nano Cerâmica bloqueia até 95% do calor do sol mantendo 100% da vista exuberante da mata e das montanhas, com o valor por m² mais competitivo e justo da Zona Sul.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20da%20G%C3%A1vea%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '95', suffix: '%', label: 'Corte Térmico Infravermelho', sublabel: 'Nano Cerâmica sem escurecer' },
    { target: '99', suffix: '.9%', label: 'Proteção UV400 Absoluta', sublabel: 'Móveis, acervos e pele protegidos' },
    { target: '35', suffix: '%', label: 'Economia no Ar-Condicionado', sublabel: 'Climatização rápida e eficiente' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual LUME', sublabel: 'Sem bolhas e sem desbotamento' },
  ],
  localPainsTitle: 'Desafios Térmicos e de Luminosidade na Gávea',
  localPainsSubtitle: 'Integração com a Natureza e Eficiência Energética',
  localPains: [
    {
      title: 'Proteja-se do Calor sem Perder a Vista da Mata e das Montanhas',
      problem:
        'Residências e coberturas em ruas nobres como Marquês de São Vicente, Mary Pessoa e Rodrigo Otávio possuem janelões voltados para o verde. Películas escuras comuns fecham a vista e criam espelho interno desagradável à noite.',
      solution:
        'A Nano Cerâmica atua de forma seletiva no calor invisível, mantendo até 70% de transmissão luminosa e transparência óptica cristalina em qualquer hora do dia.',
    },
    {
      title: 'Proteção UV: Blindagem para Acervos de Arte, Madeiras e Pele',
      problem:
        'A radiação ultravioleta incidente em salas envidraçadas desbota quadros, degrada pisos de taco e peroba do campo e resseca estofados de linho e couro.',
      solution:
        'Filtro UV400 com 99,9% de retenção permanente, funcionando como um verniz protetor invisível que salvaguarda o patrimônio familiar e a saúde da pele.',
    },
    {
      title: 'Alívio do Ar-Condicionado nas Tardes Abafadas da Gávea',
      problem:
        'A umidade da encosta combinada com a insolação da tarde retém calor nos cômodos, obrigando o ar-condicionado a operar no máximo por horas a fio.',
      solution:
        'Bloqueio de até 95% da carga térmica solar diretamente no vidro, reduzindo a sensação térmica em até 8°C e aliviando a conta de energia em até 35%.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Nano Cerâmica',
      category: 'Proteção Térmica Máxima & Transparência',
      tag: 'Mais Escolhida na Gávea',
      highlight: true,
      heatRejection: 5,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Grandes panos de vidro, varandas integradas e livings voltados para a mata.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade & Sem Espelho Noturno',
      tag: 'Alta Performance',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Quartos e salas com incidência direta de sol da tarde ou vista devassada.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Carbono Premium',
      category: 'Estética Grafite & Redução de Brilho',
      tag: 'Custo-Benefício',
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Dormitórios, home offices e áreas que exigem alívio de reflexo em telas.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Antivandalismo PS8',
      category: 'Segurança & Retenção de Impacto',
      tag: 'Proteção Reforçada',
      heatRejection: 2,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Portas de correr em casas, guaritas, halls de entrada e vitrines.',
      priceNote: 'A partir de R$ 160/m² instalado',
    },
  ],
  coverageLocations: [
    'Rua Marquês de São Vicente',
    'Rua Mary Pessoa',
    'Rua Rodrigo Otávio',
    'Rua dos Oitis',
    'Rua Embaixador Carlos Taylor',
    'Rua Capistrano de Abreu',
    'Rua Major Rubens Vaz',
    'Praça Santos Dumont',
    'Alto da Gávea',
    'Estrada da Gávea',
    'Condomínios Residenciais da PUC-Rio',
    'Parque da Cidade & Arredores',
  ],
  faqs: [
    {
      q: 'A película Nano Cerâmica instalada na Gávea altera a fachada do condomínio?',
      a: 'Não. A Nano Cerâmica 70% é 100% incolor e livre de partículas metálicas. Ela não gera reflexo externo nem escurece os vidros, sendo totalmente aprovada em convenções de condomínio na Zona Sul.',
    },
    {
      q: 'Por que o preço da Nano Cerâmica da LUME é mais acessível que o dos concorrentes?',
      a: 'Trabalhamos diretamente com importação de rolos industriais e contamos com equipe própria de instaladores credenciados, eliminando intermediários e franquias. Por isso, oferecemos películas com cerâmica pura de alta retenção a partir de R$ 200/m² instalado, com o mesmo padrão e garantia dos principais revendedores da orla.',
    },
    {
      q: 'A instalação preserva a vista das montanhas e da mata durante a noite?',
      a: 'Sim. Ao contrário de filmes refletivos tradicionais que espelham o interior quando as luzes da sala são acesas, nossa linha Nano Cerâmica possui refletividade interna ultrabaixa (neutra), mantendo a visão cristalina da paisagem dia e noite.',
    },
    {
      q: 'A medição técnica na Gávea tem algum custo?',
      a: 'A medição técnica com trena a laser e demonstração de amostras físicas é totalmente gratuita e sem compromisso em qualquer rua ou condomínio da Gávea.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Gávea', url: 'https://lumecontrolesolar.com.br/insulfilm-na-gavea/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-gavea/#localbusiness',
      name: 'LUME Controle Solar - Insulfilm na Gávea RJ',
      image: 'https://lumecontrolesolar.com.br/gavea_hero_bg.webp',
      telephone: businessInfo.phoneE164,
      url: 'https://lumecontrolesolar.com.br/insulfilm-na-gavea/',
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9772,
        longitude: -43.2325,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Gávea' },
        { '@type': 'Neighborhood', name: 'Alto da Gávea' },
        { '@type': 'City', name: 'Rio de Janeiro' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 27,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm Térmico e Nano Cerâmica na Gávea RJ',
      serviceType: 'Aplicação de Películas de Controle Solar e Térmico de Alto Padrão',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-na-gavea/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Gávea',
      },
      description:
        'Aplicação profissional de películas de controle solar e Nano Cerâmica na Gávea. Bloqueio de calor de até 95%, proteção UV400 e garantia formal de até 10 anos.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '80.00',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceType: 'https://schema.org/StartingPrice',
          unitText: 'm²',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: gaveaConfig.faqs.map((faq) => ({
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

export default function GaveaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={gaveaConfig} />
    </>
  );
}
