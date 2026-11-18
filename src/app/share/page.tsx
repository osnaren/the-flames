import { OG_VALIDATION, truncateText, validateResult } from '@/lib/og';
import {
  generatePageMetadata,
  generateResultMetadata,
  generateResultOGImageUrl,
  pagesSEO,
  siteConfig,
} from '@/lib/seo';
import { calculateFlamesResult, nameSchema } from '@/modules/home/utils';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import for client component
const HomePage = dynamic(() => import('@modules/home/HomePage'), {
  ssr: true,
});

// Props interface for the page
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate dynamic metadata based on URL search params
 * If name1 and name2 are present, generate result-specific metadata with custom OG image
 * Otherwise, use default home page metadata
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  // Personal result URLs are social previews, not independent search pages.
  const searchMetadata: Metadata = {
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteConfig.url}/` },
  };
  const params = await searchParams;
  const first = nameSchema.safeParse(typeof params.name1 === 'string' ? params.name1.trim() : undefined);
  const second = nameSchema.safeParse(typeof params.name2 === 'string' ? params.name2.trim() : undefined);
  const result = typeof params.result === 'string' ? params.result : undefined;

  if (first.success && second.success) {
    const name1 = first.data;
    const name2 = second.data;

    // A result parameter opts into a spoiler. Calculate it from the complete names.
    const calculatedResult = validateResult(result) && calculateFlamesResult(name1, name2);
    if (calculatedResult) {
      return { ...generateResultMetadata(name1, name2, calculatedResult), ...searchMetadata };
    }

    const displayName1 = truncateText(name1, OG_VALIDATION.maxNameLength);
    const displayName2 = truncateText(name2, OG_VALIDATION.maxNameLength);
    const title = `${displayName1} & ${displayName2} | FLAMES Compatibility`;
    const description = `Check the FLAMES compatibility between ${displayName1} and ${displayName2}! Discover if it's Friends, Love, Affection, Marriage, Enemies, or Siblings.`;
    const ogImageUrl = generateResultOGImageUrl(name1, name2);
    const shareParams = new URLSearchParams({ name1, name2 });

    return {
      ...searchMetadata,
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${siteConfig.url}/share?${shareParams}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${displayName1} & ${displayName2} FLAMES Compatibility`,
            type: 'image/png',
          },
        ],
      },
      twitter: {
        title,
        description,
        card: 'summary_large_image',
        images: [ogImageUrl],
      },
    };
  }

  // Default home page metadata
  return {
    ...generatePageMetadata({
      title: pagesSEO.home.title,
      description: pagesSEO.home.description,
      keywords: pagesSEO.home.keywords,
      path: '/share',
      ogImage: pagesSEO.home.ogImage,
    }),
    ...searchMetadata,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomePage />
    </Suspense>
  );
}
