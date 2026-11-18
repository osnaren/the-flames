import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion } from 'framer-motion';
import { forwardRef, memo, useMemo, useState } from 'react';

import ConfettiEffect from '@/components/ui/ConfettiEffect/ConfettiEffect';
import ResultGlow from '@/components/ui/ResultGlow/ResultGlow';
import { cn } from '@/utils';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import type { FlamesResult, GameStage } from '../../types';
import { ResultIcon } from './ResultIcon';

import { getRandomResultContent, RESULT_COLORS, RESULT_GRADIENTS, RESULT_LABELS } from './resultCard.constants';

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
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const animateDecorations = shouldAnimate && !compactDevice;

  const [entryFinished, setEntryFinished] = useState(false);
  const content = useMemo(() => (result ? getRandomResultContent(result, name1, name2) : null), [result, name1, name2]);

  if (stage !== 'result' || !result || !content) return null;

  const label = RESULT_LABELS[result];
  const gradient = RESULT_GRADIENTS[result];
  const { description, quote } = content;
  const isResultPositive = result === 'L' || result === 'A' || result === 'M';

  return (
    <motion.div
      ref={ref}
      initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: shouldAnimate ? 0.24 : 0, ease: 'easeOut' }}
      onAnimationComplete={() => setEntryFinished(true)}
      className={cn('relative mx-auto w-full max-w-md', className)}
      role="region"
      aria-live="polite"
      aria-label={`FLAMES Result: ${label}`}
    >
      {!compactDevice && <ResultGlow result={result} isVisible={true} />}
      {shouldAnimate && isResultPositive && entryFinished && <ConfettiEffect result={result} isActive={true} />}

      {/* Main Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl dark:border-white/10',
          compactDevice ? 'bg-surface-container' : 'bg-white/10 backdrop-blur-xl dark:bg-black/30'
        )}
        data-capture-target="card-bg"
      >
        {/* Animated gradient background */}
        <motion.div
          className={cn('absolute inset-0 bg-linear-to-br opacity-15', gradient.from, gradient.to)}
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
        />

        {/* Secondary diagonal gradient for depth */}
        <motion.div
          className={cn('absolute inset-0 bg-linear-to-tr opacity-10', gradient.to, gradient.from)}
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />

        {/* Decorative corner elements */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-linear-to-br from-white/15 to-transparent blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-linear-to-tl from-white/15 to-transparent blur-3xl" />

        {/* Subtle shimmer effect */}
        {animateDecorations && (
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
        )}

        {/* Content */}
        <div className="relative p-6 text-center sm:p-8">
          {/* Result Icon from game assets */}
          <div className="mx-auto mb-5">
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
                animate={
                  animateDecorations ? { scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] } : { scale: 1, opacity: 0.3 }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ color: 'white' }}
              />

              {/* Icon container */}
              <div
                className={cn(
                  'relative flex h-full w-full items-center justify-center rounded-full bg-white/25',
                  !compactDevice && 'backdrop-blur-sm'
                )}
              >
                <ResultIcon result={result} className="h-16 w-16 object-contain drop-shadow-lg sm:h-18 sm:w-18" />
              </div>
            </div>
          </div>

          {/* Names display with enhanced styling */}
          {name1 && name2 && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldAnimate ? 0.23 : 0,
                delay: shouldAnimate ? 0.06 : 0,
                ease: 'easeOut',
              }}
              className="mb-4 flex items-center justify-center gap-3"
            >
              <span className="font-space min-w-0 rounded-lg bg-white/10 px-3 py-1.5 text-lg font-semibold wrap-anywhere text-gray-700 backdrop-blur-sm dark:bg-white/5 dark:text-gray-100">
                {name1}
              </span>
              <motion.span
                className="shrink-0 text-2xl"
                animate={animateDecorations ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                aria-hidden="true"
              >
                💕
              </motion.span>
              <span className="sr-only"> and </span>
              <span className="font-space min-w-0 rounded-lg bg-white/10 px-3 py-1.5 text-lg font-semibold wrap-anywhere text-gray-700 backdrop-blur-sm dark:bg-white/5 dark:text-gray-100">
                {name2}
              </span>
            </motion.div>
          )}

          {/* Result Title with enhanced gradient */}
          <motion.h2
            initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldAnimate ? 0.25 : 0, delay: shouldAnimate ? 0.1 : 0, ease: 'easeOut' }}
            className={cn(
              'font-heading mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl',
              'drop-shadow-sm',
              // Use standard text color for better compatibility, gradient applied via style
              'bg-clip-text text-transparent'
            )}
            data-capture-target="result-title"
            data-result-color={RESULT_COLORS[result].primary}
            style={{
              // Explicitly set gradient for html2canvas compatibility
              backgroundImage: `linear-gradient(to right, ${RESULT_COLORS[result].primary}, ${RESULT_COLORS[result].secondary})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              // Ensure it's visible even if bg-clip fails (fallback color)
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            {label.toUpperCase()}
          </motion.h2>

          {/* Decorative divider */}
          <motion.div
            initial={shouldAnimate ? { scaleX: 0 } : false}
            animate={{ scaleX: 1 }}
            transition={{ duration: shouldAnimate ? 0.25 : 0, delay: shouldAnimate ? 0.1 : 0, ease: 'easeOut' }}
            className={cn('mx-auto mb-4 h-0.5 w-24 rounded-full bg-linear-to-r', gradient.from, gradient.to)}
          />

          {/* Description with enhanced styling */}
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldAnimate ? 0.25 : 0, delay: shouldAnimate ? 0.17 : 0, ease: 'easeOut' }}
            className="mb-5 text-sm leading-relaxed font-medium wrap-anywhere text-gray-700 sm:text-base dark:text-gray-200"
          >
            {description}
          </motion.p>

          {/* Quote with enhanced card styling */}
          <motion.blockquote
            initial={shouldAnimate ? { opacity: 0, scale: 0.97 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldAnimate ? 0.25 : 0, delay: shouldAnimate ? 0.24 : 0, ease: 'easeOut' }}
            className={cn(
              'relative rounded-2xl border border-white/15 bg-white/8 p-5',
              'text-sm text-gray-600 italic dark:border-white/10 dark:bg-black/25 dark:text-gray-300',
              'sm:text-base',
              'before:text-muted-foreground before:absolute before:top-3 before:left-4 before:text-3xl before:content-[open-quote]',
              'after:text-muted-foreground after:absolute after:right-4 after:bottom-2 after:text-3xl after:content-[close-quote]'
            )}
          >
            <span className="relative z-10 px-3">{quote}</span>
          </motion.blockquote>

          {/* Watermark for screenshot - hidden during normal view */}
          <div id="watermark" className="mt-4 hidden items-center justify-center gap-2 text-xs text-gray-400 opacity-0">
            <span>🔥</span>
            <span>theflames.app</span>
            <span>🔥</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default memo(ResultCard);
