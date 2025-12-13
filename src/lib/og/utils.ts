/**
 * OpenGraph Image Utilities
 * Helper functions for OG image generation
 */

import { FLAMES_RESULT_THEMES, OG_VALIDATION } from './config';
import type { NonNullFlamesResult, OGGradient, OGResultParams } from './types';

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validates and sanitizes a name for OG image display
 * Handles edge cases:
 * - Empty/null/undefined inputs
 * - XSS attack patterns
 * - Unicode normalization
 * - Length constraints
 * - Control characters
 *
 * @param name - Raw name input
 * @returns Sanitized name or null if invalid
 */
export function sanitizeName(name: string | null | undefined): string | null {
  // Handle null/undefined/non-string
  if (!name || typeof name !== 'string') {
    return null;
  }

  // Decode URL-encoded characters first
  let sanitized: string;
  try {
    sanitized = decodeURIComponent(name);
  } catch {
    // If decode fails, use raw value
    sanitized = name;
  }

  // Normalize unicode
  sanitized = sanitized.normalize('NFC');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Remove dangerous characters and control characters
  sanitized = sanitized.replace(OG_VALIDATION.stripChars, '');

  // Remove any remaining control characters (U+0000 to U+001F, U+007F to U+009F)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  // Collapse multiple spaces into single space
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Check length constraints
  if (sanitized.length < OG_VALIDATION.minNameLength) {
    return null;
  }

  // Truncate if too long (keeping last character for ellipsis if truncated)
  if (sanitized.length > OG_VALIDATION.maxNameLength) {
    sanitized = sanitized.slice(0, OG_VALIDATION.maxNameLength - 1).trim() + '…';
  }

  return sanitized;
}

/**
 * Validates a FLAMES result character
 * @param result - Result character to validate
 * @returns Valid result or null
 */
export function validateResult(result: string | null | undefined): NonNullFlamesResult | null {
  if (!result || typeof result !== 'string') {
    return null;
  }

  const upper = result.toUpperCase();
  if (OG_VALIDATION.validResults.includes(upper as NonNullFlamesResult)) {
    return upper as NonNullFlamesResult;
  }

  return null;
}

/**
 * Parses and validates OG result parameters from URL search params
 * @param searchParams - URL search params
 * @returns Validated params or null values
 */
export function parseResultParams(searchParams: URLSearchParams): OGResultParams {
  const name1 = sanitizeName(searchParams.get('name1'));
  const name2 = sanitizeName(searchParams.get('name2'));
  const result = validateResult(searchParams.get('result'));

  return {
    name1: name1 || '',
    name2: name2 || '',
    result: result || undefined,
  };
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Converts a string to Title Case
 * @param str - String to convert
 * @returns Title cased string
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncates text with ellipsis if too long
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Formats names for display (Title Case)
 * @param name1 - First name
 * @param name2 - Second name
 * @returns Formatted string
 */
export function formatNamesDisplay(name1: string, name2: string): string {
  return `${toTitleCase(name1)} & ${toTitleCase(name2)}`;
}

// ============================================================================
// Style Utilities
// ============================================================================

/**
 * Generates CSS gradient string from OGGradient config
 * @param gradient - Gradient configuration
 * @returns CSS gradient string
 */
export function generateGradientCSS(gradient: OGGradient): string {
  const angle = gradient.angle ?? 135;
  if (gradient.via) {
    return `linear-gradient(${angle}deg, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`;
  }
  return `linear-gradient(${angle}deg, ${gradient.from} 0%, ${gradient.to} 100%)`;
}

/**
 * Gets the theme configuration for a FLAMES result
 * @param result - FLAMES result character
 * @returns Theme configuration
 */
export function getResultTheme(result: NonNullFlamesResult) {
  return FLAMES_RESULT_THEMES[result];
}

/**
 * Generates a glow box-shadow for a color
 * @param color - Base color
 * @param intensity - Glow intensity (0-1)
 * @returns Box shadow CSS value
 */
export function generateGlow(color: string, intensity: number = 0.5): string {
  return `0 0 60px rgba(${hexToRgb(color)}, ${intensity}), 0 0 120px rgba(${hexToRgb(color)}, ${intensity * 0.5})`;
}

/**
 * Converts hex color to RGB values
 * @param hex - Hex color string
 * @returns RGB string "r, g, b"
 */
function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';

  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Generates the OG image URL for a result
 * @param baseUrl - Base URL of the site
 * @param name1 - First name
 * @param name2 - Second name
 * @param result - FLAMES result (optional, will be calculated if not provided)
 * @returns Full OG image URL
 */
export function generateResultOGUrl(
  baseUrl: string,
  name1: string,
  name2: string,
  result?: NonNullFlamesResult
): string {
  const params = new URLSearchParams();
  params.set('name1', name1);
  params.set('name2', name2);
  if (result) {
    params.set('result', result);
  }
  return `${baseUrl}/api/og/result?${params.toString()}`;
}

/**
 * Generates cache control header value
 * @param maxAge - Max age in seconds
 * @param staleWhileRevalidate - SWR duration in seconds
 * @returns Cache-Control header value
 */
export function generateCacheControl(maxAge: number, staleWhileRevalidate?: number): string {
  let value = `public, max-age=${maxAge}`;
  if (staleWhileRevalidate) {
    value += `, stale-while-revalidate=${staleWhileRevalidate}`;
  }
  return value;
}

// ============================================================================
// Font Loading Utilities
// ============================================================================

/**
 * Fetches a Google Font for use in OG image generation
 * @param fontFamily - Font family name
 * @param weight - Font weight
 * @returns ArrayBuffer of font data
 */
export async function fetchGoogleFont(fontFamily: string, weight: number = 400): Promise<ArrayBuffer> {
  const API_URL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@${weight}&display=swap`;

  const cssResponse = await fetch(API_URL, {
    headers: {
      // Use a user agent that returns TTF format
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  });

  const css = await cssResponse.text();

  // Extract the font URL from the CSS
  const fontUrlMatch = css.match(/src: url\((.+?)\)/);
  if (!fontUrlMatch || !fontUrlMatch[1]) {
    throw new Error(`Failed to find font URL for ${fontFamily}`);
  }

  const fontResponse = await fetch(fontUrlMatch[1]);
  return fontResponse.arrayBuffer();
}

/**
 * Preloads common fonts for OG image generation
 * Returns cached fonts if available
 */
let fontCache: Map<string, ArrayBuffer> | null = null;

type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 700;
  style: 'normal';
};

export async function getOGFonts(): Promise<FontOptions[]> {
  if (!fontCache) {
    fontCache = new Map();
  }

  const fontsToLoad = [
    { family: 'Inter', weight: 400 as const },
    { family: 'Inter', weight: 600 as const },
    { family: 'Inter', weight: 700 as const },
  ];

  const loadedFonts = await Promise.all(
    fontsToLoad.map(async ({ family, weight }) => {
      const key = `${family}-${weight}`;
      if (!fontCache!.has(key)) {
        const data = await fetchGoogleFont(family, weight);
        fontCache!.set(key, data);
      }
      return {
        name: family,
        data: fontCache!.get(key)!,
        weight,
        style: 'normal' as const,
      };
    })
  );

  return loadedFonts;
}
