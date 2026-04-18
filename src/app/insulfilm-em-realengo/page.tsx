import type { Metadata } from 'next';
import { RealengoPage } from '../../views/RealengoPage';

export const metadata: Metadata = {
  title: 'Insulfilm em Realengo RJ | Instalação Profissional - LUME',
  description: 'Procurando insulfilm em Realengo? A LUME oferece as melhores películas de controle solar com garantia de 5 anos. Reduza o calor e economize energia hoje!',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/insulfilm-em-realengo' },
};

export default function Page() {
  return <RealengoPage />;
}
