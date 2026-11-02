'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  buildBreadcrumbSchema,
  type BreadcrumbItem as SchemaBreadcrumbItem,
} from '@/lib/schema/breadcrumbs';

interface BreadcrumbItemProps {
  label: string;
  href?: string;
}

interface NavigationBreadcrumbsProps {
  items: BreadcrumbItemProps[];
  showVisualTrail?: boolean;
  disableJsonLd?: boolean;
}

export function NavigationBreadcrumbs({
  items,
  showVisualTrail = true,
  disableJsonLd = false,
}: NavigationBreadcrumbsProps) {
  const pathname = usePathname();

  // Constrói os itens canônicos garantindo que todos os nós possuam propriedade `item` válida
  const schemaItems: SchemaBreadcrumbItem[] = items.map((item, index) => {
    let resolvedUrl = item.href;
    if (!resolvedUrl && index === items.length - 1) {
      resolvedUrl = pathname ? (pathname.endsWith('/') ? pathname : `${pathname}/`) : '/';
    }
    return {
      name: item.label,
      url: resolvedUrl,
    };
  });

  const jsonLd = buildBreadcrumbSchema(schemaItems);

  return (
    <>
      {!disableJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {showVisualTrail && (
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-gray-400">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === items.length - 1 || !item.href ? (
                    <BreadcrumbPage className="text-gray-300 font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <a
                        href={item.href + (item.href === '/' || item.href.includes('#') ? '' : '/')}
                        className="text-gray-500 hover:text-[#c9a227] transition-colors"
                      >
                        {item.label}
                      </a>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && (
                  <BreadcrumbSeparator className="text-gray-600" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  );
}
