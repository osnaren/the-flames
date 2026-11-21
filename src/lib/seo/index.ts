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
  generatePageOGImageUrl,
  generateResultMetadata,
  generateResultOGImageUrl,
  viewportConfig,
} from './metadata';

// Structured data generators
export {
  combineSchemas,
  generateAPISchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebApplicationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
} from './structured-data';

// Long-form content shared by pages and JSON-LD
export {
  CONTENT_PUBLISHED,
  CONTENT_UPDATED,
  HOME_FAQ,
  HOW_TO_STEPS,
  RESULT_MEANINGS,
  WORKED_EXAMPLES,
  faqPageSchema,
  howToSchema,
} from './content';
export type { FaqEntry } from './content';
