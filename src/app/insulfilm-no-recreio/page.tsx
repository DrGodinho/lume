import type { Metadata } from 'next';
import { RecreioPage } from '../../views/RecreioPage';

export const metadata: Metadata = {
  title: 'Insulfilm no Recreio RJ | Residencial e Comercial',
  description: 'Atendimento especializado em insulfilm no Recreio. Máxima rejeição de calor e proteção UV para sua casa ou apartamento. Agende uma visita técnica.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio' },
  openGraph: {
    title: 'Insulfilm no Recreio dos Bandeirantes RJ | LUME Controle Solar',
    description: 'Películas premium no Recreio. Máxima rejeição de calor e proteção UV 99% para sua casa ou apartamento. Agende uma visita técnica gratuita.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/recreio_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm no Recreio dos Bandeirantes RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm no Recreio RJ | LUME Controle Solar',
    description: 'Máxima rejeição de calor e proteção UV no Recreio. Visita técnica gratuita.',
    images: ['https://lumecontrolesolar.com.br/recreio_hero_bg.webp'],
  },
};

export default function Page() {
  return <RecreioPage />;
}
