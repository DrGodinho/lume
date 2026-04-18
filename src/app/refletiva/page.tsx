import type { Metadata } from 'next';
import { RefletivaPage } from '../../views/Refletiva';

export const metadata: Metadata = {
  title: 'Película Refletiva Espelhada | Privacidade Total - LUME',
  description: 'Película refletiva espelhada com rejeição brutal de calor e privacidade total durante o dia. Efeito espelhado elegante. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/refletiva' },
};

export default function Page() {
  return <RefletivaPage />;
}
