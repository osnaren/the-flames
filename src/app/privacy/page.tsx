import { generateBreadcrumbSchema, generatePageMetadata, pagesSEO } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for client component
const PrivacyPage = dynamic(() => import('@modules/privacy/PrivacyPage'), {
  ssr: true,
});

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.privacy.title,
  description: pagesSEO.privacy.description,
  keywords: pagesSEO.privacy.keywords,
  path: '/privacy',
});

// Breadcrumb schema for this page
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Privacy Policy', url: '/privacy' },
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
      <PrivacyPage />
    </>
  );
}
