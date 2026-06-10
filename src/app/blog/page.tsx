import type { Metadata } from 'next';
import { BlogIndex } from '@/views/BlogIndex';
import { getPublishedPosts } from '@/lib/blog';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog sobre Insulfilm, Controle Solar e Conforto Termico',
  description:
    'Artigos da LUME Controle Solar sobre insulfilm residencial, reducao de calor, privacidade, protecao UV e peliculas para vidros no Rio de Janeiro.',
  alternates: {
    canonical: 'https://lumecontrolesolar.com.br/blog/',
  },
  openGraph: {
    title: 'Blog LUME Controle Solar',
    description:
      'Guias e respostas praticas sobre insulfilm, conforto termico, privacidade e peliculas para vidros.',
    url: 'https://lumecontrolesolar.com.br/blog/',
    siteName: 'LUME Controle Solar',
    type: 'website',
    images: [
      {
        url: 'https://lumecontrolesolar.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog LUME Controle Solar',
      },
    ],
  },
};

export default async function Page() {
  const posts = await getPublishedPosts();

  return <BlogIndex posts={posts} />;
}
