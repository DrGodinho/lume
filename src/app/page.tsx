import type { Metadata } from 'next';
import { Hero } from '../sections/Hero';
import { Products } from '../sections/Products';
import { Benefits } from '../sections/Benefits';
import { About } from '../sections/About';
import { Coverage } from '../sections/Coverage';
import { ContactCTA } from '../sections/ContactCTA';
import { GoogleReviews } from '../components/GoogleReviews';

export const metadata: Metadata = {
  title: 'LUME Controle Solar | Insulfilm Residencial Comercial RJ',
  description: 'Instalação de insulfilm de alta performance no Rio de Janeiro. Redução de calor, privacidade e 5 anos de garantia. Peça seu orçamento pelo WhatsApp!',
  alternates: {
    canonical: 'https://lumecontrolesolar.com.br/',
  },
  openGraph: {
    title: 'LUME Controle Solar | Insulfilm de Elite no RJ',
    description: 'Películas residenciais de alta performance com instalação express em 24h.',
    url: 'https://lumecontrolesolar.com.br/',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <Benefits />
      <About />
      <Coverage />
      <GoogleReviews />
      <ContactCTA />
    </>
  );
}
