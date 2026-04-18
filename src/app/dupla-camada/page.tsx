import type { Metadata } from 'next';
import { DuplaCamadaPage } from '../../views/DuplaCamada';

export const metadata: Metadata = {
  title: 'Película Dupla Camada G5 | Máxima Rejeição de Calor - LUME',
  description: 'Película Dupla Camada com camada refletiva externa e fumê interna. Máxima rejeição de calor sem reflexo interno noturno. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/dupla-camada' },
};

export default function Page() {
  return <DuplaCamadaPage />;
}
