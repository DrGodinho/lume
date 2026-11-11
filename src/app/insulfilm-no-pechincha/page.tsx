import type { Metadata } from 'next';
import { PremiumNeighborhoodView, type NeighborhoodConfig } from '@/views/PremiumNeighborhoodView';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Insulfilm no Pechincha RJ | Privacidade & Redução de Calor - LUME',
  description:
    'Instalação especializada de insulfilm no Pechincha (Jacarepaguá). Películas de controle solar, privacidade total para condomínios e redução de calor com garantia de até 10 anos. Orçamento gratuito pelo WhatsApp.',
  keywords: [
    'insulfilm no pechincha',
    'insulfilm pechincha rj',
    'insulfilm pechincha jacarepagua',
    'pelicula privacidade pechincha',
    'insulfilm residencial pechincha',
    'insulfilm retiro dos artistas',
    'insulfilm estrada do tindiba pechincha',
    'lume controle solar pechincha'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-pechincha/' },
  openGraph: {
    title: 'Insulfilm no Pechincha RJ | LUME Controle Solar',
    description:
      'Privacidade total para condomínios, bloqueio de calor e proteção UV no Pechincha. Películas com garantia de até 10 anos e orçamento sem compromisso.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-pechincha/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/pechincha_hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Insulfilm no Pechincha Jacarepaguá RJ - LUME Controle Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Pechincha RJ | LUME Controle Solar',
    description:
      'Películas para condomínios residenciais e empresas no Pechincha. Privacidade e conforto térmico com orçamento rápido no WhatsApp.',
    images: ['https://lumecontrolesolar.com.br/pechincha_hero_bg.webp'],
  },
};

