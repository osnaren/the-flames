'use client';

import { memo } from 'react';

interface BackgroundEffectsProps {
  variant: 'default' | 'processing' | 'result';
  result: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkTheme: boolean;
  shouldAnimate: boolean;
  overlayPattern?: string;
  overlayOpacity?: number;
  pulsing?: boolean;
  resultColors: string[];
}

/** Keep the seasonal palette without repainting full-screen blur filters. */
function BackgroundEffects({
  variant,
  primaryColor,
  secondaryColor,
  accentColor,
  isDarkTheme,
  overlayPattern,
  overlayOpacity = 0.05,
  resultColors,
}: BackgroundEffectsProps) {
  const glow = variant === 'processing' ? '#F97316' : variant === 'result' ? resultColors[0] : primaryColor;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 20%, ${primaryColor}30, transparent 55%), radial-gradient(ellipse at 85% 75%, ${secondaryColor}30, transparent 55%), radial-gradient(ellipse at 50% 50%, ${accentColor}18, transparent 60%)`,
          opacity: isDarkTheme ? 0.65 : 0.8,
        }}
      />
      {overlayPattern && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: `url(${overlayPattern})`, backgroundSize: '200px 200px', opacity: overlayOpacity }}
        />
      )}
      {variant !== 'default' && glow && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(ellipse at center, ${glow}, transparent 65%)` }}
        />
      )}
    </>
  );
}

export default memo(BackgroundEffects);
