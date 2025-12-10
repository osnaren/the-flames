/**
 * OpenGraph Image Configuration
 * Centralized configuration for OG image generation
 */

import type {
  FlamesResultTheme,
  NonNullFlamesResult,
  OGColorScheme,
  OGGradient,
  OGImageSize,
  OGPageConfig,
} from './types';

// ============================================================================
// Size Configuration
// ============================================================================

export const OG_IMAGE_SIZES = {
  /** Standard OpenGraph image size (Facebook, LinkedIn, etc.) */
  default: { width: 1200, height: 630 } as OGImageSize,
  /** Twitter summary large image */
  twitter: { width: 1200, height: 628 } as OGImageSize,
  /** Square format for some platforms */
  square: { width: 1200, height: 1200 } as OGImageSize,
} as const;

// ============================================================================
// Color Schemes
// ============================================================================

export const OG_COLOR_SCHEMES: Record<'dark' | 'light', OGColorScheme> = {
  dark: {
    background: '#0f0f1a',
    backgroundGradient: {
      from: '#1a1a2e',
      via: '#16213e',
      to: '#0f3460',
      angle: 135,
    },
    primary: '#ec4899',
    secondary: '#8b5cf6',
    text: '#ffffff',
    textMuted: '#94a3b8',
    accent: '#f472b6',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  light: {
    background: '#ffffff',
    backgroundGradient: {
      from: '#fdf2f8',
      via: '#fce7f3',
      to: '#fbcfe8',
      angle: 135,
    },
    primary: '#db2777',
    secondary: '#7c3aed',
    text: '#1f2937',
    textMuted: '#6b7280',
    accent: '#ec4899',
    border: 'rgba(0, 0, 0, 0.1)',
  },
};

// ============================================================================
// FLAMES Letter Themes
// ============================================================================

const FLAMES_LETTER_GRADIENTS: Record<NonNullFlamesResult, OGGradient> = {
  F: { from: '#3b82f6', to: '#06b6d4', angle: 135 }, // Blue to Cyan
  L: { from: '#ec4899', to: '#f43f5e', angle: 135 }, // Pink to Rose
  A: { from: '#f59e0b', to: '#f97316', angle: 135 }, // Amber to Orange
  M: { from: '#8b5cf6', to: '#a855f7', angle: 135 }, // Purple to Violet
  E: { from: '#ef4444', to: '#dc2626', angle: 135 }, // Red shades
  S: { from: '#10b981', to: '#059669', angle: 135 }, // Emerald to Green
};

// ============================================================================
// FLAMES Result Themes
// ============================================================================

export const FLAMES_RESULT_THEMES: Record<NonNullFlamesResult, FlamesResultTheme> = {
  F: {
    emoji: '🤝',
    label: 'Friendship',
    tagline: 'Best friends forever!',
    gradient: FLAMES_LETTER_GRADIENTS.F,
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  L: {
    emoji: '❤️',
    label: 'Love',
    tagline: 'A match made in heaven!',
    gradient: FLAMES_LETTER_GRADIENTS.L,
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
  A: {
    emoji: '🥰',
    label: 'Affection',
    tagline: 'Sweet affection blooms!',
    gradient: FLAMES_LETTER_GRADIENTS.A,
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  M: {
    emoji: '💍',
    label: 'Marriage',
    tagline: 'Wedding bells are ringing!',
    gradient: FLAMES_LETTER_GRADIENTS.M,
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
  E: {
    emoji: '⚔️',
    label: 'Enemy',
    tagline: 'Opposites attract... or clash!',
    gradient: FLAMES_LETTER_GRADIENTS.E,
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  S: {
    emoji: '👫',
    label: 'Siblings',
    tagline: 'Like family forever!',
    gradient: FLAMES_LETTER_GRADIENTS.S,
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
};

// ============================================================================
// FLAMES Letter Display Config
// ============================================================================

export const FLAMES_LETTERS_CONFIG = [
  { letter: 'F' as const, gradient: FLAMES_LETTER_GRADIENTS.F },
  { letter: 'L' as const, gradient: FLAMES_LETTER_GRADIENTS.L },
  { letter: 'A' as const, gradient: FLAMES_LETTER_GRADIENTS.A },
  { letter: 'M' as const, gradient: FLAMES_LETTER_GRADIENTS.M },
  { letter: 'E' as const, gradient: FLAMES_LETTER_GRADIENTS.E },
  { letter: 'S' as const, gradient: FLAMES_LETTER_GRADIENTS.S },
] as const;

// ============================================================================
// Page-Specific Configurations
// ============================================================================

export const PAGE_OG_CONFIGS: Record<string, OGPageConfig> = {
  home: {
    variant: 'default',
    title: 'FLAMES Game',
    subtitle: 'Discover Your Relationship Compatibility',
    badges: ['Free to Play', 'Instant Results', 'Share with Friends'],
    showFlamesLetters: true,
  },
  about: {
    variant: 'about',
    title: 'About FLAMES',
    subtitle: 'The Story Behind the Classic Game',
    badges: ['Nostalgic', 'Fun', 'Timeless'],
    showFlamesLetters: true,
    customIcon: '📖',
  },
  'how-it-works': {
    variant: 'how-it-works',
    title: 'How FLAMES Works',
    subtitle: 'Learn the Algorithm Behind the Magic',
    badges: ['Step by Step', 'Interactive', 'Easy to Learn'],
    showFlamesLetters: true,
    customIcon: '🔮',
  },
  charts: {
    variant: 'charts',
    title: 'Global Charts',
    subtitle: 'Relationship Trends & Statistics',
    badges: ['Live Stats', 'Global Trends', 'Insights'],
    showFlamesLetters: false,
    customIcon: '📊',
  },
  manual: {
    variant: 'manual',
    title: 'Manual Mode',
    subtitle: 'Play FLAMES the Traditional Way',
    badges: ['Paper Style', 'Nostalgic', 'Interactive'],
    showFlamesLetters: true,
    customIcon: '✏️',
  },
  'api-docs': {
    variant: 'api-docs',
    title: 'FLAMES API',
    subtitle: 'Developer Documentation',
    badges: ['Free API', 'REST', 'Easy Integration'],
    showFlamesLetters: false,
    customIcon: '⚡',
  },
};

// ============================================================================
// Validation Configuration
// ============================================================================

export const OG_VALIDATION = {
  /** Maximum characters for names (to fit in image) */
  maxNameLength: 25,
  /** Minimum characters for names */
  minNameLength: 1,
  /** Characters to strip from names (security and display) */
  stripChars: /[<>'"&\\/\n\r\t\0]/g,
  /** Valid FLAMES results */
  validResults: ['F', 'L', 'A', 'M', 'E', 'S'] as const,
  /** Maximum URL length for OG image requests */
  maxUrlLength: 2048,
  /** Allowed characters pattern for names (alphanumeric, spaces, basic punctuation) */
  allowedNamePattern: /^[\p{L}\p{N}\s\-'.]+$/u,
} as const;

// ============================================================================
// Cache Configuration
// ============================================================================

export const OG_CACHE_CONFIG = {
  /** Cache duration for static pages (1 year) */
  staticMaxAge: 31536000,
  /** Cache duration for result pages (1 week) */
  resultMaxAge: 604800,
  /** Stale-while-revalidate duration */
  staleWhileRevalidate: 86400,
} as const;

// ============================================================================
// Domain Configuration
// ============================================================================

export const OG_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://theflames.app';
