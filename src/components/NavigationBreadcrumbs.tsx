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

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavigationBreadcrumbsProps {
  items: BreadcrumbItem[];
  showVisualTrail?: boolean;
}

export function NavigationBreadcrumbs({
  items,
  showVisualTrail = true,
}: NavigationBreadcrumbsProps) {
  const pathname = usePathname();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
      .map((item, index) => {
        const href = item.href ?? (index === items.length - 1 ? pathname : undefined);
        if (!href) return null;
        return {
          "@type": "ListItem",
          "position": index + 1,
          "name": item.label,
          "item": `https://lumecontrolesolar.com.br${href}`
        };
      })
      .filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                        href={item.href + (item.href === '/' ? '' : '/')} 
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
