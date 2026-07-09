import type { MetadataRoute } from 'next';
import { blogPosts } from '@/content/blog';
import { getBlogUrl } from '@/lib/blog';

type StaticSitemapRoute = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  lastModified: string;
};

const staticRoutes = [
  { path: '/', priority: 1, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/simulador/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-04-27' },
  { path: '/guia-insulfilm/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-05-03' },
  { path: '/blog/', priority: 0.9, changeFrequency: 'weekly', lastModified: '2026-07-08' },
  { path: '/nano-ceramica/', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/carbono/', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/refletiva/', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/jateado/', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/dupla-camada/', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/insulfilm-em-bangu/', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-05-03' },
  { path: '/insulfilm-em-realengo/', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-05-03' },
  { path: '/insulfilm-em-campo-grande/', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-05-03' },
  { path: '/insulfilm-em-jacarepagua/', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-05-03' },
  { path: '/insulfilm-na-barra-da-tijuca/', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-05-03' },
  { path: '/insulfilm-no-recreio/', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-05-03' },
  { path: '/insulfilm-em-sulacap/', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-06-25' },
  { path: '/insulfilm-na-cozinha/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/insulfilm-no-banheiro/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-05-05' },
  { path: '/insulfilm-no-quarto/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-05-05' },
  { path: '/insulfilm-na-sala/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/insulfilm-no-escritorio/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-06-25' },
  { path: '/orcamento/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-05-01' },
  { path: '/calculadora-economia-energia-insulfilm/', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-05-26' },
  { path: '/insulfilm-para-portas-de-vidro/', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-06-16' },
] satisfies StaticSitemapRoute[];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `https://lumecontrolesolar.com.br${route.path}`,
      lastModified: new Date(`${route.lastModified}T12:00:00.000Z`),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...blogPosts.map((post) => ({
      url: getBlogUrl(post.slug),
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: post.featured ? 0.85 : 0.75,
    })),
  ];
}
