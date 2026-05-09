import type { Metadata } from 'next';
import { Hero } from '../sections/Hero';
import { Products } from '../sections/Products';
import { Benefits } from '../sections/Benefits';
import { About } from '../sections/About';
import { Coverage } from '../sections/Coverage';
import { SelectionGuide } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';
import { GoogleReviews } from '../components/GoogleReviews';

export const metadata: Metadata = {
  title: 'LUME Controle Solar | Insulfilm Residencial e Comercial no Rio de Janeiro',
  description:
    'Especialista em insulfilm de alta performance no RJ. Redução de calor (até 97%), privacidade 24h e proteção UV. Atendimento em Bangu, Barra, Recreio e Zona Oeste.',
  keywords: [
    'insulfilm residencial rj',
    'insulfilm comercial rj',
    'insulfilm bangu',
    'insulfilm barra da tijuca',
    'redução de calor vidros',
    'película de controle solar',
    'insulfilm nano cerâmica',
    'insulfilm carbono',
    'privacidade residencial'
  ],
  alternates: {
    canonical: 'https://lumecontrolesolar.com.br/',
  },
  openGraph: {
    title: 'LUME Controle Solar | Insulfilm de Elite no RJ',
    description: 'Películas residenciais de alta performance com instalação express em 24h no Rio de Janeiro.',
    url: 'https://lumecontrolesolar.com.br/',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LUME Controle Solar - Insulfilm de Alta Performance',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUME Controle Solar | Insulfilm de Elite no RJ',
    description: 'Películas residenciais de alta performance com redução de calor de até 97% e proteção UV.',
    images: ['https://lumecontrolesolar.com.br/og-image.jpg'],
  },
};


export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <Products />
      <SelectionGuide />
      <About />
      <Coverage />
      <GoogleReviews />
      <ContactCTA />
    </>
  );
}
