import type { Metadata } from 'next';
import Script from 'next/script';
import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';
import { LayoutShell } from './LayoutShell';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: {
    default: 'LUME Controle Solar | Películas de Alta Tecnologia',
    template: '%s | LUME Controle Solar',
  },
  description:
    'LUME Controle Solar - Especialistas em películas de alta performance (insulfilm) no Rio de Janeiro. Proteção térmica, privacidade e segurança para residências e empresas.',
  keywords: [
    'insulfilm rj',
    'película solar rio de janeiro',
    'controle solar rio de janeiro',
    'proteção uv vidros',
    'insulfilm residencial',
  ],
  authors: [{ name: 'LUME Controle Solar' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'LUME Controle Solar | Películas de Alta Performance',
    description:
      'Proteção solar, redução de calor e privacidade com tecnologia de ponta no Rio de Janeiro.',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/novo-logo-lume.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUME Controle Solar | Alta Performance em Películas',
    description:
      'Conforto térmico e proteção UV para sua casa ou empresa no Rio de Janeiro.',
    images: ['https://lumecontrolesolar.com.br/novo-logo-lume.png'],
  },
  icons: {
    icon: '/novo-logo-lume.png',
  },
  other: {
    'theme-color': '#04080f',
  },
  verification: {
    google: 'bM8DzS0HSsJUn4oRwX06OABRj0xJhHaWqyI1hay70Yw',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'LUME Controle Solar',
  image: 'https://lumecontrolesolar.com.br/novo-logo-lume.png',
  '@id': 'https://lumecontrolesolar.com.br',
  url: 'https://lumecontrolesolar.com.br',
  telephone: '+5521965140612',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'estrada do realengo 973',
    addressLocality: 'Rio de Janeiro',
    addressRegion: 'RJ',
    postalCode: '21715-331',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -22.8767,
    longitude: -43.4651,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '20:00',
  },
  areaServed: ['Bangu', 'Campo Grande', 'Realengo', 'Barra da Tijuca', 'Recreio', 'Jacarepaguá', 'Zona Oeste RJ'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Insulfilm',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Insulfilm Nano Cerâmica', description: 'Alta redução de calor e proteção UV extrema.' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Insulfilm de Carbono', description: 'Estética premium e durabilidade superior.' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Insulfilm Refletivo', description: 'Privacidade total e redução de calor eficiente.' },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '52',
  },
  description:
    'Especialistas em instalação de insulfilm residencial e comercial no Rio de Janeiro. Proteção solar, redução de calor e privacidade com películas de alta tecnologia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RKVB0YQTJY"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments)}
            gtag("js",new Date);
            gtag("config","G-RKVB0YQTJY");
            function gtagSendEvent(e){
              var n=function(){"string"==typeof e&&(window.location=e)};
              return gtag("event","conversion_event_contact",{event_callback:n,event_timeout:2e3}),!1
            }
          `}
        </Script>
      </head>
      <body className={`${montserrat.variable} ${openSans.variable} font-sans`}>
        <LayoutShell>{children}</LayoutShell>

      </body>
    </html>
  );
}
