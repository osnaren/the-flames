import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generatePageMetadata,
  pagesSEO,
  siteConfig,
} from '@/lib/seo';
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
});

// Breadcrumb schema for this page
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
]);

// Article schema for the about page content
const articleSchema = generateArticleSchema({
  title: pagesSEO.about.title,
  description: pagesSEO.about.description,
  url: `${siteConfig.url}/about`,
  datePublished: '2024-01-01',
});

export default function Page() {
  return (
    <>
      {/* Structured data for this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <AboutPage />
    </>
  );
}
