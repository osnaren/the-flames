import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** Keep ambient tutorial effects off the mobile interaction path. */
export function useGuideMotion() {
  const { shouldAnimate } = useAnimationPreferences();
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  return { shouldAnimate: shouldAnimate && !compactDevice };
}
