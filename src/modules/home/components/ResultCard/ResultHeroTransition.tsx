'use client';

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils';
import type { NonNullFlamesResult } from '../../types';
import { ResultIcon } from './ResultIcon';
import { HERO_TRANSITION_TIMING, RESULT_COLORS, RESULT_GRADIENTS, RESULT_LABELS } from './resultCard.constants';

interface ResultHeroTransitionProps {
  result: NonNullFlamesResult;
  onTransitionComplete: () => void;
  /** Fired when the hero starts leaving, so the card can cross-dissolve in. */
  onExitStart?: () => void;
}

const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  const distance = 140 + ((i * 7) % 90);
  return {
    x: `${Math.round(Math.cos(angle) * distance)}px`,
    y: `${Math.round(Math.sin(angle) * distance)}px`,
    delay: `${0.12 + i * 0.025}s`,
    size: i % 3 === 0 ? 10 : 6,
  };
});

/**
 * Full-screen result reveal shown before the result card.
 *
 * Every moving part is a CSS keyframe on transform/opacity (see
 * styles/result-motion.css), so the whole sequence runs on the compositor and
 * stays smooth on phones even while React mounts the result card underneath.
 * The icon is rendered at its largest on-screen size and only ever scaled
 * down, so it is rasterised once and stays crisp.
 */
function ResultHeroTransition({ result, onTransitionComplete, onExitStart }: ResultHeroTransitionProps) {
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  const gradient = RESULT_GRADIENTS[result];
  const colors = RESULT_COLORS[result];
  const label = RESULT_LABELS[result];

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onTransitionComplete();
  }, [onTransitionComplete]);

  const exitStartRef = useRef(onExitStart);
  useEffect(() => {
    exitStartRef.current = onExitStart;
  }, [onExitStart]);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      exitStartRef.current?.();
    }, HERO_TRANSITION_TIMING.BURST_DURATION);
    // Safety net: complete even if animationend never fires (hidden tab, reduced motion).
    const doneTimer = setTimeout(
      complete,
      HERO_TRANSITION_TIMING.BURST_DURATION + HERO_TRANSITION_TIMING.EXIT_DURATION + 250
    );
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [complete]);

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden',
        isExiting && 'hero-exiting'
      )}
      aria-hidden="true"
      data-result-hero
    >
      {/* Backdrop */}
      <div className="hero-backdrop absolute inset-0 bg-black/30" />

      {/* Central colour burst */}
      <div
        className="hero-burst absolute rounded-full"
        style={{
          width: 'min(110vw, 52rem)',
          height: 'min(110vw, 52rem)',
          backgroundImage: `radial-gradient(circle, ${colors.primary}cc 0%, ${colors.secondary}55 35%, transparent 70%)`,
        }}
      />

      <div
        className="hero-stage relative flex flex-col items-center"
        onAnimationEnd={(event) => {
          if (isExiting && event.target === event.currentTarget) complete();
        }}
      >
        {/* Expanding rings */}
        <div
          className="hero-ring absolute top-1/2 left-1/2 -mt-[11rem] -ml-[11rem] h-[22rem] w-[22rem] rounded-full border-4"
          style={{ borderColor: colors.primary }}
        />
        <div
          className="hero-ring absolute top-1/2 left-1/2 -mt-[9rem] -ml-[9rem] h-[18rem] w-[18rem] rounded-full border-2"
          style={{ borderColor: colors.secondary, '--ring-delay': '0.12s' } as CSSProperties}
        />

        {/* Sparks */}
        {SPARKS.map((spark, i) => (
          <span
            key={i}
            className="hero-spark absolute top-1/2 left-1/2 rounded-full bg-white"
            style={
              {
                width: spark.size,
                height: spark.size,
                marginLeft: -spark.size / 2,
                marginTop: -spark.size / 2,
                '--spark-x': spark.x,
                '--spark-y': spark.y,
                '--spark-delay': spark.delay,
                boxShadow: `0 0 12px ${colors.primary}`,
              } as CSSProperties
            }
          />
        ))}

        {/* Icon */}
        <div className="hero-icon relative h-56 w-56 sm:h-72 sm:w-72">
          {/* Breathing glow (gradient, not a blur filter) */}
          <div
            className="hero-glow absolute -inset-10 rounded-full"
            style={{ backgroundImage: `radial-gradient(circle, ${colors.primary}aa 0%, transparent 68%)` }}
          />
          <div
            className={cn(
              'relative h-full w-full rounded-full bg-linear-to-br p-1.5 shadow-2xl',
              gradient.from,
              gradient.to
            )}
          >
            <div className="absolute -inset-2 rounded-full border-4 border-white/50" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white/25">
              <ResultIcon result={result} className="h-36 w-36 object-contain sm:h-44 sm:w-44" />
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="hero-label mt-8">
          <span
            className="font-heading text-4xl font-bold tracking-wide whitespace-nowrap sm:text-5xl"
            style={{
              backgroundImage: `linear-gradient(to right, #fff, ${colors.primary} 40%, ${colors.secondary})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {label.toUpperCase()}!
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default memo(ResultHeroTransition);
