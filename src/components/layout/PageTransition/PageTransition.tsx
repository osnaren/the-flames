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

  // Preserve the child tree when preferences hydrate or change during play.
  const animateTransition = shouldAnimate && !prefersReducedMotion && transitionSpeed !== 'instant';

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
        initial={animateTransition ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={animateTransition ? { opacity: 0, y: -8 } : undefined}
        transition={{
          type: 'tween',
          ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoother feel
          duration: animateTransition ? duration : 0,
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
