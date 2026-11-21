import { siteConfig } from './config';

/** The single Organization node (declared in the layout); every other node refers to it by @id. */
const ORGANIZATION_ID = `${siteConfig.author.url}/#organization`;
const ORGANIZATION = { '@id': ORGANIZATION_ID };
const LOGO = 'https://cdn.osnaren.com/the-flames/v1/favicon/web-app-manifest-512x512.png';

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
    publisher: ORGANIZATION,
    creator: ORGANIZATION,
  };
}

/**
 * Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    logo: LOGO,
    sameAs: [
      'https://twitter.com/osnaren',
      'https://github.com/osnaren',
      'https://instagram.com/osnaren',
      'https://linkedin.com/in/osnaren',
    ],
  };
}

/**
 * The calculator itself: one entity that is both a web application and a game.
 */
export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'Game'],
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
    author: ORGANIZATION,
    creator: ORGANIZATION,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    genre: ['Casual', 'Word Game', 'Relationship Game'],
    numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2 },
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
    '@id': `${options.url}#article`,
    headline: options.title,
    description: options.description,
    url: options.url,
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    image: siteConfig.ogImage,
    inLanguage: siteConfig.language,
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
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
    isPartOf: { '@id': `${siteConfig.url}/#website` },
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
    about: {
      '@type': 'WebAPI',
      '@id': `${siteConfig.url}/api/flames#api`,
      name: 'FLAMES Game API',
      documentation: `${siteConfig.url}/api-docs`,
      provider: ORGANIZATION,
    },
    author: ORGANIZATION,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
  };
}

/**
 * Combine multiple schemas for a page
 */
export function combineSchemas(...schemas: object[]) {
  return schemas;
}
