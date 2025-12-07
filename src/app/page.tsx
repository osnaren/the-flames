import { generatePageMetadata, pagesSEO, siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for client component
const HomePage = dynamic(() => import('@modules/home/HomePage'), {
  ssr: true,
});

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.home.title,
  description: pagesSEO.home.description,
  keywords: pagesSEO.home.keywords,
  path: '',
  ogImage: `${siteConfig.url}/og-image.png`,
});

export default function Page() {
  return <HomePage />;
}
