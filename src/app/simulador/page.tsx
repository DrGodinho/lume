import type { Metadata } from 'next';
import { SimulatorWrapper } from './SimulatorWrapper';

export const metadata: Metadata = {
  title: 'Simulador de Películas | Descubra a Película Ideal - LUME',
  description: 'Simulador inteligente de películas residenciais. Responda algumas perguntas e descubra qual insulfilm é o ideal para sua casa em poucos segundos.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/simulador' },
  openGraph: {
    title: 'Simulador de Películas | Descubra a Película Ideal - LUME',
    description: 'Responda 3 perguntas e descubra qual insulfilm é o ideal para sua casa. Simulador inteligente e gratuito da LUME Controle Solar.',
    url: 'https://lumecontrolesolar.com.br/simulador',
    type: 'website',
    siteName: 'LUME Controle Solar',
    images: [{ url: 'https://lumecontrolesolar.com.br/novo-logo-lume.png', width: 1200, height: 630, alt: 'Simulador de Películas LUME Controle Solar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulador de Películas | LUME Controle Solar',
    description: 'Descubra qual insulfilm é ideal para sua casa em poucos segundos. Totalmente grátis.',
    images: ['https://lumecontrolesolar.com.br/novo-logo-lume.png'],
  },
};

export default function Page() {
  return <SimulatorWrapper />;
}
