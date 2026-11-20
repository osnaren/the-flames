/**
 * UnifiedBackground Component
 * Main orchestrator for seasonal theme backgrounds with particle effects
 *
 * Architecture:
 * - shapes.ts: Canvas drawing functions for 22+ particle shapes
 * - types.ts: Particle and configuration type definitions
 * - useParticleSystem.ts: Particle creation, animation, and rendering logic
 * - BackgroundEffects.tsx: Compositor-animated colour fields and game-state glows
 *
 * Performance strategy:
 * - Colour fields drift with CSS transforms (GPU compositor, zero main-thread cost).
 * - The canvas particle layer (larger screens only) starts once the page is idle
 *   after load, so it never competes with LCP, hydration or early taps.
 */

'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useBackgroundStore } from '@/store/useBackgroundStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import dynamic from 'next/dynamic';
import { memo, useEffect, useRef, useState } from 'react';

import BackgroundEffects from './BackgroundEffects';
import { useParticleSystem } from './useParticleSystem';

/** Resolves true once the page has loaded and the main thread is idle. */
function useIdleReady(delay: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      timer = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
        } else {
          setReady(true);
        }
      }, delay);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (timer) clearTimeout(timer);
      if (idleId !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
    };
  }, [delay]);
  return ready;
}

// Illustrated scenery is decorative: load it in its own chunk after hydration.
const SeasonalScene = dynamic(() => import('@/components/ui/SeasonalScene/SeasonalScene'), {
  ssr: false,
  loading: () => null,
});

function UnifiedBackground() {
  const { shouldAnimate } = useAnimationPreferences();
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const { isLowPowerMode } = useDeviceCapabilities();
  const idleReady = useIdleReady(compactDevice ? 1800 : 600);
  const { currentThemeConfig, currentTheme } = useSeasonalTheme();
  const variant = useBackgroundStore((state) => state.variant);
  // Phones get their motion from the compositor-only scenes and colour fields;
  // the main-thread canvas is reserved for larger screens so it can never sit
  // between a tap and the response to it.
  const particlesEnabled = shouldAnimate && !isLowPowerMode && idleReady && !compactDevice;
  const result = useBackgroundStore((state) => state.result);
  const intensity = useBackgroundStore((state) => state.intensity);
  const isDarkTheme = usePreferencesStore((state) => state.isDarkTheme);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgEffects = currentThemeConfig.backgroundEffects;

  const { config } = useParticleSystem({
    canvasRef,
    themeParticleConfig: bgEffects.particleEffects,
    variant,
    result: result ?? null,
    intensity,
    currentTheme,
    enabled: particlesEnabled,
  });

  return (
    <div
      aria-hidden="true"
      data-background={particlesEnabled ? 'particles' : 'ambient'}
      className="bg-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <BackgroundEffects
        variant={variant}
        result={result ?? null}
        primaryColor={currentThemeConfig.colors.primary}
        secondaryColor={currentThemeConfig.colors.secondary}
        accentColor={currentThemeConfig.colors.accent}
        isDarkTheme={isDarkTheme}
        shouldAnimate={shouldAnimate}
        compact={compactDevice}
        overlayPattern={bgEffects.overlayPattern}
        overlayOpacity={bgEffects.overlayOpacity}
        pulsing={bgEffects.pulsing}
        resultColors={config.colors}
      />

      <SeasonalScene theme={currentTheme} dimmed={variant !== 'default'} />

      {particlesEnabled && (
        <canvas
          ref={canvasRef}
          className="motion-rise absolute inset-0 h-full w-full"
          style={{
            width: '100%',
            height: '100%',
            ['--rise-distance' as string]: '0px',
            ['--rise-duration' as string]: '1.2s',
          }}
        />
      )}
    </div>
  );
}

export default memo(UnifiedBackground);
