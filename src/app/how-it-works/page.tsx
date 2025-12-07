import { generateBreadcrumbSchema, generateHowToSchema, generatePageMetadata, pagesSEO } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for client component
const HowItWorksPage = dynamic(() => import('@modules/how-it-works/HowItWorksPage'), {
  ssr: true,
});

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.howItWorks.title,
  description: pagesSEO.howItWorks.description,
  keywords: pagesSEO.howItWorks.keywords,
  path: '/how-it-works',
});

// Breadcrumb schema for this page
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'How It Works', url: '/how-it-works' },
]);

// HowTo schema for instructional content
const howToSchema = generateHowToSchema();

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
          __html: JSON.stringify(howToSchema),
        }}
      />
      <HowItWorksPage />
    </>
  );
}
