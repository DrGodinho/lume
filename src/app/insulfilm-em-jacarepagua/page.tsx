import type { Metadata } from 'next';
import { JacarepaguaPage } from '../../views/JacarepaguaPage';
import { businessAddressSchema, businessInfo } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Insulfilm em Jacarepaguá RJ | Preço, Instalação e Garantia - LUME',
  description: 'Aplicação profissional de insulfilm em Jacarepaguá e região, Rio de Janeiro. Películas a partir de R$ 90/m²: redução de calor, privacidade e proteção UV com garantia de 2 anos. Orçamento grátis no local e pelo WhatsApp.',
  keywords: [
    'insulfilm em jacarepaguá',
    'insulfilm jacarepaguá rj',
    'preço de insulfilm jacarepaguá',
    'insulfilm jacarepaguá preço',
    'aplicação de insulfilm jacarepaguá',
    'instalação de insulfilm jacarepaguá',
    'insulfilm residencial jacarepaguá',
    'insulfilm freguesia jacarepaguá',
    'insulfilm taquara jacarepaguá',
    'lume controle solar jacarepaguá',
    'insulfilm barato jacarepaguá'
  ],
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/' },
  openGraph: {
    title: 'Insulfilm em Jacarepaguá RJ | LUME Controle Solar',
    description: 'Películas de controle solar em Jacarepaguá. Redução de até 80% do calor e proteção UV 99%. Orçamento rápido e garantia de 2 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Jacarepaguá RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Jacarepaguá RJ | LUME Controle Solar',
    description: 'Redução de até 80% do calor em Jacarepaguá. Proteção UV 99% e garantia de 2 anos.',
    images: ['https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp'],
  },
};

const jacarepaguaFaqs = [
  {
    q: 'Quanto custa instalar insulfilm residencial em Jacarepaguá?',
    a: 'O valor varia conforme o tipo de película e a quantidade de m² de vidro: películas a partir de R$ 90/m² (carbono) até R$ 240/m² (nano cerâmica). Quanto mais vidros no mesmo endereço, melhor o custo médio por peça. Oferecemos orçamento gratuito e sem compromisso pelo WhatsApp — basta enviar as medidas ou agendar visita de medição.',
  },
  {
    q: 'Qual o melhor tipo de insulfilm para a Freguesia ou Taquara?',
    a: 'Devido ao calor intenso dessas áreas, recomendamos Nano Cerâmica ou Dupla Camada para máxima rejeição térmica. Se você mora em apartamento e precisa de privacidade sem escurecer muito, a Nano Cerâmica G70 é perfeita.',
  },
  {
    q: 'O insulfilm residencial danifica o vidro?',
    a: 'Não. A aplicação profissional LUME utiliza solventes neutros. O filme protege o vidro contra o estresse térmico direto e segura estilhaços em caso de quebra acidental.',
  },
  {
    q: 'Quanto tempo dura o insulfilm instalado pela LUME?',
    a: 'Trabalhamos com poliester de alta densidade. Diferente de películas baratas que duram 1 ano, as nossas mantêm a performance e a cor original por 8 a 15 anos se bem cuidadas.',
  },
  {
    q: 'Qual a garantia oferecida em Jacarepaguá?',
    a: 'Você recebe nossa garantia oficial de 2 anos cobrindo qualquer defeito de material ou falha na aplicação. Sua satisfação é nossa prioridade absoluta.',
  },
  {
    q: 'Posso instalar insulfilm em vidro temperado?',
    a: 'Sim, desde que seja usada a película correta. Vidros temperados requerem películas com taxa de absorção de calor adequada para evitar estresse térmico. Avaliamos o tipo de vidro antes da recomendação.',
  },
  {
    q: 'O insulfilm escurece muito a minha sala?',
    a: 'Somente se você desejar. Temos opções "invisíveis" que filtram 99% do calor sem mudar a transparência do vidro, preservando a vista para as montanhas de Jacarepaguá.',
  },
  {
    q: 'Atendem condomínios e empresas em Jacarepaguá?',
    a: 'Sim. Temos ampla experiência em fachadas comerciais, lojas no Pechincha e escritórios em centros empresariais, oferecendo garantia e eficiência para o negócio. Também atendemos Barra, Recreio e toda a Zona Oeste.',
  },
  {
    q: 'Insulfilm é proibido ou ilegal em Jacarepaguá?',
    a: 'Não. O insulfilm residencial é permitido. Em alguns prédios pode haver regra de condomínio sobre a fachada, mas películas que mantêm a visão de fora para dentro (refletiva, carbono) costumam estar liberadas. Consulte a convenção do seu condomínio antes de instalar.',
  },
  {
    q: 'Dá para instalar insulfilm à noite ou em qualquer horário?',
    a: 'Sim. A aplicação é feita por dentro do vidro com iluminação controlada, então pode ser agendada à noite ou nos finais de semana. O importante é o vidro estar limpo e seco; a LUME confirma o melhor horário ao fechar o orçamento.',
  },
  {
    q: 'Quanto tempo leva para instalar insulfilm em Jacarepaguá?',
    a: 'A instalação de uma janela leva poucos minutos; um projeto de casa ou apartamento inteiro costuma ser concluído no mesmo dia. Quanto mais vidros no mesmo endereço, melhor o aproveitamento de tempo e o custo médio por peça.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/#localbusiness',
      'name': 'LUME Controle Solar - Jacarepaguá',
      'image': 'https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp',
      'url': 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/',
      'telephone': businessInfo.phoneE164,
      'priceRange': '$$',
      'address': businessAddressSchema,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': -22.9371,
        'longitude': -43.3920
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Jacarepaguá'
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
      'name': 'Instalação de Insulfilm em Jacarepaguá',
      'serviceType': 'Instalação de Películas',
      'provider': {
        '@id': 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua/#localbusiness'
      },
      'areaServed': {
        '@type': 'Neighborhood',
        'name': 'Jacarepaguá'
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': jacarepaguaFaqs.map((item) => ({
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
      <JacarepaguaPage faqs={jacarepaguaFaqs} />
    </>
  );
}
