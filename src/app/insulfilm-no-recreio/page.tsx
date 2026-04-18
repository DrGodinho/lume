import type { Metadata } from 'next';
import { RecreioPage } from '../../views/RecreioPage';

export const metadata: Metadata = {
  title: 'Insulfilm no Recreio dos Bandeirantes RJ | Películas Premium - LUME',
  description: 'Atendimento especializado em insulfilm no Recreio. Máxima rejeição de calor e proteção UV para sua casa ou apartamento. Agende uma visita técnica.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-no-recreio' },
};

export default function Page() {
  return <RecreioPage />;
}
