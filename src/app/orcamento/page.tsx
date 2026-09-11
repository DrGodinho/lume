import type { Metadata } from 'next';
import { QuotePage } from '../../views/QuotePage';
import { buildBreadcrumbSchema } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Orçamento de Insulfilm Online | LUME Controle Solar',
  description: 'Monte seu orçamento online de insulfilm residencial. Selecione o tipo de película, adicione os vidros e envie pelo WhatsApp. Rápido e sem compromisso.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/orcamento/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    buildBreadcrumbSchema([
      { name: 'Início', url: 'https://lumecontrolesolar.com.br/' },
      { name: 'Orçamento Online', url: 'https://lumecontrolesolar.com.br/orcamento/' },
    ]),
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuotePage />
    </>
  );
}
