'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { memo, ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();

  // Skip animation for reduced motion preference or disabled animations
  if (!shouldAnimate || prefersReducedMotion) {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: 'tween',
        ease: 'easeOut',
        duration: 0.2,
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(PageTransition);
