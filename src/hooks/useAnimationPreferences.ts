import { useEffect, useMemo, useState } from 'react';
import { usePreferences } from './usePreferences';

/**
 * Hook to centralize animation preference logic
 * Combines user preferences with system preferences
 */
export function useAnimationPreferences() {
  const [{ animationsEnabled }] = usePreferences();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

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
