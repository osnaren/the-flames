import {
  CONTENT_PUBLISHED,
  CONTENT_UPDATED,
  faqPageSchema,
  generatePageMetadata,
  HOME_FAQ,
  howToSchema,
  pagesSEO,
  siteConfig,
} from '@/lib/seo';
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

const pageUrl = `${siteConfig.url}/`;

const homeSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pagesSEO.home.title,
    description: pagesSEO.home.description,
    inLanguage: siteConfig.language,
    datePublished: CONTENT_PUBLISHED,
    dateModified: CONTENT_UPDATED,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@type': 'Thing', name: 'FLAMES (game)', sameAs: 'https://en.wikipedia.org/wiki/FLAMES_(game)' },
    mainEntity: { '@id': `${siteConfig.url}/#application` },
    primaryImageOfPage: { '@type': 'ImageObject', url: siteConfig.ogImage, width: 1200, height: 630 },
    publisher: { '@type': 'Organization', name: siteConfig.publisher, url: siteConfig.author.url },
  },
  faqPageSchema(HOME_FAQ, pageUrl),
  howToSchema(pageUrl),
];

export default function Page() {
  return (
    <>
      <HomePage />
      <SEOContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchemas) }} />
    </>
  );
}
