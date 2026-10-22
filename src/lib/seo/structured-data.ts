import { siteConfig } from './config';

/**
 * Structured Data Generator for JSON-LD
 * Generates schema.org compliant structured data for SEO and LLMO
 */

/**
 * WebSite identity. The calculator is not a site-search endpoint.
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
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
  };
}

/**
 * Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.author.url}/#organization`,
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    logo: 'https://cdn.osnaren.com/the-flames/v1/favicon/web-app-manifest-512x512.png',
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
    '@id': `${siteConfig.url}/#application`,
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
    screenshot: siteConfig.ogImage,
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
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 2,
    },
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
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
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
        url: 'https://cdn.osnaren.com/the-flames/v1/favicon/web-app-manifest-512x512.png',
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
 * Describe API documentation without implying a separate consumer application.
 */
export function generateAPISchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${siteConfig.url}/api-docs#documentation`,
    url: `${siteConfig.url}/api-docs`,
    headline: 'FLAMES API Documentation',
    description: 'Developer documentation for the FLAMES name-game API, including request and response examples.',
    inLanguage: siteConfig.language,
    about: { '@type': 'WebAPI', name: 'FLAMES Game API' },
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
