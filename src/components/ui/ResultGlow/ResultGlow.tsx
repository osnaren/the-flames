import { FlamesResult } from '@features/flamesGame/flames.types';
import { getResultData } from '@features/flamesGame/resultData';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useMemo, useState } from 'react';

interface ResultGlowProps {
  result: FlamesResult;
  isVisible: boolean;
}

/**
 * A dynamic radial glow background that changes based on the FLAMES result
 * Optimized with better performance and visual consistency
 */
function ResultGlow({ result, isVisible }: ResultGlowProps) {
  const [isVisibleState, setIsVisibleState] = useState(false);
  const { shouldAnimate } = useAnimationPreferences();

  useEffect(() => {
    // Synchronize visibility with parent component
    if (!shouldAnimate) {
      setIsVisibleState(false);
      return;
    }

    // Use setTimeout to ensure proper transition when visibility changes
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisibleState(true);
      }, 100); // Small delay for smoother entrance
      return () => clearTimeout(timer);
    } else {
      setIsVisibleState(false);
    }
  }, [isVisible, shouldAnimate]);

  // Get the appropriate colors based on the result
  const visualConfig = useMemo(() => {
    return getResultData(result);
  }, [result]);

  // Extract colors from visual config
  const glowColor = visualConfig.glowColor;
  const accessibilityLabel = visualConfig.accessibilityLabel;

  // Get custom color variables for the result from CSS variables
  const resultKey =
    result && visualConfig
      ? visualConfig.color.includes('--md-color')
        ? visualConfig.color
        : `var(--md-color-${result.toLowerCase()}-container)`
      : 'var(--md-color-primary-container)';

  // No animations, return an enhanced static glow with proper colors
  if (!shouldAnimate) {
    return isVisibleState ? (
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-xl opacity-80 dark:opacity-60"
        style={{
          background: `radial-gradient(circle at center, ${resultKey || glowColor} 0%, transparent 70%)`,
          boxShadow: `0 0 40px 8px ${resultKey || glowColor}`,
        }}
        aria-hidden="true"
        role="presentation"
      />
    ) : null;
  }

  // With animations, return the enhanced animated glow effect
  return (
    <AnimatePresence mode="wait">
      {isVisibleState && (
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          aria-hidden="true"
          role="presentation"
          aria-label={accessibilityLabel}
        >
          {/* Primary central glow - using theme-specific colors */}
          <motion.div
            className="absolute inset-0 dark:opacity-90"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(25px)',
            }}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{
              scale: [0.9, 1.05, 1],
              opacity: [0.5, 0.9, 0.8],
            }}
            transition={{
              duration: 3,
              times: [0, 0.7, 1],
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />

          {/* Secondary offset glow - positioned to better complement the primary glow */}
          <motion.div
            className="absolute inset-0 dark:opacity-90"
            style={{
              background: `radial-gradient(circle at 30% 70%, ${glowColor} 0%, transparent 55%)`,
              filter: 'blur(20px)',
            }}
            initial={{ scale: 1.1, opacity: 0.3 }}
            animate={{
              scale: [1.1, 1, 1.15],
              opacity: [0.5, 0.7, 0.5],
              x: [0, 10, -10, 0],
              y: [0, -10, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />

          {/* Accent glow particles - positioned precisely to avoid clustering */}
          <motion.div
            className="absolute h-32 w-32 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(8px)',
              left: '15%',
              top: '20%',
            }}
            animate={{
              x: ['0%', '5%', '-5%', '0%'],
              y: ['0%', '-5%', '5%', '0%'],
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />

          <motion.div
            className="absolute h-24 w-24 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(6px)',
              right: '15%',
              top: '25%',
            }}
            animate={{
              x: ['0%', '-5%', '5%', '0%'],
              y: ['0%', '-5%', '3%', '0%'],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.5,
            }}
          />

          {/* Additional subtle accent for more depth in the bottom part */}
          <motion.div
            className="absolute h-20 w-20 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(5px)',
              left: '25%',
              bottom: '15%',
            }}
            animate={{
              x: ['0%', '8%', '-3%', '0%'],
              y: ['0%', '5%', '-5%', '0%'],
              opacity: [0.25, 0.5, 0.25],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ResultGlow);
