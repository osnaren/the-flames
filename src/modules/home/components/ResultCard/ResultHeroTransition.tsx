'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useEffect, useMemo, useState } from 'react';

import { cn } from '@/utils';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import type { NonNullFlamesResult } from '../../types';
import { RESULT_COLORS, RESULT_GRADIENTS, RESULT_ICONS, RESULT_LABELS } from './resultCard.constants';

interface ResultHeroTransitionProps {
  result: NonNullFlamesResult;
  isActive: boolean;
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
function ResultHeroTransition({ result, isActive, onTransitionComplete }: ResultHeroTransitionProps) {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const [phase, setPhase] = useState<'hidden' | 'burst' | 'shrinking'>('hidden');

  const gradient = RESULT_GRADIENTS[result];
  const colors = RESULT_COLORS[result];
  const iconSrc = RESULT_ICONS[result];
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

  // Handle the animation sequence
  useEffect(() => {
    if (!isActive) {
      setPhase('hidden');
      return;
    }

    // Skip animation if user prefers reduced motion
    if (!shouldAnimate || prefersReducedMotion) {
      onTransitionComplete();
      return;
    }

    // Small delay to let FlamesProcessor exit animation complete
    const startDelay = setTimeout(() => {
      setPhase('burst');
    }, 200);

    // After burst animation, start shrinking
    const shrinkTimer = setTimeout(() => {
      setPhase('shrinking');
    }, 1000); // 200ms delay + 800ms burst = 1000ms

    // Complete transition after shrink
    const completeTimer = setTimeout(() => {
      onTransitionComplete();
    }, 1600); // Total: 200ms delay + 800ms burst + 600ms shrink = 1600ms

    return () => {
      clearTimeout(startDelay);
      clearTimeout(shrinkTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, shouldAnimate, prefersReducedMotion, onTransitionComplete]);

  // Don't render if not active
  if (!isActive || phase === 'hidden') {
    return null;
  }

  // Determine icon scale based on phase
  const iconScale = phase === 'burst' ? 1.8 : 1;
  const glowIntensity = phase === 'burst' ? 1 : 0.6;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop with radial glow */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'burst' ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Central glow burst */}
        <motion.div
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.primary}80 0%, transparent 70%)`,
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: phase === 'burst' ? '120vw' : '60vw',
            height: phase === 'burst' ? '120vh' : '60vh',
            opacity: phase === 'burst' ? 0.4 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
        />

        {/* Pulsing ring effects */}
        {phase === 'burst' && (
          <>
            <motion.div
              className="absolute rounded-full"
              style={{ borderWidth: 4, borderStyle: 'solid', borderColor: colors.primary }}
              initial={{ width: 150, height: 150, opacity: 0.8 }}
              animate={{
                width: [150, 400],
                height: [150, 400],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ borderWidth: 2, borderStyle: 'solid', borderColor: colors.secondary }}
              initial={{ width: 150, height: 150, opacity: 0.6 }}
              animate={{
                width: [150, 350],
                height: [150, 350],
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
            scale: iconScale,
            rotate: 0,
          }}
          transition={{
            type: 'spring',
            stiffness: phase === 'burst' ? 200 : 300,
            damping: phase === 'burst' ? 15 : 25,
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
              className={cn('absolute -inset-8 rounded-full bg-linear-to-br blur-2xl', gradient.from, gradient.to)}
              animate={{
                opacity: [0.4 * glowIntensity, 0.8 * glowIntensity, 0.4 * glowIntensity],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: phase === 'burst' ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />

            {/* Secondary glow layer */}
            <motion.div
              className={cn(
                'absolute -inset-4 rounded-full bg-linear-to-br opacity-60 blur-xl',
                gradient.from,
                gradient.to
              )}
              animate={{
                opacity: [0.3 * glowIntensity, 0.6 * glowIntensity, 0.3 * glowIntensity],
              }}
              transition={{
                duration: 1,
                repeat: phase === 'burst' ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />

            {/* Pulsing border ring */}
            <motion.div
              className="absolute -inset-2 rounded-full border-4 border-white/50"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: phase === 'burst' ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />

            {/* Icon container */}
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
              <Image
                src={iconSrc}
                alt={label}
                width={120}
                height={120}
                className="h-24 w-24 object-contain drop-shadow-2xl sm:h-28 sm:w-28"
                priority
              />
            </div>
          </div>

          {/* Result label below icon during burst */}
          {phase === 'burst' && (
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
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
        {phase === 'burst' && (
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
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(ResultHeroTransition);
