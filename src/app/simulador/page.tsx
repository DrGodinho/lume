import type { Metadata } from 'next';
import { SimulatorPage } from '../../views/Simulator';

export const metadata: Metadata = {
  title: 'Simulador de Películas | Descubra a Película Ideal - LUME',
  description: 'Simulador inteligente de películas residenciais. Responda algumas perguntas e descubra qual insulfilm é o ideal para sua casa em poucos segundos.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/simulador' },
};

export default function Page() {
  return <SimulatorPage />;
}
