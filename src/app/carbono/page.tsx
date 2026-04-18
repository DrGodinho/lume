import type { Metadata } from 'next';
import { CarbonoPage } from '../../views/Carbono';

export const metadata: Metadata = {
  title: 'Película de Carbono Premium | Privacidade e Redução de Calor - LUME',
  description: 'Película de Carbono Premium com visual grafite sofisticado, rejeição térmica de até 80% e estabilidade de cor garantida. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/carbono' },
};

export default function Page() {
  return <CarbonoPage />;
}
