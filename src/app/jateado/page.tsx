import type { Metadata } from 'next';
import { JateadoPage } from '../../views/Jateado';

export const metadata: Metadata = {
  title: 'Película Jateada Fosca | Privacidade Decorativa - LUME',
  description: 'Película jateada fosca para privacidade total em banheiros e divisórias. Efeito vidro jateado com custo acessível. Orçamento grátis via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/jateado' },
};

export default function Page() {
  return <JateadoPage />;
}
