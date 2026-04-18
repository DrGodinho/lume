import type { Metadata } from 'next';
import { CampoGrandePage } from '../../views/CampoGrandePage';

export const metadata: Metadata = {
  title: 'Insulfilm em Campo Grande RJ | Películas de Alta Performance - LUME',
  description: 'Instalação de insulfilm residencial e comercial em Campo Grande, Rio de Janeiro. Proteção contra calor e privacidade total. Atendimento local e garantia.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-campo-grande' },
};

export default function Page() {
  return <CampoGrandePage />;
}
