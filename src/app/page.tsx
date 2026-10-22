import { generatePageMetadata, pagesSEO } from '@/lib/seo';
import { SEOContent } from '@/modules/home/components/SEOContent';
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
    <>
      <Suspense
        fallback={
          <section className="flex min-h-screen items-center justify-center px-4 py-8 text-center md:py-12">
            <div className="max-w-lg space-y-3">
              <h1 className="font-heading text-on-surface text-xl font-bold md:text-2xl">FLAMES Calculator</h1>
              <p className="text-on-surface-variant text-sm leading-7">
                Enter two names when the calculator is ready. The interactive game needs JavaScript; you can also follow
                the rules below to play on paper.
              </p>
            </div>
          </section>
        }
      >
        <HomePage />
      </Suspense>
      <SEOContent />
    </>
  );
}
