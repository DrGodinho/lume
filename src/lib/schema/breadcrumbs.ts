export type BreadcrumbItem = {
  name: string;
  url?: string;
  item?: string | { '@type': 'WebPage'; '@id': string };
};

export type BreadcrumbListSchema = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string | { '@type': 'WebPage'; '@id': string };
  }>;
};

const SITE_URL = 'https://lumecontrolesolar.com.br';

/**
 * Normaliza e valida a propriedade `item` de um BreadcrumbItem para conformidade
 * estrita com o Google Search Console e Schema.org:
 * - Se a URL for vazia/omitida em um nó intermediário (parent_node), formata como WebPage com @id válido.
 * - Se a URL contiver hash/âncora (#produtos, #onde-atendemos), formata como WebPage com @id absoluto.
 * - Para páginas reais, garante URL absoluta com barra final (canonical).
 */
export function normalizeBreadcrumbItem(
  rawUrl?: string
): string | { '@type': 'WebPage'; '@id': string } {
  if (!rawUrl || rawUrl.trim() === '') {
    return {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/`,
    };
  }

  const trimmed = rawUrl.trim();

  // Tratamento de nós pai com âncora/seção (#produtos, #onde-atendemos, etc.)
  if (trimmed.includes('#')) {
    const fullId = trimmed.startsWith('http')
      ? trimmed
      : `${SITE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
    return {
      '@type': 'WebPage',
      '@id': fullId,
    };
  }

  // Garante URL absoluta
  let fullUrl = trimmed.startsWith('http')
    ? trimmed
    : `${SITE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;

  // Normaliza barra final para rotas de páginas (exceto raiz sem barra e arquivos/queries)
  if (fullUrl !== `${SITE_URL}/` && !fullUrl.endsWith('/') && !fullUrl.includes('?') && !fullUrl.includes('.')) {
    fullUrl = `${fullUrl}/`;
  }

  return fullUrl;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const resolvedItem = item.item ?? normalizeBreadcrumbItem(item.url);
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: resolvedItem,
      };
    }),
  };
}
