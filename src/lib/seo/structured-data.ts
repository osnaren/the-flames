import { siteConfig } from './config';

/**
 * Structured Data Generator for JSON-LD
 * Generates schema.org compliant structured data for SEO and LLMO
 */

/**
 * WebSite Schema with Search Action (for sitelinks search box)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: ['FLAMES', 'FLAMES Calculator', 'FLAMES Game Online'],
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    copyrightYear: new Date().getFullYear(),
    creator: {
      '@type': 'Organization',
      name: siteConfig.creator,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?name1={name1}&name2={name2}`,
      },
      'query-input': [
        {
          '@type': 'PropertyValueSpecification',
          valueRequired: true,
          valueName: 'name1',
        },
        {
          '@type': 'PropertyValueSpecification',
          valueRequired: true,
          valueName: 'name2',
        },
      ],
    },
  };
}

/**
 * Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    logo: `${siteConfig.url}/favicon/web-app-manifest-512x512.png`,
    sameAs: [
      'https://twitter.com/osnaren',
      'https://github.com/osnaren',
      'https://instagram.com/osnaren',
      'https://linkedin.com/in/osnaren',
    ],
  };
}

/**
 * WebApplication Schema
 */
export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    alternateName: 'FLAMES Calculator',
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    creator: {
      '@type': 'Organization',
      name: siteConfig.creator,
    },
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
    screenshot: `${siteConfig.url}${siteConfig.ogImage}`,
    featureList: [
      'Free online FLAMES game',
      'Instant relationship compatibility results',
      'Share results with friends',
      'Manual mode for traditional gameplay',
      'Global statistics and trends',
      'Mobile-friendly design',
    ],
  };
}

/**
 * Game Schema (additional for game-specific SEO)
 */
export function generateGameSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    genre: ['Casual', 'Word Game', 'Relationship Game'],
    gamePlatform: ['Web Browser'],
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 2,
    },
    playMode: 'SinglePlayer',
    inLanguage: siteConfig.language,
    author: {
      '@type': 'Organization',
      name: siteConfig.author.name,
    },
  };
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Article Schema for About page
 */
export function generateArticleSchema(options: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished || '2025-01-01',
    dateModified: options.dateModified || new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.publisher,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/favicon/web-app-manifest-512x512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
  };
}

/**
 * WebPage Schema
 */
export function generateWebPageSchema(options: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.title,
    description: options.description,
    url: options.url.startsWith('http') ? options.url : `${siteConfig.url}${options.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: siteConfig.language,
    ...(options.breadcrumbs && {
      breadcrumb: generateBreadcrumbSchema(options.breadcrumbs),
    }),
  };
}

/**
 * SoftwareApplication Schema for API Documentation
 */
export function generateAPISchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FLAMES Game API',
    description:
      'Free API for calculating FLAMES relationship compatibility. Integrate the classic game into your applications.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.author.name,
    },
  };
}

/**
 * Combine multiple schemas for a page
 */
export function combineSchemas(...schemas: object[]) {
  return schemas;
}
