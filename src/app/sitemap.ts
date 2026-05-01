import { MetadataRoute } from 'next';
import { neighborhoods } from '@/data/neighborhoods';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lumecontrolesolar.com.br';

  // 1. Páginas Principais
  const staticPages = [
    '',
    '/simulador',
    '/guia-insulfilm',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Páginas de Produtos
  const productPages = [
    '/nano-ceramica',
    '/carbono',
    '/refletiva',
    '/jateado',
    '/dupla-camada',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // 3. Páginas de Bairros (Geradas dinamicamente dos dados)
  const neighborhoodPages = Object.values(neighborhoods).map((data) => ({
    url: `${baseUrl}/${data.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...neighborhoodPages];
}
