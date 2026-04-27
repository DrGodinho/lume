import type { Metadata } from 'next';
import { GuiaInsulfilm } from '../../views/GuiaInsulfilm';

export const metadata: Metadata = {
  title: 'Guia Completo de Insulfilm Residencial 2025 | Tudo Sobre Películas - LUME',
  description: 'Guia definitivo sobre insulfilm residencial: tipos, preços, vantagens e como escolher a melhor película para sua casa. Comparativo técnico completo.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/guia-insulfilm' },
  openGraph: {
    title: 'Guia Completo de Insulfilm Residencial 2025 | LUME',
    description: 'Tipos, preços, vantagens e como escolher a melhor película para sua casa. O guia técnico mais completo sobre insulfilm no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/guia-insulfilm',
    type: 'article',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/hero-bg.webp', width: 1200, height: 630, alt: 'Guia Completo de Insulfilm Residencial LUME' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guia Completo de Insulfilm 2025 | LUME Controle Solar',
    description: 'Tudo sobre insulfilm residencial: tipos, preços e como escolher. Guia técnico completo.',
    images: ['https://lumecontrolesolar.com.br/hero-bg.webp'],
  },
};

export default function Page() {
  return <GuiaInsulfilm />;
}
