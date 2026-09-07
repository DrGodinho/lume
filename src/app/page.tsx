import type { Metadata } from 'next';
import { Hero } from '../sections/Hero';
import { PriceAdjustmentBanner } from '../components/PriceAdjustmentBanner';
import { Products } from '../sections/Products';
import { Benefits } from '../sections/Benefits';
import { About } from '../sections/About';
import { Coverage } from '../sections/Coverage';
import { SelectionGuide } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';
import { GoogleReviews } from '../components/GoogleReviews';
import { HomeFaq } from '../sections/HomeFaq';
import { homeFaqs } from '../content/homeFaq';

export const metadata: Metadata = {
  title: 'LUME Controle Solar | Insulfilm Residencial e Comercial no Rio de Janeiro',
  description:
    'Insulfilm residencial e comercial no RJ com redução de calor, proteção UV e privacidade 24h com jateado. Bangu, Barra, Recreio e Zona Oeste.',
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
    title: 'LUME Controle Solar | Insulfilm Residencial e Comercial no Rio de Janeiro',
    description: 'Insulfilm residencial de alta performance no Rio, com instalação profissional, garantia de 2 anos e opção de privacidade 24h com jateado.',
    url: 'https://lumecontrolesolar.com.br/',
    siteName: 'LUME Controle Solar',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/hero-bg.webp',
        width: 1344,
        height: 768,
        alt: 'LUME Controle Solar - Insulfilm de Alta Performance no Rio de Janeiro',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUME Controle Solar | Insulfilm Residencial e Comercial no Rio de Janeiro',
    description: 'Insulfilm residencial no RJ para reduzir calor, proteger móveis e ter privacidade 24h com película jateada.',
    images: ['https://lumecontrolesolar.com.br/hero-bg.webp'],
  },
};


const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};


export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <PriceAdjustmentBanner />
      <Benefits />
      <Products />
      <SelectionGuide />
      <About />
      <Coverage />
      <GoogleReviews />
      <HomeFaq />
      <ContactCTA />
    </>
  );
}
