/**
 * OpenGraph Image for Home Page
 * Auto-generated OG image for the root route
 *
 * This generates a beautiful, branded OG image featuring:
 * - FLAMES letters with gradient backgrounds
 * - Main title and subtitle
 * - Feature badges
 * - Decorative background elements
 */

import { ImageResponse } from 'next/og';

import {
  FlamesLetters,
  OGBackground,
  OGBadgeRow,
  OGFooter,
  OGTitle,
} from '@/lib/og/components';
import { OG_IMAGE_SIZES, getOGFonts } from '@/lib/og';

export const runtime = 'edge';

export const alt = 'FLAMES Game - Free Online Relationship Compatibility Calculator';
export const size = OG_IMAGE_SIZES.default;
export const contentType = 'image/png';

export default async function Image() {
  // Load fonts
  const fonts = await getOGFonts();

  return new ImageResponse(
    (
      <OGBackground>
        <FlamesLetters size="lg" />
        <OGTitle
          title="FLAMES Game"
          subtitle="Discover Your Relationship Compatibility"
          size="lg"
        />
        <OGBadgeRow
          badges={['Free to Play', 'Instant Results', 'Share with Friends']}
        />
        <OGFooter />
      </OGBackground>
    ),
    {
      ...size,
      fonts,
    }
  );
}
