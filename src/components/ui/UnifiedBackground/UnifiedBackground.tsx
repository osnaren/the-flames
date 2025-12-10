/**
 * UnifiedBackground Component
 * Main orchestrator for seasonal theme backgrounds with particle effects
 *
 * Architecture:
 * - shapes.ts: Canvas drawing functions for 22+ particle shapes
 * - types.ts: Particle and configuration type definitions
 * - useParticleSystem.ts: Particle creation, animation, and rendering logic
 * - BackgroundEffects.tsx: Gradient orbs, overlays, and ambient effects
 */

'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useBackgroundStore } from '@/store/useBackgroundStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { memo, useRef } from 'react';

import BackgroundEffects from './BackgroundEffects';
import { useParticleSystem } from './useParticleSystem';

// --- Static Background (Reduced Motion) ---

const StaticBackground = memo(function StaticBackground() {
  return (
    <div className="bg-background fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/noise.webp')] opacity-5 dark:opacity-[0.03]" />
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-linear-to-br" />
    </div>
  );
});

// --- Main Component ---

function UnifiedBackground() {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const { currentThemeConfig, currentTheme } = useSeasonalTheme();
  const { variant, result, intensity } = useBackgroundStore();
  const { isDarkTheme } = usePreferencesStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background effects config from theme
  const bgEffects = currentThemeConfig.backgroundEffects;

  // Use the particle system hook
  const { config } = useParticleSystem({
    canvasRef,
    themeParticleConfig: bgEffects.particleEffects,
    variant,
    result: result ?? null,
    intensity,
    currentTheme,
  });

  // Static background for reduced motion
  if (!shouldAnimate || prefersReducedMotion) {
    return <StaticBackground />;
  }

  // Get gradient colors for orbs
  const primaryColor = currentThemeConfig.colors.primary;
  const secondaryColor = currentThemeConfig.colors.secondary;
  const accentColor = currentThemeConfig.colors.accent;

  return (
    <div className="bg-background fixed inset-0 z-0 overflow-hidden transition-colors duration-700">
      {/* Background Effects Layer */}
      <BackgroundEffects
        variant={variant}
        result={result ?? null}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        isDarkTheme={isDarkTheme}
        shouldAnimate={shouldAnimate}
        overlayPattern={bgEffects.overlayPattern}
        overlayOpacity={bgEffects.overlayOpacity}
        pulsing={bgEffects.pulsing}
        resultColors={config.colors}
      />

      {/* Canvas Layer for Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default memo(UnifiedBackground);
