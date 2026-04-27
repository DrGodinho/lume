import type { Metadata } from 'next';
import { RealengoPage } from '../../views/RealengoPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Realengo RJ | Instalação Profissional - LUME',
  description: 'Procurando insulfilm em Realengo? A LUME oferece as melhores películas de controle solar com garantia de 5 anos. Reduza o calor e economize energia hoje!',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo' },
  openGraph: {
    title: 'Insulfilm em Realengo RJ | LUME Controle Solar',
    description: 'As melhores películas de controle solar em Realengo. Instalação profissional, garantia de 5 anos e orçamento grátis no local.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/realengo_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Realengo RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Realengo RJ | LUME Controle Solar',
    description: 'Películas de controle solar em Realengo. Instalação profissional e garantia de 5 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/realengo_hero_bg.webp'],
  },
};

export default function Page() {
  return <RealengoPage />;
}
