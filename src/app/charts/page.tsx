import { generateBreadcrumbSchema, generatePageMetadata, pagesSEO } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for client component
const ChartsPage = dynamic(() => import('@modules/charts/ChartsPage'), {
  ssr: true,
});

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.charts.title,
  description: pagesSEO.charts.description,
  keywords: pagesSEO.charts.keywords,
  path: '/charts',
});

// Breadcrumb schema for this page
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Global Charts', url: '/charts' },
]);

export default function Page() {
  return (
    <>
      {/* Structured data for this page */}
      <script
        key="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ChartsPage />
    </>
  );
}
