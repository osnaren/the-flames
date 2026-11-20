'use client';

import { memo, type CSSProperties } from 'react';

interface BackgroundEffectsProps {
  variant: 'default' | 'processing' | 'result';
  result: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkTheme: boolean;
  shouldAnimate: boolean;
  compact?: boolean;
  overlayPattern?: string;
  overlayOpacity?: number;
  pulsing?: boolean;
  resultColors: string[];
}

interface OrbProps {
  color: string;
  size: string;
  position: CSSProperties;
  duration: number;
  delay: number;
  driftX: string;
  driftY: string;
  animate: boolean;
}

/**
 * A soft colour field. The softness comes from the radial gradient itself, so
 * there is no `filter: blur()` to re-rasterise; the drift is a CSS transform
 * that runs entirely on the compositor.
 */
const Orb = memo(function Orb({ color, size, position, duration, delay, driftX, driftY, animate }: OrbProps) {
  return (
    <div
      className={`absolute rounded-full ${animate ? 'motion-drift will-change-transform' : ''}`}
      style={
        {
          width: size,
          height: size,
          ...position,
          backgroundImage: `radial-gradient(circle at center, ${color} 0%, transparent 68%)`,
          '--drift-duration': `${duration}s`,
          '--drift-delay': `${delay}s`,
          '--drift-x': driftX,
          '--drift-y': driftY,
        } as CSSProperties
      }
    />
  );
});

/** Ambient seasonal colour, plus a game-state glow that cross-fades with opacity only. */
function BackgroundEffects({
  variant,
  primaryColor,
  secondaryColor,
  accentColor,
  isDarkTheme,
  shouldAnimate,
  compact = false,
  overlayPattern,
  overlayOpacity = 0.05,
  resultColors,
}: BackgroundEffectsProps) {
  const alpha = isDarkTheme ? '38' : '4d';
  const processingGlow = '#F97316';
  const resultGlow = resultColors[0] ?? primaryColor;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: isDarkTheme ? 0.9 : 1 }}>
        <Orb
          color={`${primaryColor}${alpha}`}
          size="70vmax"
          position={{ left: '-25vmax', top: '-25vmax' }}
          duration={26}
          delay={0}
          driftX="6%"
          driftY="5%"
          animate={shouldAnimate}
        />
        <Orb
          color={`${secondaryColor}${alpha}`}
          size="65vmax"
          position={{ right: '-25vmax', bottom: '-25vmax' }}
          duration={31}
          delay={-8}
          driftX="-5%"
          driftY="-6%"
          animate={shouldAnimate}
        />
        {!compact && (
          <Orb
            color={`${accentColor}2a`}
            size="50vmax"
            position={{ left: '30%', top: '25%' }}
            duration={37}
            delay={-15}
            driftX="-7%"
            driftY="4%"
            animate={shouldAnimate}
          />
        )}
      </div>

      {overlayPattern && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: `url(${overlayPattern})`, backgroundSize: '200px 200px', opacity: overlayOpacity }}
        />
      )}

      {/* Game-state glows stay mounted and fade with opacity so switching stages never repaints. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 45%, ${processingGlow}40, transparent 62%)`,
          opacity: variant === 'processing' ? 1 : 0,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 40%, ${toHexAlpha(resultGlow, '4d')}, transparent 65%)`,
          opacity: variant === 'result' ? 1 : 0,
        }}
      />
    </>
  );
}

/** Result colours arrive as rgba(); hex theme colours take an alpha suffix. */
function toHexAlpha(color: string, alpha: string) {
  if (color.startsWith('#') && color.length === 7) return `${color}${alpha}`;
  if (color.startsWith('rgba(')) return color.replace(/[\d.]+\)$/, `${parseInt(alpha, 16) / 255})`);
  return color;
}

export default memo(BackgroundEffects);
