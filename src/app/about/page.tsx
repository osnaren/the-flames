import { generateBreadcrumbSchema, generatePageMetadata, generateWebPageSchema, pagesSEO } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for client component
const AboutPage = dynamic(() => import('@modules/about/AboutPage'), {
  ssr: true,
});

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.about.title,
  description: pagesSEO.about.description,
  keywords: pagesSEO.about.keywords,
  path: '/about',
  ogImage: pagesSEO.about.ogImage,
});

// Breadcrumb schema for this page
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
]);

// Article schema for the about page content
const articleSchema = {
  ...generateWebPageSchema({
    title: pagesSEO.about.title,
    description: pagesSEO.about.description,
    url: '/about',
  }),
  '@type': 'AboutPage',
};

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
        key="json-ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <AboutPage />
    </>
  );
}
