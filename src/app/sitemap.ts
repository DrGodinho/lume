import type { MetadataRoute } from 'next';
import { getBlogUrl, getPublishedPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

const staticRoutes = [
  { path: '/', priority: 1, changeFrequency: 'monthly' as const },
  { path: '/simulador/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/guia-insulfilm/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/blog/', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nano-ceramica/', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/carbono/', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/refletiva/', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/jateado/', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/dupla-camada/', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/insulfilm-em-bangu/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/insulfilm-em-realengo/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/insulfilm-em-campo-grande/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/insulfilm-em-jacarepagua/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/insulfilm-na-barra-da-tijuca/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/insulfilm-no-recreio/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/insulfilm-na-cozinha/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/insulfilm-no-banheiro/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/insulfilm-no-quarto/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/insulfilm-na-sala/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/insulfilm-no-escritorio/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/orcamento/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/calculadora-economia-energia-insulfilm/', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/insulfilm-para-portas-de-vidro/', priority: 0.8, changeFrequency: 'monthly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPublishedPosts();

  return [
    ...staticRoutes.map((route) => ({
      url: `https://lumecontrolesolar.com.br${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: getBlogUrl(post.slug),
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: post.featured ? 0.85 : 0.75,
    })),
  ];
}
