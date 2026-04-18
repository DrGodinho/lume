import type { Metadata } from 'next';
import { BanguPage } from '../../views/BanguPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Bangu RJ | Residencial e Comercial - LUME',
  description: 'Aplicação profissional de insulfilm em Bangu, Rio de Janeiro. Redução de calor, privacidade e proteção UV com garantia de 5 anos. Orçamento grátis no local.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-bangu' },
  openGraph: {
    title: 'Insulfilm em Bangu RJ | Residencial e Comercial - LUME',
    description: 'Aplicação profissional de insulfilm em Bangu, Rio de Janeiro. Redução de calor, privacidade e proteção UV com garantia de 5 anos.',
    url: 'https://lumecontrolesolar.com.br/insulfilm-em-bangu',
    type: 'website',
  }
};

export default function Page() {
  return <BanguPage />;
}
