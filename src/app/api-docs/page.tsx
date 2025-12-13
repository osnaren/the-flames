import { generateAPISchema, generateBreadcrumbSchema, generatePageMetadata, pagesSEO } from '@/lib/seo';
import { ApiDocsPage } from '@modules/api-docs/ApiDocsPage';
import type { Metadata } from 'next';

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.apiDocs.title,
  description: pagesSEO.apiDocs.description,
  keywords: pagesSEO.apiDocs.keywords,
  path: '/api-docs',
  ogImage: pagesSEO.apiDocs.ogImage,
});

// Breadcrumb schema for this page
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'API Documentation', url: '/api-docs' },
]);

// API schema for developer documentation
const apiSchema = generateAPISchema();

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
      <script
        key="json-ld-api"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(apiSchema),
        }}
      />
      <ApiDocsPage />
    </>
  );
}