const pechinchaConfig: NeighborhoodConfig = {
  name: 'Pechincha (Jacarepaguá)',
  region: 'Zona Oeste do Rio de Janeiro',
  heroBadge: 'Atendimento Especializado no Pechincha & Jacarepaguá',
  heroBg: '/pechincha_hero_bg.webp',
  heroTitleWords: ['Insulfilm', 'no', 'Pechincha', 'Jacarepaguá'],
  heroGoldIndices: [2, 3],
  subtitleBadge: 'Privacidade Entre Condomínios · Redução Térmica · Agilidade',
  description:
    'Aplicação profissional de películas de privacidade e isolamento térmico para os condomínios residenciais do Pechincha. Mantenha as cortinas abertas com luz natural abundante sem que os vizinhos vejam o interior do seu lar.',
  whatsappUrl:
    'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20do%20Pechincha%20(Jacarepagu%C3%A1)%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.',
  stats: [
    { target: '100', suffix: '%', label: 'Privacidade Diurna', sublabel: 'Visão externa bloqueada com luz natural' },
    { target: '95', suffix: '%', label: 'Corte de Calor Infravermelho', sublabel: 'Películas térmicas avançadas' },
    { target: '10', suffix: ' Anos', label: 'Garantia Contratual', sublabel: 'Material de primeira linha anti-bolhas' },
    { target: '24', suffix: 'h', label: 'Instalação Rápida', sublabel: 'Medição e aplicação expressa' },
  ],
  localPainsTitle: 'Desafios Arquitetônicos no Pechincha',
  localPainsSubtitle: 'Privacidade e Conforto para Grandes Condomínios',
  localPains: [
    {
      title: 'Proximidade Entre Janelas e Blocos Vizinhos',
      problem:
        'A alta densidade de condomínios no Pechincha faz com que as janelas de quartos e salas fiquem de frente para outros blocos, forçando moradores a viver com cortinas fechadas o dia todo.',
      solution:
        'Películas Carbono Premium ou Dupla Camada que criam uma barreira de privacidade visual diurna total, permitindo curtir a claridade natural com tranquilidade.',
    },
    {
      title: 'Aquecimento Excessivo de Salas e Quartos',
      problem:
        'As tardes no Pechincha são marcadas por sol direto em fachadas envidraçadas, esquentando os cômodos e tornando o ambiente abafado até altas horas da noite.',
      solution:
        'Linhas Nano Cerâmica e Dupla Camada que filtram o calor infravermelho no vidro, mantendo a temperatura amena e os ambientes muito mais agradáveis.',
    },
    {
      title: 'Proteção para Persianas, Sofás e Pisos',
      problem:
        'A incidência contínua de raios ultravioleta descolora cortinas, queima sofás e resseca pisos laminados rapidamente.',
      solution:
        'Bloqueio UV de 99% que atua como um escudo invisível permanente, aumentando a durabilidade de toda a mobília.',
    },
  ],
  recommendedFilms: [
    {
      name: 'Carbono Premium',
      category: 'Privacidade Total & Custo-Benefício',
      tag: 'Mais Popular no Pechincha',
      highlight: true,
      heatRejection: 3,
      uvBlock: 5,
      privacy: 5,
      durability: '5 Anos',
      idealFor: 'Apartamentos com janelas próximas a vizinhos, quartos e home office.',
      priceNote: 'A partir de R$ 80/m² instalado',
    },
    {
      name: 'Dupla Camada',
      category: 'Privacidade Diurna sem Espelho Noturno',
      tag: 'Conforto Ótico',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 5,
      durability: '7 Anos',
      idealFor: 'Salas e varandas que exigem privacidade durante o dia e visão limpa à noite.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
    {
      name: 'Nano Cerâmica',
      category: 'Máximo Bloqueio de Calor',
      tag: 'Transparência Térmica',
      heatRejection: 5,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Varandas gourmet, cortinas de vidro e locais onde não se deseja alterar a luz natural.',
      priceNote: 'A partir de R$ 200/m² instalado',
    },
    {
      name: 'Antivandalismo PS4',
      category: 'Proteção Antivandalismo',
      tag: 'Retenção de Fragmentos',
      heatRejection: 1,
      uvBlock: 5,
      privacy: 1,
      durability: '10 Anos',
      idealFor: 'Portas de vidro de correr, janelas baixas e divisórias residenciais.',
      priceNote: 'A partir de R$ 110/m² instalado',
    },
  ],
  coverageLocations: [
    'Estrada do Tindiba',
    'Estrada do Pau-Ferro',
    'Rua Retiro dos Artistas',
    'Rua Lopo Saraiva',
    'Rua Castelo Branco',
    'Rua Samuel das Neves',
    'Rua Monsenhor Marques',
    'Condomínio Spazio Rotterdan',
    'Condomínio Facile',
    'Mix Mall & Business',
    'Largo do Pechincha',
    'Rua Edgar Werneck',
    'Estrada do Capenha',
  ],
  faqs: [
    {
      q: 'Qual película é a mais indicada para quem tem janela de frente para o vizinho no Pechincha?',
      a: 'A linha Carbono Premium G20 ou a película Dupla Camada são as escolhas ideais. Elas impedem a visão de fora para dentro durante o dia com alto conforto visual, permitindo que você veja o exterior com total nitidez sem ser observado.',
    },
    {
      q: 'As películas bloqueiam a entrada de luz natural?',
      a: 'Não necessariamente. Se a sua prioridade for manter a sala clara com luz do sol, recomendamos a película Nano Cerâmica 70% ou 75%, que retém 95% do calor mantendo a transparência quase total. Caso prefira diminuir o brilho excessivo, películas com tonalidades como G20 ou G35 equilibram perfeitamente luz e privacidade.',
    },
    {
      q: 'Qual o tempo de instalação para um apartamento no Pechincha?',
      a: 'Geralmente instalamos as janelas de um apartamento padrão de 2 quartos em aproximadamente 2 a 3 horas. Nossa instalação é limpa, sem poeira e com proteção de todo o mobiliário próximo.',
    },
    {
      q: 'A LUME oferece garantia contra bolhas?',
      a: 'Sim! Nossas películas possuem garantia formal de até 10 anos contra formação de bolhas, descascamento ou alteração para tonalidade roxa, pois utilizamos materiais de poliéster com adesivos de alta pureza ótica.',
    },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Onde Atendemos', url: 'https://lumecontrolesolar.com.br/#onde-atendemos' },
      { name: 'Pechincha (Jacarepaguá)', url: 'https://lumecontrolesolar.com.br/insulfilm-no-pechincha/' },
    ]),
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-pechincha/#localbusiness',
      name: 'LUME Controle Solar - Pechincha Jacarepaguá',
      image: 'https://lumecontrolesolar.com.br/pechincha_hero_bg.webp',
      url: 'https://lumecontrolesolar.com.br/insulfilm-no-pechincha/',
      telephone: businessInfo.phoneE164,
      priceRange: '$$',
      address: businessAddressSchema,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.9348,
        longitude: -43.3564,
      },
      areaServed: [
        { '@type': 'Neighborhood', name: 'Pechincha' },
        { '@type': 'Neighborhood', name: 'Jacarepaguá' },
        { '@type': 'Neighborhood', name: 'Retiro dos Artistas' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        reviewCount: 24,
        bestRating: 5,
      },
    },
    {
      '@type': 'Service',
      name: 'Instalação de Insulfilm no Pechincha Jacarepaguá RJ',
      serviceType: 'Aplicação de Películas de Privacidade e Controle Solar para Condomínios',
      provider: {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-no-pechincha/#localbusiness',
      },
      areaServed: {
        '@type': 'Neighborhood',
        name: 'Pechincha (Jacarepaguá)',
      },
      description:
        'Instalação especializada de películas de privacidade para condomínios, bloqueio térmico e proteção UV no Pechincha, Jacarepaguá.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '90.00',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceType: 'https://schema.org/StartingPrice',
          unitText: 'm²',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: pechinchaConfig.faqs.map((faq) => ({
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

export default function PechinchaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumNeighborhoodView config={pechinchaConfig} />
    </>
  );
}

