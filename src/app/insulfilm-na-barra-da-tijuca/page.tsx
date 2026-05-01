import type { Metadata } from 'next';
import { BarraPage } from '../../views/BarraPage';

export const metadata: Metadata = {
  title: 'Insulfilm na Barra da Tijuca RJ | Residencial Comercial',
  description: 'Instalação de insulfilm de alta performance na Barra da Tijuca. Películas nano cerâmica, carbono e espelhadas para o seu conforto. Orçamento gratuito.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca' },
  openGraph: {
    title: 'Insulfilm na Barra da Tijuca RJ | LUME Controle Solar',
    description: 'Películas de alta performance na Barra da Tijuca. Nano cerâmica, carbono e espelhadas. Instalação profissional com garantia de 5 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/barra_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm na Barra da Tijuca RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm na Barra da Tijuca RJ | LUME Controle Solar',
    description: 'Películas premium na Barra da Tijuca. Nano cerâmica, carbono e espelhadas. Orçamento gratuito.',
    images: ['https://lumecontrolesolar.com.br/barra_hero_bg.webp'],
  },
};

export default function Page() {
  return <BarraPage />;
}
