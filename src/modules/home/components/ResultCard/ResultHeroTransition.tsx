'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion } from 'framer-motion';
import { memo, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils';
import type { NonNullFlamesResult } from '../../types';
import { ResultIcon } from './ResultIcon';
import { HERO_TRANSITION_TIMING, RESULT_COLORS, RESULT_GRADIENTS, RESULT_LABELS } from './resultCard.constants';

interface ResultHeroTransitionProps {
  result: NonNullFlamesResult;
  onTransitionComplete: () => void;
}

/**
 * Hero transition component that displays the result icon in a large,
 * dramatic reveal before shrinking into the result card.
 *
 * Animation sequence:
 * 1. Icon appears large (2x normal size) with glow burst
 * 2. Pulsing glow effect for dramatic reveal
 * 3. Icon shrinks while calling onTransitionComplete
 */
function ResultHeroTransition({ result, onTransitionComplete }: ResultHeroTransitionProps) {
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const [isShrinking, setIsShrinking] = useState(false);

  const gradient = RESULT_GRADIENTS[result];
  const colors = RESULT_COLORS[result];
  const label = RESULT_LABELS[result];

  // Pre-calculate particle positions to avoid Math.random during render
  const particleOffsets = useMemo(
    () =>
      [...Array(12)].map((_, i) => ({
        x: Math.cos((i * 30 * Math.PI) / 180) * (150 + ((i * 7) % 100)), // Deterministic spread
        y: Math.sin((i * 30 * Math.PI) / 180) * (150 + ((i * 11) % 100)),
        delay: i * 0.03,
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsShrinking(true), HERO_TRANSITION_TIMING.BURST_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const glowIntensity = isShrinking ? 0.6 : 1;

  return createPortal(
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
      data-result-hero
      initial={{ opacity: 0 }}
      animate={{ opacity: isShrinking ? 0 : 1 }}
      transition={{ duration: isShrinking ? HERO_TRANSITION_TIMING.SHRINK_DURATION : 0.16 }}
    >
      {/* Backdrop with radial glow */}
      <motion.div
        className={cn('absolute inset-0 bg-black/20', !compactDevice && 'backdrop-blur-sm')}
        initial={{ opacity: 0 }}
        animate={{ opacity: isShrinking ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Central glow burst */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.primary}80 0%, transparent 70%)`,
          width: 'min(100vw, 48rem)',
          height: 'min(100vh, 48rem)',
        }}
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{
          scale: isShrinking ? 0.85 : 1,
          opacity: isShrinking ? 0 : 0.4,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      />

      {/* Pulsing ring effects */}
      {!isShrinking && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{ width: 400, height: 400, borderWidth: 4, borderStyle: 'solid', borderColor: colors.primary }}
            initial={{ scale: 0.375, opacity: 0.8 }}
            animate={{
              scale: [0.375, 1],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ width: 350, height: 350, borderWidth: 2, borderStyle: 'solid', borderColor: colors.secondary }}
            initial={{ scale: 150 / 350, opacity: 0.6 }}
            animate={{
              scale: [150 / 350, 1],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: 0.1,
            }}
          />
        </>
      )}

      {/* Main icon container */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: isShrinking ? 1 : 1.8,
          rotate: 0,
        }}
        transition={
          isShrinking
            ? { duration: HERO_TRANSITION_TIMING.SHRINK_DURATION, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 240, damping: 17 }
        }
        onAnimationComplete={() => {
          if (isShrinking) onTransitionComplete();
        }}
      >
        {/* Outer glow container */}
        <div
          className={cn(
            'relative h-40 w-40 rounded-full p-1 sm:h-48 sm:w-48',
            'bg-linear-to-br shadow-2xl',
            gradient.from,
            gradient.to
          )}
        >
          {/* Intense outer glow */}
          <motion.div
            className={cn(
              'absolute -inset-8 rounded-full',
              !compactDevice && 'bg-linear-to-br blur-2xl',
              !compactDevice && gradient.from,
              !compactDevice && gradient.to
            )}
            style={
              compactDevice
                ? { background: `radial-gradient(circle, ${colors.primary}a0, transparent 72%)` }
                : undefined
            }
            animate={{
              opacity: [0.4 * glowIntensity, 0.8 * glowIntensity, 0.4 * glowIntensity],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: 0,
              ease: 'easeInOut',
            }}
          />

          {!compactDevice && (
            <motion.div
              className={cn(
                'absolute -inset-4 rounded-full bg-linear-to-br opacity-60 blur-xl',
                gradient.from,
                gradient.to
              )}
              animate={{ opacity: [0.3 * glowIntensity, 0.6 * glowIntensity, 0.3 * glowIntensity] }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          )}

          {/* Pulsing border ring */}
          <motion.div
            className="absolute -inset-2 rounded-full border-4 border-white/50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: 0,
              ease: 'easeInOut',
            }}
          />

          {/* Icon container */}
          <div
            className={cn(
              'relative flex h-full w-full items-center justify-center rounded-full bg-white/30',
              !compactDevice && 'backdrop-blur-sm'
            )}
          >
            <ResultIcon result={result} className="h-24 w-24 object-contain drop-shadow-2xl sm:h-28 sm:w-28" />
          </div>
        </div>

        {/* Result label below icon during burst */}
        {!isShrinking && (
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.24 }}
          >
            <span
              className={cn(
                'text-3xl font-bold tracking-wide whitespace-nowrap sm:text-4xl',
                'bg-clip-text text-transparent drop-shadow-lg',
                gradient.text
              )}
            >
              {label.toUpperCase()}!
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Sparkle particles during burst */}
      {!isShrinking && (
        <div className="absolute inset-0 overflow-hidden">
          {particleOffsets.map((particle, i) => (
            <motion.div
              key={i}
              className={cn('absolute h-2 w-2 rounded-full', 'bg-white')}
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>,
    document.body
  );
}

export default memo(ResultHeroTransition);
