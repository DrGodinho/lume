import type { Metadata } from 'next';
import { JacarepaguaPage } from '../../views/JacarepaguaPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Jacarepaguá RJ | Residencial e Comercial - LUME',
  description: 'Especialistas em películas de controle solar em Jacarepaguá e região. Redução de até 80% do calor e 99% de proteção UV. Orçamento rápido via WhatsApp.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua' },
};

export default function Page() {
  return <JacarepaguaPage />;
}
