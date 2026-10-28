import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useMemo } from 'react';
import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to centralize animation preference logic
 * Combines user preferences with system preferences
 */
export function useAnimationPreferences() {
  const animationsEnabled = usePreferencesStore((state) => state.animationsEnabled);
  // Keep the server snapshot for hydration, then observe the browser setting.
  // An immediate client-only reading can change the rendered HTML too early.
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Should animations be enabled based on both user settings and system preferences
  const shouldAnimate = useMemo(() => {
    return animationsEnabled && !prefersReducedMotion;
  }, [animationsEnabled, prefersReducedMotion]);

  return {
    animationsEnabled,
    prefersReducedMotion,
    shouldAnimate,
  };
}
