/**
 * Dynamic OpenGraph Image API Route for FLAMES Results
 *
 * Generates custom OG images for shared FLAMES results with:
 * - Both names displayed with connector emoji
 * - Result badge with emoji and label
 * - FLAMES letters with the result letter highlighted
 * - Beautiful gradient background matching the result
 *
 * Usage: /api/og/result?name1=John&name2=Jane&result=L
 *
 * Query Parameters:
 * - name1: First name (required)
 * - name2: Second name (required)
 * - result: FLAMES result character F/L/A/M/E/S (optional, shows generic if not provided)
 */

import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

import {
  OG_CACHE_CONFIG,
  OG_IMAGE_SIZES,
  generateCacheControl,
  getOGFonts,
  sanitizeName,
  validateResult,
} from '@/lib/og';
import {
  FlamesLetters,
  OGBackground,
  OGBadge,
  OGFooter,
  OGNamesDisplay,
  OGResultBadge,
  OGResultTagline,
  OGTitle,
} from '@/lib/og/components';
import { isRedisConfigured, ogRateLimiter } from '@/lib/redis';

export const runtime = 'edge';

// ============================================================================
// Fallback Image (when names are missing)
// ============================================================================

function FallbackImage() {
  return (
    <OGBackground result={null}>
      <FlamesLetters highlightLetter={null} />
      <OGTitle title="FLAMES Game" subtitle="Discover Your Relationship Compatibility" />
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '32px',
        }}
      >
        {['Free to Play', 'Instant Results', 'Share with Friends'].map((text) => (
          <OGBadge key={text} text={text} />
        ))}
      </div>
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

    // Parse and validate parameters
    const name1 = sanitizeName(searchParams.get('name1'));
    const name2 = sanitizeName(searchParams.get('name2'));
    const result = validateResult(searchParams.get('result'));

    // Load fonts
    const fonts = await getOGFonts();

    // If names are missing, return fallback image
    if (!name1 || !name2) {
      return new ImageResponse(<FallbackImage />, {
        ...OG_IMAGE_SIZES.default,
        fonts,
        headers: {
          'Cache-Control': generateCacheControl(OG_CACHE_CONFIG.staticMaxAge, OG_CACHE_CONFIG.staleWhileRevalidate),
        },
      });
    }

    // Generate the result OG image
    const imageElement = (
      <OGBackground result={result} variant="result">
        <FlamesLetters highlightLetter={result} />
        <OGNamesDisplay name1={name1} name2={name2} result={result} />
        {result ? (
          <>
            <OGResultBadge result={result} />
            <OGResultTagline result={result} />
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontSize: '24px',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <span>✨</span>
            <span>Check our compatibility!</span>
            <span>✨</span>
          </div>
        )}
        <OGFooter />
      </OGBackground>
    );

    return new ImageResponse(imageElement, {
      ...OG_IMAGE_SIZES.default,
      fonts,
      headers: {
        'Cache-Control': generateCacheControl(OG_CACHE_CONFIG.resultMaxAge, OG_CACHE_CONFIG.staleWhileRevalidate),
      },
    });
  } catch (error) {
    console.error('OG Image Generation Error:', error);

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
