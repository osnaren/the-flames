import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { forwardRef, memo, useEffect, useMemo, useState } from 'react';

import ConfettiEffect from '@/components/ui/ConfettiEffect/ConfettiEffect';
import ResultGlow from '@/components/ui/ResultGlow/ResultGlow';
import { cn } from '@/utils';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { useStaggeredAnimation } from '@hooks/useStaggeredAnimation';
import type { FlamesResult, GameStage, NonNullFlamesResult } from '../../types';

import {
  ANIMATION_DELAYS,
  ANIMATION_STAGES,
  RESULT_DESCRIPTIONS,
  RESULT_GRADIENTS,
  RESULT_ICONS,
  RESULT_LABELS,
  RESULT_QUOTES,
} from './resultCard.constants';

interface ResultCardProps {
  result: FlamesResult;
  stage: GameStage;
  name1?: string;
  name2?: string;
  className?: string;
}

/**
 * Enhanced ResultCard component displaying the FLAMES result
 * Uses game assets for result icons and improved animations
 * Ref forwarded for screenshot functionality
 */
const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(function ResultCard(
  { result, stage, name1, name2, className },
  ref
) {
  const { shouldAnimate } = useAnimationPreferences();

  // Use the staggered animation hook
  const { stageCompleted, hasStarted, startAnimation, resetAnimation } = useStaggeredAnimation({
    stages: [...ANIMATION_STAGES],
    delays: ANIMATION_DELAYS,
    shouldAnimate,
  });

  // Track the visible state for the container
  const [isVisible, setIsVisible] = useState(false);

  // Early return if not in result stage or no result
  const isValidResult = stage === 'result' && result !== null;

  // Cast to strict type after null check for type safety
  const strictResult = result as NonNullFlamesResult;

  // Memoized values for the result
  const label = useMemo(() => (result ? RESULT_LABELS[strictResult] : ''), [result, strictResult]);
  const iconSrc = useMemo(() => (result ? RESULT_ICONS[strictResult] : ''), [result, strictResult]);
  const gradient = useMemo(
    () => (result ? RESULT_GRADIENTS[strictResult] : RESULT_GRADIENTS.F),
    [result, strictResult]
  );
  const description = useMemo(
    () => (result ? RESULT_DESCRIPTIONS[strictResult](name1, name2) : ''),
    [result, strictResult, name1, name2]
  );
  const quote = useMemo(() => (result ? RESULT_QUOTES[strictResult] : ''), [result, strictResult]);
  const isResultPositive = result === 'L' || result === 'A' || result === 'M';

  // Start animation when component becomes visible
  useEffect(() => {
    if (isValidResult && !hasStarted) {
      setIsVisible(true);
      startAnimation();
    } else if (!isValidResult) {
      setIsVisible(false);
      resetAnimation();
    }
  }, [isValidResult, hasStarted, startAnimation, resetAnimation]);

  // Don't render if no valid result
  if (!isValidResult) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{
            opacity: stageCompleted.entry ? 1 : 0,
            y: stageCompleted.entry ? 0 : 40,
            scale: stageCompleted.entry ? 1 : 0.95,
          }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            duration: shouldAnimate ? 0.4 : 0,
          }}
          className={cn('relative mx-auto w-full max-w-md will-change-transform', className)}
          role="region"
          aria-live="polite"
          aria-label={`FLAMES Result: ${label}`}
        >
          {/* Result Glow Effect */}
          <ResultGlow result={result} isVisible={stageCompleted.entry} />

          {/* Confetti Effect for positive results */}
          {isResultPositive && stageCompleted.entry && <ConfettiEffect result={result} isActive={true} />}

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
            {/* Animated gradient background */}
            <motion.div
              className={cn('absolute inset-0 bg-linear-to-br opacity-10', gradient.from, gradient.to)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1 }}
            />

            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-linear-to-br from-white/10 to-transparent blur-2xl" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-linear-to-tl from-white/10 to-transparent blur-2xl" />

            {/* Content */}
            <div className="relative p-6 text-center sm:p-8">
              {/* Result Icon from game assets */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: stageCompleted.icon ? 1 : 0,
                  rotate: stageCompleted.icon ? 0 : -180,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  duration: shouldAnimate ? 0.5 : 0,
                }}
                className="mx-auto mb-4 will-change-transform"
              >
                <div
                  className={cn(
                    'relative mx-auto h-24 w-24 rounded-full p-1 sm:h-28 sm:w-28',
                    'bg-linear-to-br shadow-2xl',
                    gradient.from,
                    gradient.to
                  )}
                >
                  {/* Inner glow */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full bg-linear-to-br opacity-50 blur-md',
                      gradient.from,
                      gradient.to
                    )}
                  />

                  {/* Icon container */}
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Image
                      src={iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={64}
                      height={64}
                      className="h-14 w-14 object-contain drop-shadow-lg sm:h-16 sm:w-16"
                      priority
                    />
                    <span className="sr-only">{label} result icon</span>
                  </div>
                </div>
              </motion.div>

              {/* Names display */}
              {name1 && name2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: stageCompleted.names ? 1 : 0,
                    y: stageCompleted.names ? 0 : 10,
                  }}
                  transition={{
                    duration: shouldAnimate ? 0.4 : 0,
                    ease: 'easeOut',
                  }}
                  className="font-space mb-3 flex items-center justify-center gap-3 text-lg font-medium"
                >
                  <span className="text-gray-700 dark:text-gray-200">{name1}</span>
                  <span
                    className={cn('bg-clip-text text-2xl font-bold text-transparent', gradient.text)}
                    aria-hidden="true"
                  >
                    ❤️
                  </span>
                  <span className="sr-only"> and </span>
                  <span className="text-gray-700 dark:text-gray-200">{name2}</span>
                </motion.div>
              )}

              {/* Result Title */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: stageCompleted.title ? 1 : 0,
                  y: stageCompleted.title ? 0 : 15,
                }}
                transition={{
                  duration: shouldAnimate ? 0.4 : 0,
                  ease: 'easeOut',
                }}
                className={cn(
                  'font-heading mb-3 text-4xl font-bold tracking-tight sm:text-5xl',
                  'bg-clip-text text-transparent',
                  gradient.text
                )}
              >
                {label.toUpperCase()}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: stageCompleted.description ? 1 : 0,
                  y: stageCompleted.description ? 0 : 15,
                }}
                transition={{
                  duration: shouldAnimate ? 0.4 : 0,
                  ease: 'easeOut',
                }}
                className="mb-4 text-sm leading-relaxed text-gray-700 sm:text-base dark:text-gray-300"
              >
                {description}
              </motion.p>

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: stageCompleted.quote ? 1 : 0,
                  scale: stageCompleted.quote ? 1 : 0.95,
                }}
                transition={{
                  duration: shouldAnimate ? 0.4 : 0,
                  ease: 'easeOut',
                }}
                className={cn(
                  'rounded-xl border border-white/10 bg-white/5 p-4',
                  'text-sm text-gray-600 italic dark:border-white/5 dark:bg-black/20 dark:text-gray-400',
                  'sm:text-base'
                )}
              >
                &ldquo;{quote}&rdquo;
              </motion.blockquote>

              {/* Watermark for screenshot - hidden during normal view */}
              <div
                id="watermark"
                className="mt-4 hidden items-center justify-center gap-2 text-xs text-gray-400 opacity-0"
              >
                <span>🔥</span>
                <span>flames.game</span>
                <span>🔥</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default memo(ResultCard);
