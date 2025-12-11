/**
 * Dynamic OpenGraph Image Generator for Static Pages
 *
 * A generic route that generates OG images for different pages based on the `page` query param.
 * This allows customizing OG images for about, how-it-works, charts, manual, and api-docs pages.
 *
 * Usage: /api/og/page?page=about
 *
 * Supported pages: about, how-it-works, charts, manual, api-docs
 */

import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

import { isRedisConfigured, ogRateLimiter } from '@/lib/redis';
import { OG_CACHE_CONFIG, OG_IMAGE_SIZES, PAGE_OG_CONFIGS, generateCacheControl, getOGFonts } from '@/lib/og';
import { FlamesLetters, OGBackground, OGBadgeRow, OGCustomIcon, OGFooter, OGTitle } from '@/lib/og/components';

export const runtime = 'edge';

// ============================================================================
// Page Image Generator
// ============================================================================

function generatePageImage(config: (typeof PAGE_OG_CONFIGS)['home']) {
  return (
    <OGBackground>
      {config.customIcon && <OGCustomIcon icon={config.customIcon} />}
      {config.showFlamesLetters && <FlamesLetters size="sm" />}
      <OGTitle title={config.title} subtitle={config.subtitle} />
      {config.badges && config.badges.length > 0 && <OGBadgeRow badges={config.badges} />}
      <OGFooter />
    </OGBackground>
  );
}

// ============================================================================
// Main Handler
// ============================================================================

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'anonymous';
}

export async function GET(request: NextRequest) {
  try {
    // Rate Limiting
    if (isRedisConfigured()) {
      const clientId = getClientId(request);
      const { allowed } = await ogRateLimiter.checkLimit(clientId);
      if (!allowed) {
        return new Response('Too Many Requests', { status: 429 });
      }
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page')?.toLowerCase() || 'home';

    // Get page config, fallback to home if not found
    const config = PAGE_OG_CONFIGS[page] || PAGE_OG_CONFIGS.home;

    // Load fonts
    const fonts = await getOGFonts();

    const imageElement = generatePageImage(config);

    return new ImageResponse(imageElement, {
      ...OG_IMAGE_SIZES.default,
      fonts,
      headers: {
        'Cache-Control': generateCacheControl(OG_CACHE_CONFIG.staticMaxAge, OG_CACHE_CONFIG.staleWhileRevalidate),
      },
    });
  } catch (error) {
    console.error('Page OG Image Generation Error:', error);

    // Return a basic error fallback
    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a2e',
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
        }}
      >
        🔥 FLAMES Game
      </div>,
      {
        ...OG_IMAGE_SIZES.default,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}
