/**
 * EmptyState Component
 * Displays when no recent matches are available
 */
'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { memo } from 'react';
import type { EmptyStateProps } from './types';

/**
 * Empty state with encouraging message and decorative elements
 */
function EmptyState({ shouldAnimate }: EmptyStateProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  const floatAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <motion.div
      variants={shouldAnimate ? containerVariants : undefined}
      initial={shouldAnimate ? 'hidden' : false}
      animate="visible"
      className="flex flex-col items-center justify-center px-4 py-8 text-center"
      role="status"
      aria-label="No recent matches"
    >
      {/* Decorative icons */}
      <motion.div
        variants={shouldAnimate ? itemVariants : undefined}
        animate={shouldAnimate ? floatAnimation : undefined}
        className="relative mb-4"
      >
        {/* Background glow */}
        <div className="bg-primary/20 absolute inset-0 scale-150 rounded-full blur-xl" />

        {/* Icon stack */}
        <div className="relative flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500/70" aria-hidden="true" />
          <div className="border-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl border bg-linear-to-br from-pink-500/20 to-purple-500/20">
            <Heart className="text-primary/60 h-7 w-7" aria-hidden="true" />
          </div>
          <Sparkles className="h-5 w-5 text-amber-500/70" aria-hidden="true" />
        </div>
      </motion.div>

      {/* Main text */}
      <motion.div variants={shouldAnimate ? itemVariants : undefined}>
        <h4 className="text-on-surface mb-1 text-base font-medium">No matches yet</h4>
        <p className="text-on-surface-variant/70 max-w-60 text-sm">
          Enter two names above to discover your FLAMES connection!
        </p>
      </motion.div>

      {/* Subtle hint */}
      <motion.p
        variants={shouldAnimate ? itemVariants : undefined}
        className="text-on-surface-variant/50 mt-4 flex items-center gap-1 text-xs"
      >
        <span className="text-blue-500">F</span>
        <span className="text-pink-500">L</span>
        <span className="text-amber-500">A</span>
        <span className="text-emerald-500">M</span>
        <span className="text-red-500">E</span>
        <span className="text-purple-500">S</span>
        <span className="ml-1">awaits!</span>
      </motion.p>
    </motion.div>
  );
}

export default memo(EmptyState);
