import type { Metadata } from 'next';
import { QuotePage } from '../../views/QuotePage';

export const metadata: Metadata = {
  title: 'Orçamento de Insulfilm Online | Películas Residenciais - LUME',
  description: 'Monte seu orçamento online de insulfilm residencial. Selecione o tipo de película, adicione os vidros e envie pelo WhatsApp. Rápido e sem compromisso.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/orcamento' },
};

export default function Page() {
  return <QuotePage />;
}
