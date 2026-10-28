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
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useBackgroundStore } from '@/store/useBackgroundStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { memo, useRef } from 'react';

import BackgroundEffects from './BackgroundEffects';
import { useParticleSystem } from './useParticleSystem';

// --- Main Component ---

function UnifiedBackground() {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const { isLowPowerMode } = useDeviceCapabilities();
  const animateBackground = shouldAnimate && !compactDevice && !isLowPowerMode;
  const { currentThemeConfig, currentTheme } = useSeasonalTheme();
  const { variant, result, intensity } = useBackgroundStore();
  const isDarkTheme = usePreferencesStore((state) => state.isDarkTheme);

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
    enabled: animateBackground,
  });

  // Static background for reduced motion
  if (!animateBackground || prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        data-background="static"
        className="bg-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-linear-to-br" />
      </div>
    );
  }

  // Get gradient colors for orbs
  const primaryColor = currentThemeConfig.colors.primary;
  const secondaryColor = currentThemeConfig.colors.secondary;
  const accentColor = currentThemeConfig.colors.accent;

  return (
    <div
      aria-hidden="true"
      data-background="particles"
      className="bg-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
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
