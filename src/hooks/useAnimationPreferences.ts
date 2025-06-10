import { useMemo } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { usePreferences } from './usePreferences';

/**
 * Hook to centralize animation preference logic
 * Combines user preferences with system preferences
 */
export function useAnimationPreferences() {
  const [{ animationsEnabled }] = usePreferences();
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
