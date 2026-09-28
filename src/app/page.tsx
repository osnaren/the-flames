import { generatePageMetadata, pagesSEO } from '@/lib/seo';
import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';

const HomePage = dynamicImport(() => import('@modules/home/HomePage'));

// Keep the landing page on Netlify's CDN instead of invoking a function per visit.
// Personalized share previews are served from /share.
export const dynamic = 'force-static';

export const metadata = generatePageMetadata({
  title: pagesSEO.home.title,
  description: pagesSEO.home.description,
  keywords: pagesSEO.home.keywords,
  path: '/',
  ogImage: pagesSEO.home.ogImage,
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomePage />
    </Suspense>
  );
}
