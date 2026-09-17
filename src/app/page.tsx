import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Hero } from '../sections/Hero';
import { PriceAdjustmentBanner } from '../components/PriceAdjustmentBanner';
import { homeFaqs } from '../content/homeFaq';

const Benefits = dynamic(
  () => import('../sections/Benefits').then((mod) => mod.Benefits),
  { loading: () => <div className="min-h-[300px]" /> }
);
const Products = dynamic(
  () => import('../sections/Products').then((mod) => mod.Products),
  { loading: () => <div className="min-h-[400px]" /> }
);
const About = dynamic(
  () => import('../sections/About').then((mod) => mod.About),
  { loading: () => <div className="min-h-[300px]" /> }
);
const SelectionGuide = dynamic(
  () => import('../sections/SelectionGuide').then((mod) => mod.SelectionGuide),
  { loading: () => <div className="min-h-[300px]" /> }
);
const Coverage = dynamic(
  () => import('../sections/Coverage').then((mod) => mod.Coverage),
  { loading: () => <div className="min-h-[300px]" /> }
);
const GoogleReviews = dynamic(
  () => import('../components/GoogleReviews').then((mod) => mod.GoogleReviews),
  { loading: () => <div className="min-h-[300px]" /> }
);
const HomeFaq = dynamic(
  () => import('../sections/HomeFaq').then((mod) => mod.HomeFaq),
  { loading: () => <div className="min-h-[300px]" /> }
);
const ContactCTA = dynamic(
  () => import('../sections/ContactCTA').then((mod) => mod.ContactCTA),
  { loading: () => <div className="min-h-[200px]" /> }
);

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
