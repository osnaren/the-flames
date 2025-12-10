/**
 * OpenGraph Image for Charts Page
 * Auto-generated OG image for /charts route
 */

import { ImageResponse } from 'next/og';

import { OG_COLOR_SCHEMES, OG_IMAGE_SIZES, PAGE_OG_CONFIGS, generateGradientCSS } from '@/lib/og';

export const runtime = 'edge';

export const alt = 'FLAMES Global Charts - Relationship Trends & Statistics';
export const size = OG_IMAGE_SIZES.default;
export const contentType = 'image/png';

export default async function Image() {
  const config = PAGE_OG_CONFIGS.charts;
  const colorScheme = OG_COLOR_SCHEMES.dark;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: generateGradientCSS(colorScheme.backgroundGradient),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorScheme.primary}20 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorScheme.secondary}15 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        {/* Custom Icon */}
        {config.customIcon && (
          <div
            style={{
              fontSize: '72px',
              marginBottom: '20px',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
            }}
          >
            {config.customIcon}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 4px 16px rgba(0,0,0,0.4)',
            marginBottom: '12px',
          }}
        >
          {config.title}
        </div>

        {/* Subtitle */}
        {config.subtitle && (
          <div
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              marginBottom: '24px',
            }}
          >
            {config.subtitle}
          </div>
        )}

        {/* Badges */}
        {config.badges && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {config.badges.map((text) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  fontSize: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                {text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#64748b',
          fontSize: '20px',
        }}
      >
        <span style={{ fontSize: '24px' }}>🔥</span>
        <span>theflames.app</span>
      </div>
    </div>,
    { ...size }
  );
}
