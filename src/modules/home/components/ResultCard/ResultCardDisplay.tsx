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
  getRandomResultContent,
  RESULT_GRADIENTS,
  RESULT_ICONS,
  RESULT_LABELS,
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

  // Get random description and quote based on result and names
  // Uses name combination as seed for consistent results per pair during the session
  const { description, quote } = useMemo(
    () => (result ? getRandomResultContent(strictResult, name1, name2) : { description: '', quote: '' }),
    [result, strictResult, name1, name2]
  );

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
              className={cn('absolute inset-0 bg-linear-to-br opacity-15', gradient.from, gradient.to)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1 }}
            />

            {/* Secondary diagonal gradient for depth */}
            <motion.div
              className={cn('absolute inset-0 bg-linear-to-tr opacity-10', gradient.to, gradient.from)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />

            {/* Decorative corner elements */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-linear-to-br from-white/15 to-transparent blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-linear-to-tl from-white/15 to-transparent blur-3xl" />

            {/* Subtle shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            />

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
                className="mx-auto mb-5 will-change-transform"
              >
                <div
                  className={cn(
                    'relative mx-auto h-28 w-28 rounded-full p-1 sm:h-32 sm:w-32',
                    'bg-linear-to-br shadow-2xl',
                    gradient.from,
                    gradient.to
                  )}
                >
                  {/* Outer glow ring */}
                  <div
                    className={cn(
                      'absolute -inset-2 rounded-full bg-linear-to-br opacity-40 blur-lg',
                      gradient.from,
                      gradient.to
                    )}
                  />

                  {/* Inner glow */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full bg-linear-to-br opacity-60 blur-md',
                      gradient.from,
                      gradient.to
                    )}
                  />

                  {/* Pulsing ring animation */}
                  <motion.div
                    className={cn('absolute -inset-1 rounded-full border-2 opacity-30', `border-current`)}
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ color: 'white' }}
                  />

                  {/* Icon container */}
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
                    <Image
                      src={iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={72}
                      height={72}
                      className="h-16 w-16 object-contain drop-shadow-lg sm:h-18 sm:w-18"
                      priority
                    />
                    <span className="sr-only">{label} result icon</span>
                  </div>
                </div>
              </motion.div>

              {/* Names display with enhanced styling */}
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
                  className="mb-4 flex items-center justify-center gap-3"
                >
                  <span className="font-space rounded-lg bg-white/10 px-3 py-1.5 text-lg font-semibold text-gray-700 backdrop-blur-sm dark:bg-white/5 dark:text-gray-100">
                    {name1}
                  </span>
                  <motion.span
                    className="text-2xl"
                    animate={shouldAnimate ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                    aria-hidden="true"
                  >
                    💕
                  </motion.span>
                  <span className="sr-only"> and </span>
                  <span className="font-space rounded-lg bg-white/10 px-3 py-1.5 text-lg font-semibold text-gray-700 backdrop-blur-sm dark:bg-white/5 dark:text-gray-100">
                    {name2}
                  </span>
                </motion.div>
              )}

              {/* Result Title with enhanced gradient */}
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
                  'font-heading mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl',
                  'bg-clip-text text-transparent drop-shadow-sm',
                  gradient.text
                )}
              >
                {label.toUpperCase()}
              </motion.h2>

              {/* Decorative divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: stageCompleted.title ? 1 : 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={cn('mx-auto mb-4 h-0.5 w-24 rounded-full bg-linear-to-r', gradient.from, gradient.to)}
              />

              {/* Description with enhanced styling */}
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
                className="mb-5 text-sm leading-relaxed font-medium text-gray-700 sm:text-base dark:text-gray-200"
              >
                {description}
              </motion.p>

              {/* Quote with enhanced card styling */}
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
                  'relative rounded-2xl border border-white/15 bg-white/8 p-5',
                  'text-sm text-gray-600 italic dark:border-white/10 dark:bg-black/25 dark:text-gray-300',
                  'sm:text-base',
                  'before:text-muted-foreground before:absolute before:top-3 before:left-4 before:text-3xl before:content-[open-quote]',
                  'after:text-muted-foreground after:absolute after:right-4 after:bottom-2 after:text-3xl after:content-[close-quote]'
                )}
              >
                <span className="relative z-10">{quote}</span>
              </motion.blockquote>

              {/* Watermark for screenshot - hidden during normal view */}
              <div
                id="watermark"
                className="mt-4 hidden items-center justify-center gap-2 text-xs text-gray-400 opacity-0"
              >
                <span>🔥</span>
                <span>theflames.app</span>
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
