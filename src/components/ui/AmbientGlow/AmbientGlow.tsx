import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

interface AmbientGlowProps {
  isVisible: boolean;
}

/**
 * Creates a warm, ambient glow background for the form screens
 * Used before the result is revealed
 * Enhanced with more sophisticated and magical ambient effects
 * Memoized to prevent unnecessary re-renders
 */
function AmbientGlow({ isVisible }: AmbientGlowProps) {
  const [isVisibleState, setIsVisibleState] = useState(false);
  const { shouldAnimate } = useAnimationPreferences();

  useEffect(() => {
    // Only show glow if animations are enabled
    if (!shouldAnimate) {
      setIsVisibleState(false);
      return;
    }
    // Set internal visibility based on prop
    setIsVisibleState(isVisible);
  }, [isVisible, shouldAnimate]);

  if (!isVisibleState) return null;

  // Enhanced static glow for when animations are disabled
  if (!shouldAnimate) {
    return (
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-xl opacity-70 dark:opacity-60"
        aria-hidden="true"
        role="presentation"
      >
        {/* Enhanced gradient layers for more depth */}
        <div className="from-primary/25 via-secondary/20 to-tertiary/25 bg-gradient-radial absolute inset-0" />
        <div className="from-primary-container/30 to-error-container/20 absolute inset-0 bg-gradient-to-br" />

        {/* Enhanced central glow */}
        <div
          className="absolute top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            boxShadow: '0 0 80px 30px var(--color-primary-container, rgba(249, 115, 22, 0.25))',
            background:
              'radial-gradient(circle at center, var(--color-primary-container, rgba(249, 115, 22, 0.3)) 0%, transparent 70%)',
          }}
        />

        {/* Secondary glow points */}
        <div
          className="absolute top-1/4 right-1/4 h-[40%] w-[40%] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-secondary-container, rgba(147, 51, 234, 0.2)) 0%, transparent 60%)',
            boxShadow: '0 0 40px 15px var(--color-secondary-container, rgba(147, 51, 234, 0.15))',
          }}
        />
      </div>
    );
  }

  // Enhanced animated ambient glow when animations are enabled
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden rounded-xl"
      aria-hidden="true"
      role="presentation"
      aria-label="Decorative ambient background glow"
    >
      {/* Main flowing gradient background */}
      <motion.div
        className="from-primary/20 via-secondary/15 to-tertiary/20 dark:from-primary/25 dark:via-secondary/20 dark:to-tertiary/25 bg-gradient-radial absolute inset-0"
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Secondary gradient overlay with diagonal movement */}
      <motion.div
        className="from-primary-container/25 to-error-container/20 dark:from-primary-container/30 dark:to-error-container/25 absolute inset-0 bg-gradient-to-br via-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Primary central glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-primary-container, rgba(249, 115, 22, 0.4)) 0%, var(--color-primary-container, rgba(249, 115, 22, 0.2)) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, 10, -5, 15, 0],
          opacity: [0.5, 0.8, 0.6, 0.9, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary floating orb */}
      <motion.div
        className="absolute top-1/4 right-1/3 h-[45%] w-[45%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-secondary-container, rgba(147, 51, 234, 0.3)) 0%, var(--color-secondary-container, rgba(147, 51, 234, 0.15)) 50%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1.1, 1],
          x: [0, 20, -10, 0],
          y: [0, -15, 10, 0],
          opacity: [0.4, 0.7, 0.5, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Tertiary accent orb */}
      <motion.div
        className="absolute bottom-1/3 left-1/4 h-[35%] w-[35%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-tertiary-container, rgba(52, 211, 153, 0.25)) 0%, var(--color-tertiary-container, rgba(52, 211, 153, 0.12)) 60%, transparent 80%)',
        }}
        animate={{
          scale: [1, 1.15, 1.25, 1],
          x: [0, -15, 20, 0],
          y: [0, 10, -20, 0],
          opacity: [0.3, 0.6, 0.4, 0.3],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Floating sparkle effects */}
      <motion.div
        className="absolute top-1/6 left-2/3 h-4 w-4 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-primary, rgba(249, 115, 22, 0.8)) 0%, transparent 70%)',
          boxShadow: '0 0 15px var(--color-primary, rgba(249, 115, 22, 0.6))',
        }}
        animate={{
          scale: [0, 1.2, 0],
          opacity: [0, 1, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute right-1/6 bottom-1/4 h-3 w-3 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-secondary, rgba(147, 51, 234, 0.9)) 0%, transparent 70%)',
          boxShadow: '0 0 12px var(--color-secondary, rgba(147, 51, 234, 0.7))',
        }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          x: [0, 25, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 2.5,
        }}
      />

      <motion.div
        className="absolute top-2/3 left-1/6 h-2 w-2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-tertiary, rgba(52, 211, 153, 1)) 0%, transparent 70%)',
          boxShadow: '0 0 8px var(--color-tertiary, rgba(52, 211, 153, 0.8))',
        }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 0.9, 0],
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 4,
        }}
      />

      {/* Subtle pulsing rim light */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          border: '1px solid transparent',
          background: `
            linear-gradient(var(--md-color-surface), var(--md-color-surface)) padding-box,
            linear-gradient(45deg, 
              var(--color-primary-container, rgba(249, 115, 22, 0.3)), 
              var(--color-secondary-container, rgba(147, 51, 234, 0.2)), 
              var(--color-tertiary-container, rgba(52, 211, 153, 0.2))
            ) border-box
          `,
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AmbientGlow);
