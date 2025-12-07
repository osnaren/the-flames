/**
 * SEO Module Exports
 * Centralized exports for all SEO-related utilities
 */

// Configuration
export { faqData, pagesSEO, siteConfig, socialLinks } from './config';

// Metadata utilities
export {
  baseMetadata,
  generatePageMetadata,
  generateResultMetadata,
  viewportConfig,
} from './metadata';

// Structured data generators
export {
  combineSchemas,
  generateAPISchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateGameSchema,
  generateHowToSchema,
  generateOrganizationSchema,
  generateWebApplicationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
} from './structured-data';
