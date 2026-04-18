import type { Metadata } from 'next';
import { NanoCeramicaPage } from '../../views/NanoCeramica';

export const metadata: Metadata = {
  title: 'Película Nano Cerâmica | Rejeição de 97% do Calor IR - LUME',
  description: 'Película Nano Cerâmica com rejeição de até 97% do calor infravermelho. Transparência máxima, bloqueio UV 99% e garantia de 5 anos. Orçamento grátis pelo WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/nano-ceramica' },
};

export default function Page() {
  return <NanoCeramicaPage />;
}
