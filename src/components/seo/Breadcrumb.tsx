'use client';

import { generateBreadcrumbSchema, siteConfig } from '@/lib/seo';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

// Map of path segments to readable names
const pathNameMap: Record<string, string> = {
  '': 'Home',
  about: 'About',
  'how-it-works': 'How It Works',
  charts: 'Global Charts',
  manual: 'Manual Mode',
  'api-docs': 'API Documentation',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
};

/**
 * SEO-friendly Breadcrumb Component
 * Generates both visual breadcrumbs and JSON-LD structured data
 */
export function Breadcrumb({ items, showHome = true, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from current path if items not provided
  const breadcrumbItems = useMemo(() => {
    if (items) return items;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({ name: 'Home', url: '/' });
    }

    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const name = pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, url: currentPath });
    }

    return breadcrumbs;
  }, [items, pathname, showHome]);

  // Don't render on home page
  if (pathname === '/' && !items) {
    return null;
  }

  // Generate schema for SEO
  const schema = generateBreadcrumbSchema(
    breadcrumbItems.map((item) => ({
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    }))
  );

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={`mb-4 flex items-center text-sm ${className}`}>
        <ol className="flex flex-wrap items-center gap-1.5" itemScope itemType="https://schema.org/BreadcrumbList">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isHome = item.url === '/';

            return (
              <li
                key={item.url}
                className="flex items-center gap-1.5"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />}

                {isLast ? (
                  <span className="text-gray-600 dark:text-gray-300" itemProp="name" aria-current="page">
                    {isHome ? <Home className="h-4 w-4" aria-label="Home" /> : item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-500 transition-colors hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                    itemProp="item"
                  >
                    <span itemProp="name">{isHome ? <Home className="h-4 w-4" aria-label="Home" /> : item.name}</span>
                  </Link>
                )}

                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumb;
