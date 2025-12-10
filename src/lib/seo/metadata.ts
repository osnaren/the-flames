import type { Metadata } from 'next';
import { siteConfig } from './config';

// FLAMES result meanings for metadata generation
const FLAMES_MEANINGS: Record<string, { label: string; emoji: string }> = {
  F: { label: 'Friendship', emoji: '🤝' },
  L: { label: 'Love', emoji: '❤️' },
  A: { label: 'Affection', emoji: '🥰' },
  M: { label: 'Marriage', emoji: '💍' },
  E: { label: 'Enemy', emoji: '⚔️' },
  S: { label: 'Siblings', emoji: '👫' },
};

/**
 * Base metadata that applies to all pages
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: siteConfig.category,
  classification: siteConfig.classification,
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Play the classic relationship game online`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.twitterImage],
    creator: siteConfig.author.twitter,
    site: siteConfig.author.twitter,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en-US': siteConfig.url,
    },
  },
  verification: {},
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.shortName,
  },
  applicationName: siteConfig.name,
};

/**
 * Viewport configuration
 */
export const viewportConfig = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata(options: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description, keywords = [], path = '', ogImage, noIndex = false } = options;
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: siteConfig.name,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

/**
 * Generate dynamic result page metadata for shared results
 * Includes custom OG image URL with names and result for social preview
 */
export function generateResultMetadata(name1: string, name2: string, result: string): Metadata {
  const resultInfo = FLAMES_MEANINGS[result.toUpperCase()] || { label: result, emoji: '✨' };
  const title = `${name1} & ${name2}: ${resultInfo.emoji} ${resultInfo.label} | FLAMES Result`;
  const description = `${name1} and ${name2} got "${resultInfo.label}" in the FLAMES game! ${resultInfo.emoji} Play now to discover your relationship compatibility.`;

  // Generate dynamic OG image URL
  const ogImageUrl = `${siteConfig.url}/api/og/result?name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}&result=${result.toUpperCase()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name1} & ${name2} FLAMES Result: ${resultInfo.label}`,
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

/**
 * Generate dynamic OG image URL for any page
 * @param page - Page identifier (home, about, how-it-works, charts, manual, api-docs)
 * @returns Full URL to the dynamic OG image
 */
export function generatePageOGImageUrl(page: string): string {
  return `${siteConfig.url}/api/og/page?page=${encodeURIComponent(page)}`;
}

/**
 * Generate dynamic result OG image URL
 * @param name1 - First name
 * @param name2 - Second name
 * @param result - Optional FLAMES result character
 * @returns Full URL to the dynamic result OG image
 */
export function generateResultOGImageUrl(name1: string, name2: string, result?: string): string {
  const params = new URLSearchParams();
  params.set('name1', name1);
  params.set('name2', name2);
  if (result) {
    params.set('result', result.toUpperCase());
  }
  return `${siteConfig.url}/api/og/result?${params.toString()}`;
}
