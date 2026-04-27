import type { Metadata } from 'next';
import { JacarepaguaPage } from '../../views/JacarepaguaPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Jacarepaguá RJ | Residencial e Comercial - LUME',
  description: 'Especialistas em películas de controle solar em Jacarepaguá e região. Redução de até 80% do calor e 99% de proteção UV. Orçamento rápido via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua' },
  openGraph: {
    title: 'Insulfilm em Jacarepaguá RJ | LUME Controle Solar',
    description: 'Películas de controle solar em Jacarepaguá. Redução de até 80% do calor e proteção UV 99%. Orçamento rápido e garantia de 5 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp', width: 1200, height: 630, alt: 'Insulfilm em Jacarepaguá RJ - LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulfilm em Jacarepaguá RJ | LUME Controle Solar',
    description: 'Redução de até 80% do calor em Jacarepaguá. Proteção UV 99% e garantia de 5 anos.',
    images: ['https://lumecontrolesolar.com.br/jacarepagua_hero_bg.webp'],
  },
};

export default function Page() {
  return <JacarepaguaPage />;
}
