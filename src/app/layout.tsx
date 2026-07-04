import type { Metadata } from 'next';
import Script from 'next/script';
import type { CSSProperties } from 'react';
import './globals.css';
import { LayoutShell } from './LayoutShell';
import { businessAddressSchema, businessInfo, businessSameAs } from '@/lib/businessInfo';

const fontVariables: CSSProperties = {
  '--font-montserrat': '"Montserrat", "Segoe UI", Arial, sans-serif',
  '--font-open-sans': '"Open Sans", "Segoe UI", Arial, sans-serif',
} as CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL('https://lumecontrolesolar.com.br'),
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
  name: businessInfo.name,
  image: `${businessInfo.siteUrl}/novo-logo-lume.png`,
  '@id': businessInfo.siteUrl,
  url: businessInfo.siteUrl,
  telephone: businessInfo.phoneE164,
  priceRange: '$$',
  address: businessAddressSchema,
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
  areaServed: [
    { '@type': 'City', name: 'Rio de Janeiro' },
    { '@type': 'AdministrativeArea', name: 'Bangu' },
    { '@type': 'AdministrativeArea', name: 'Barra da Tijuca' },
    { '@type': 'AdministrativeArea', name: 'Recreio dos Bandeirantes' },
    { '@type': 'AdministrativeArea', name: 'Campo Grande' },
    { '@type': 'AdministrativeArea', name: 'Jacarepaguá' }
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: businessInfo.phoneE164,
    contactType: 'sales',
    areaServed: 'BR',
    availableLanguage: 'Portuguese'
  },
  sameAs: businessSameAs,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Catalogo de servicos de insulfilm premium',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Offer',
          url: `${businessInfo.siteUrl}/nano-ceramica`,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            name: 'Instalacao de insulfilm nano ceramica',
            description: 'Servico profissional de instalacao de insulfilm nano ceramica para alta reducao de calor e protecao UV.',
            provider: {
              '@type': 'LocalBusiness',
              name: businessInfo.name,
              telephone: businessInfo.phoneE164,
              address: businessAddressSchema,
            },
            areaServed: { '@type': 'City', name: 'Rio de Janeiro' },
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Offer',
          url: `${businessInfo.siteUrl}/carbono`,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            name: 'Instalacao de insulfilm carbono',
            description: 'Servico profissional de instalacao de insulfilm carbono para privacidade, estetica premium e durabilidade.',
            provider: {
              '@type': 'LocalBusiness',
              name: businessInfo.name,
              telephone: businessInfo.phoneE164,
              address: businessAddressSchema,
            },
            areaServed: { '@type': 'City', name: 'Rio de Janeiro' },
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Offer',
          url: `${businessInfo.siteUrl}/refletiva`,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            name: 'Instalacao de insulfilm refletivo',
            description: 'Servico profissional de instalacao de insulfilm refletivo para privacidade e reducao eficiente de calor.',
            provider: {
              '@type': 'LocalBusiness',
              name: businessInfo.name,
              telephone: businessInfo.phoneE164,
              address: businessAddressSchema,
            },
            areaServed: { '@type': 'City', name: 'Rio de Janeiro' },
          },
        },
      },
    ],
  },
  description:
    'Especialistas em instalação de insulfilm residencial e comercial no Rio de Janeiro. Proteção solar, redução de calor e privacidade com películas de alta tecnologia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={fontVariables}>
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
        <Script 
          id="gtag-init" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments)}
              gtag("js",new Date);
              gtag("config","G-RKVB0YQTJY");
              function gtagSendEvent(e){
                var n=function(){"string"==typeof e&&(window.location=e)};
                return gtag("event","conversion_event_contact",{event_callback:n,event_timeout:2e3}),!1
              }
            `
          }}
        />
      </head>
      <body className="font-sans">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
