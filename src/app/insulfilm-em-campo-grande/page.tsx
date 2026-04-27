import type { Metadata } from 'next';
import { CampoGrandePage } from '../../views/CampoGrandePage';

export const metadata: Metadata = {
  title: 'Insulfilm em Campo Grande RJ | Películas de Alta Performance - LUME',
  description: 'Instalação de insulfilm residencial e comercial em Campo Grande, Rio de Janeiro. Proteção contra calor e privacidade total. Atendimento local e garantia.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande' },
  openGraph: {
    title: 'Insulfilm em Campo Grande RJ | LUME Controle Solar',
    description: 'Especialistas em insulfilm em Campo Grande. Proteção contra o calor carioca com garantia de 5 anos. Orçamento grátis no local.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/campogrande_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Campo Grande RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Campo Grande RJ | LUME Controle Solar',
    description: 'Proteção contra calor e privacidade total em Campo Grande. Garantia de 5 anos. Orçamento grátis.',
    images: ['https://lumecontrolesolar.com.br/campogrande_hero_bg.webp'],
  },
};

export default function Page() {
  return <CampoGrandePage />;
}
