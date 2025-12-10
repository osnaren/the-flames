/**
 * Twitter Image for Home Page
 * Re-exports the OpenGraph image for Twitter card
 */

import { OG_IMAGE_SIZES } from '@/lib/og';

export const runtime = 'edge';

export const alt = 'FLAMES Game - Free Online Relationship Compatibility Calculator';
export const size = OG_IMAGE_SIZES.default;
export const contentType = 'image/png';

// Re-export the same image for Twitter
export { default } from './opengraph-image';
