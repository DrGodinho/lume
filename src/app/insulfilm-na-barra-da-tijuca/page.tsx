import type { Metadata } from 'next';
import { BarraPage } from '../../views/BarraPage';

export const metadata: Metadata = {
  title: 'Insulfilm na Barra da Tijuca RJ | Residencial e Comercial - LUME',
  description: 'Instalação de insulfilm de alta performance na Barra da Tijuca. Películas nano cerâmica, carbono e espelhadas para o seu conforto. Orçamento gratuito.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-na-barra-da-tijuca' },
};

export default function Page() {
  return <BarraPage />;
}
