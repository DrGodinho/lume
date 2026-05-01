export interface NeighborhoodData {
  slug: string;
  name: string;
  region: string;
  heroBg: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  neighborName: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  whatsappMessage: string;
  heroButtonText: string;
  secondaryButtonText: string;
  regionsList: string[];
  faq: { q: string; a: string }[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export const neighborhoods: Record<string, NeighborhoodData> = {
  'insulfilm-em-bangu': {
    slug: 'insulfilm-em-bangu',
    name: 'Bangu',
    region: 'Zona Oeste do Rio de Janeiro',
    heroBg: '/bangu_hero_bg.webp',
    heroTitle: 'Insulfilm em',
    heroHighlight: 'Bangu',
    heroSubtitle: 'Aplicação profissional de películas de controle solar para residências e empresas em Bangu e toda a região da Zona Oeste. Proteção contra o calor intenso e privacidade garantida.',
    neighborName: 'Bangu',
    metaTitle: 'Insulfilm em Bangu | Aplicação Residencial e Comercial - LUME',
    metaDescription: 'Instalação de insulfilm profissional em Bangu com aplicação express em 24h. Películas para redução de calor, privacidade e segurança. Orçamento gratuito pelo WhatsApp.',
    canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-bangu',
    whatsappMessage: 'Olá! Quero um orçamento de insulfilm em Bangu.',
    heroButtonText: 'Pedir Orçamento pelo WhatsApp',
    secondaryButtonText: 'Ver Tipos de Insulfilm',
    regionsList: [
      "Estrada do Engenho", "Estrada da Água Branca", "Rua Doze de Fevereiro", 
      "Rua Silva Cardoso", "Vila Kennedy", "Bangu Shopping e proximidades",
      "Padre Miguel", "Guilherme da Silveira"
    ],
    faq: [
      {
        q: "1. Quanto custa instalar insulfilm residencial em Bangu?",
        a: "O valor varia conforme o tipo de película escolhida e a quantidade de metros quadrados de vidro. Películas básicas custam menos do que as linhas nano cerâmica ou de segurança. Ofereço orçamento gratuito e sem compromisso pelo WhatsApp."
      },
      {
        q: "2. Qual o melhor tipo de insulfilm para casas em Bangu?",
        a: "Para o clima quente da Zona Oeste, recomendo as películas nano cerâmica ou nano carbono para máxima rejeição de calor. Se privacidade for a prioridade, o G5 fumê é o mais indicado."
      }
    ],
    location: {
      lat: -22.8751,
      lng: -43.4659,
      address: 'Bangu, Rio de Janeiro - RJ'
    }
  },
  'insulfilm-em-realengo': {
    slug: 'insulfilm-em-realengo',
    name: 'Realengo',
    region: 'Zona Oeste do Rio de Janeiro',
    heroBg: '/realengo_hero_bg.webp',
    heroTitle: 'Insulfilm em',
    heroHighlight: 'Realengo',
    heroSubtitle: 'Soluções em controle solar para sua residência ou comércio em Realengo. Instalação rápida, limpa e com a melhor tecnologia do mercado para o clima carioca.',
    neighborName: 'Realengo',
    metaTitle: 'Insulfilm em Realengo | Aplicação Residencial e Comercial - LUME',
    metaDescription: 'Instalação de insulfilm em Realengo e região com aplicação profissional em até 24 horas. Películas residenciais e comerciais. Orçamento gratuito pelo WhatsApp.',
    canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo',
    whatsappMessage: 'Olá! Quero um orçamento de insulfilm em Realengo.',
    heroButtonText: 'Orçamento pelo WhatsApp',
    secondaryButtonText: 'Ver Películas',
    regionsList: [
      "Avenida Santa Cruz", "Rua Piraquara", "Rua Limites", 
      "Jardim Novo", "Magalhães Bastos", "Sulacap",
      "Universidade Castelo Branco", "Parque Shopping Sulacap"
    ],
    faq: [
      {
        q: "1. Vocês atendem em todo o bairro de Realengo?",
        a: "Sim! Atendemos todas as ruas de Realengo, incluindo áreas próximas como Magalhães Bastos, Vila Militar e Padre Miguel. A instalação é feita no local, com agendamento rápido."
      }
    ],
    location: {
      lat: -22.8789,
      lng: -43.4326,
      address: 'Realengo, Rio de Janeiro - RJ'
    }
  },
  'insulfilm-em-campo-grande': {
    slug: 'insulfilm-em-campo-grande',
    name: 'Campo Grande',
    region: 'Zona Oeste do Rio de Janeiro',
    heroBg: '/campo_grande_hero_bg.webp',
    heroTitle: 'Insulfilm em',
    heroHighlight: 'Campo Grande',
    heroSubtitle: 'Proteção e estilo para os vidros da sua casa em Campo Grande. Redução brutal de calor com películas de alta performance e garantia de durabilidade.',
    neighborName: 'Campo Grande',
    metaTitle: 'Insulfilm em Campo Grande RJ | Aplicação Residencial e Comercial - LUME',
    metaDescription: 'Instalação profissional de insulfilm em Campo Grande RJ com aplicação express em 24h. Películas para redução de calor, privacidade e segurança. Orçamento gratuito.',
    canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande',
    whatsappMessage: 'Olá! Quero um orçamento de insulfilm em Campo Grande.',
    heroButtonText: 'Falar com Especialista',
    secondaryButtonText: 'Modelos de Película',
    regionsList: [
      "Estrada do Monteiro", "Estrada do Cabuçu", "Estrada das Capoeiras",
      "Rua Barcelos Domingos", "Mendanha", "West Shopping",
      "Park Shopping Campo Grande", "Vila Nova"
    ],
    faq: [
      {
        q: "1. Qual o prazo para instalação em Campo Grande?",
        a: "Trabalhamos com aplicação express. Geralmente conseguimos agendar e realizar a instalação em até 24 a 48 horas após o fechamento do orçamento."
      }
    ],
    location: {
      lat: -22.9023,
      lng: -43.5591,
      address: 'Campo Grande, Rio de Janeiro - RJ'
    }
  },
  'insulfilm-em-jacarepagua': {
    slug: 'insulfilm-em-jacarepagua',
    name: 'Jacarepaguá',
    region: 'Zona Oeste do Rio de Janeiro',
    heroBg: '/jacarepagua_hero_bg.webp',
    heroTitle: 'Insulfilm em',
    heroHighlight: 'Jacarepaguá',
    heroSubtitle: 'Conforto e sofisticação para apartamentos e casas em Jacarepaguá. Atendimento especializado na Freguesia, Taquara, Anil e toda a região.',
    neighborName: 'Jacarepaguá',
    metaTitle: 'Insulfilm em Jacarepaguá | Residenciais e Comerciais - LUME',
    metaDescription: 'Aplicação de insulfilm em Jacarepaguá, Freguesia e Taquara. Películas de alta performance para controle solar e privacidade. Atendimento profissional na Zona Oeste.',
    canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua',
    whatsappMessage: 'Olá! Quero um orçamento de insulfilm em Jacarepaguá.',
    heroButtonText: 'Pedir Orçamento Agora',
    secondaryButtonText: 'Ver Benefícios',
    regionsList: [
      "Freguesia", "Taquara", "Anil", "Curicica", "Pechincha",
      "Tanque", "Praça Seca", "Cidade de Deus"
    ],
    faq: [
      {
        q: "1. O insulfilm ajuda a reduzir o uso do ar-condicionado em Jacarepaguá?",
        a: "Com certeza. Nossas películas de Nano Cerâmica rejeitam até 97% do calor infravermelho, mantendo os ambientes muito mais frescos e reduzindo significativamente o consumo de energia."
      }
    ],
    location: {
      lat: -22.9304,
      lng: -43.3741,
      address: 'Jacarepaguá, Rio de Janeiro - RJ'
    }
  },
  'insulfilm-na-barra-da-tijuca': {
    slug: 'insulfilm-na-barra-da-tijuca',
    name: 'Barra da Tijuca',
    region: 'Barra da Tijuca e Região',
    heroBg: '/barra_hero_bg.webp',
    heroTitle: 'Insulfilm na',
    heroHighlight: 'Barra',
    heroSubtitle: 'Eleve o padrão de conforto térmico do seu imóvel na Barra da Tijuca. Películas de alta tecnologia para residências de luxo e ambientes corporativos modernos.',
    neighborName: 'Barra da Tijuca',
    metaTitle: 'Insulfilm na Barra da Tijuca | Residencial e Comercial - LUME',
    metaDescription: 'Instalação de insulfilm na Barra da Tijuca, Jardim Oceânico e Península. Películas de controle solar premium para casas e apartamentos de luxo. Padrão Elite LUME.',
    canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca',
    whatsappMessage: 'Olá! Quero um orçamento de insulfilm na Barra da Tijuca.',
    heroButtonText: 'Solicitar Orçamento',
    secondaryButtonText: 'Ver Películas Elite',
    regionsList: [
      "Jardim Oceânico", "Península", "Avenida das Américas", "Lúcio Costa",
      "Riviera dei Fiori", "ABM", "Parque das Rosas", "Rio2"
    ],
    faq: [
      {
        q: "1. Quais películas são mais indicadas para varandas gourmet na Barra?",
        a: "Para varandas, as mais pedidas são a Nano Cerâmica (transparente com alta rejeição térmica) e a Dupla Camada (privacidade com visão nítida). Ambas protegem os móveis contra o desbotamento UV."
      }
    ],
    location: {
      lat: -23.0003,
      lng: -43.3658,
      address: 'Barra da Tijuca, Rio de Janeiro - RJ'
    }
  },
  'insulfilm-no-recreio': {
    slug: 'insulfilm-no-recreio',
    name: 'Recreio',
    region: 'Recreio dos Bandeirantes',
    heroBg: '/recreio_hero_bg.webp',
    heroTitle: 'Insulfilm no',
    heroHighlight: 'Recreio',
    heroSubtitle: 'Conforto térmico absoluto para quem vive o melhor do Rio. Aplicação de películas residenciais e comerciais no Recreio com padrão de elite LUME.',
    neighborName: 'Recreio',
    metaTitle: 'Insulfilm no Recreio dos Bandeirantes | Residencial e Comercial - LUME',
    metaDescription: 'Instalação de insulfilm no Recreio dos Bandeirantes, Barra Bonita e Pontal. Proteção térmica premium para casas e apartamentos. Agende seu orçamento pelo WhatsApp.',
    canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio',
    whatsappMessage: 'Olá! Quero um orçamento de insulfilm no Recreio.',
    heroButtonText: 'Solicitar Orçamento',
    secondaryButtonText: 'Linha de Produtos',
    regionsList: [
      "Barra Bonita", "Gleba A e B", "Pontal", "Avenida das Américas",
      "Vargem Grande", "Vargem Pequena", "Macumba", "Reserva"
    ],
    faq: [
      {
        q: "1. O insulfilm de vocês protege contra o salitre no Recreio?",
        a: "Nossas películas premium possuem camadas de proteção que ajudam a preservar os vidros, mas o principal benefício é o bloqueio de 99% dos raios UV que causariam danos severos aos interiores por conta da alta exposição solar da região."
      }
    ],
    location: {
      lat: -23.0189,
      lng: -43.4664,
      address: 'Recreio dos Bandeirantes, Rio de Janeiro - RJ'
    }
  }
};
