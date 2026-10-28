import { generatePageMetadata, pagesSEO } from '@/lib/seo';
import HomePage from '@/modules/home/HomePage';
import { SEOContent } from '@/modules/home/components/SEOContent';

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
      <HomePage />
      <SEOContent />
    </>
  );
}
