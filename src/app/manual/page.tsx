import { generateBreadcrumbSchema, generatePageMetadata, pagesSEO } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for client component
const ManualModePage = dynamic(() => import('@modules/manual/ManualModePage'), {
  ssr: true,
});

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.manual.title,
  description: pagesSEO.manual.description,
  keywords: pagesSEO.manual.keywords,
  path: '/manual',
  ogImage: pagesSEO.manual.ogImage,
});

// Breadcrumb schema for this page
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Manual Mode', url: '/manual' },
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
      <ManualModePage />
    </>
  );
}
