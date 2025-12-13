import { generatePageMetadata, generateResultMetadata, pagesSEO, siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

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
  const params = await searchParams;
  const name1 = typeof params.name1 === 'string' ? params.name1 : undefined;
  const name2 = typeof params.name2 === 'string' ? params.name2 : undefined;
  const result = typeof params.result === 'string' ? params.result : undefined;

  // If we have both names, generate result-specific metadata
  if (name1 && name2) {
    // Sanitize names (basic validation)
    const sanitizedName1 = name1.trim().slice(0, 25);
    const sanitizedName2 = name2.trim().slice(0, 25);

    // Validate result if provided
    const validResult = result?.toUpperCase();
    const isValidResult = validResult && ['F', 'L', 'A', 'M', 'E', 'S'].includes(validResult);

    if (isValidResult) {
      // Generate full result metadata with custom OG image
      return generateResultMetadata(sanitizedName1, sanitizedName2, validResult);
    }

    // Names provided but no/invalid result - generate preview metadata
    const title = `${sanitizedName1} & ${sanitizedName2} | FLAMES Compatibility`;
    const description = `Check the FLAMES compatibility between ${sanitizedName1} and ${sanitizedName2}! Discover if it's Friends, Love, Affection, Marriage, Enemies, or Siblings.`;
    const ogImageUrl = `${siteConfig.url}/api/og/result?name1=${encodeURIComponent(sanitizedName1)}&name2=${encodeURIComponent(sanitizedName2)}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${siteConfig.url}?name1=${encodeURIComponent(sanitizedName1)}&name2=${encodeURIComponent(sanitizedName2)}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${sanitizedName1} & ${sanitizedName2} FLAMES Compatibility`,
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
  return generatePageMetadata({
    title: pagesSEO.home.title,
    description: pagesSEO.home.description,
    keywords: pagesSEO.home.keywords,
    path: '',
    ogImage: pagesSEO.home.ogImage,
  });
}

export default function Page() {
  return <HomePage />;
}
