'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { TRANSITION_DURATIONS, usePreferencesStore } from '@/store/usePreferencesStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { memo, ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const transitionSpeed = usePreferencesStore((state) => state.transitionSpeed);

  // Get duration from settings
  const duration = TRANSITION_DURATIONS[transitionSpeed];

  // Skip animation for reduced motion preference, disabled animations, or instant speed
  if (!shouldAnimate || prefersReducedMotion || transitionSpeed === 'instant') {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          type: 'tween',
          ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoother feel
          duration,
        }}
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(PageTransition);
