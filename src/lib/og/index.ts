/**
 * OpenGraph Image Module
 * Centralized exports for OG image generation system
 */

// Configuration
export {
  FLAMES_LETTERS_CONFIG,
  FLAMES_RESULT_THEMES,
  OG_CACHE_CONFIG,
  OG_COLOR_SCHEMES,
  OG_DOMAIN,
  OG_IMAGE_SIZES,
  OG_VALIDATION,
  PAGE_OG_CONFIGS,
} from './config';

// Types
export type {
  FlamesResultTheme,
  NonNullFlamesResult,
  OGBackgroundProps,
  OGBadgeProps,
  OGColorScheme,
  OGFontConfig,
  OGFooterProps,
  OGGradient,
  OGImageOptions,
  OGImageSize,
  OGImageVariant,
  OGNamesDisplayProps,
  OGPageConfig,
  OGResultConfig,
  OGResultDisplayProps,
  OGResultParams,
} from './types';

// Utilities
export {
  fetchGoogleFont,
  formatNamesDisplay,
  generateCacheControl,
  generateGlow,
  generateGradientCSS,
  generateResultOGUrl,
  getOGFonts,
  getResultTheme,
  parseResultParams,
  sanitizeName,
  toTitleCase,
  truncateText,
  validateResult,
} from './utils';

// Components
export {
  FlamesLetters,
  OGBackground,
  OGBadge,
  OGBadgeRow,
  OGCustomIcon,
  OGFooter,
  OGNamesDisplay,
  OGResultBadge,
  OGResultTagline,
  OGTitle,
} from './components';
