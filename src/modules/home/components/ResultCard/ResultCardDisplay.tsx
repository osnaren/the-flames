import { useMediaQuery } from '@/hooks/useMediaQuery';
import { forwardRef, memo, useMemo, useState, type CSSProperties } from 'react';

import ConfettiEffect from '@/components/ui/ConfettiEffect/ConfettiEffect';
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

const stagger = (delay: number) => ({ '--rise-delay': `${delay}s`, '--rise-distance': '10px' }) as CSSProperties;

/**
 * The FLAMES result card.
 *
 * Entrance and idle motion are CSS animations on transform/opacity; glows are
 * radial gradients rather than blur filters. That keeps the reveal on the
 * compositor, which is what makes it smooth on mid-range phones.
 * Ref forwarded for screenshot functionality.
 */
const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(function ResultCard(
  { result, stage, name1, name2, className },
  ref
) {
  const { shouldAnimate } = useAnimationPreferences();
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');

  const [entryFinished, setEntryFinished] = useState(!shouldAnimate);
  const content = useMemo(() => (result ? getRandomResultContent(result, name1, name2) : null), [result, name1, name2]);

  if (stage !== 'result' || !result || !content) return null;

  const label = RESULT_LABELS[result];
  const gradient = RESULT_GRADIENTS[result];
  const colors = RESULT_COLORS[result];
  const { description, quote } = content;
  const isResultPositive = result === 'L' || result === 'A' || result === 'M';
  const anim = (name: string) => (shouldAnimate ? name : '');

  return (
    <div
      ref={ref}
      className={cn('relative mx-auto w-full max-w-md', anim('result-card-in'), className)}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setEntryFinished(true);
      }}
      role="region"
      aria-live="polite"
      aria-label={`FLAMES Result: ${label}`}
    >
      {/* Ambient glow behind the card */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute -inset-10 -z-10 rounded-full', anim('motion-pulse'))}
        style={
          {
            backgroundImage: `radial-gradient(ellipse at center, ${colors.primary}40 0%, transparent 70%)`,
            '--pulse-scale': '1.06',
            '--pulse-duration': '4s',
          } as CSSProperties
        }
      />
      {shouldAnimate && isResultPositive && entryFinished && <ConfettiEffect result={result} isActive={true} />}

      {/* Main Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl dark:border-white/10',
          compactDevice ? 'bg-surface-container' : 'bg-white/10 backdrop-blur-xl dark:bg-black/30'
        )}
        data-capture-target="card-bg"
      >
        {/* Tinted gradient background */}
        <div className={cn('absolute inset-0 bg-linear-to-br opacity-15', gradient.from, gradient.to)} />
        <div className={cn('absolute inset-0 bg-linear-to-tr opacity-10', gradient.to, gradient.from)} />

        {/* Decorative corner light (gradients, no blur) */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 h-56 w-56 rounded-full"
          style={{ backgroundImage: 'radial-gradient(circle, rgb(255 255 255 / 0.16), transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full"
          style={{ backgroundImage: `radial-gradient(circle, ${colors.secondary}33, transparent 70%)` }}
        />

        {/* Subtle shimmer sweep */}
        {shouldAnimate && (
          <div
            aria-hidden="true"
            className="motion-sweep pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/8 to-transparent"
            style={{ '--sweep-duration': '5.5s', '--sweep-delay': '1.2s' } as CSSProperties}
          />
        )}

        {/* Content */}
        <div className="relative p-6 text-center sm:p-8">
          {/* Result Icon */}
          <div className={cn('relative mx-auto mb-5 h-28 w-28 sm:h-32 sm:w-32', anim('result-icon-in'))}>
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-full"
              style={{ backgroundImage: `radial-gradient(circle, ${colors.primary}80, transparent 70%)` }}
            />
            {shouldAnimate && (
              <span
                aria-hidden="true"
                className="motion-ring absolute -inset-1 rounded-full border-2 border-white/60"
                style={{ '--ring-duration': '2.6s' } as CSSProperties}
              />
            )}
            <div
              className={cn(
                'relative h-full w-full rounded-full bg-linear-to-br p-1 shadow-2xl',
                gradient.from,
                gradient.to
              )}
            >
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white/25">
                <ResultIcon result={result} className="h-16 w-16 object-contain drop-shadow-lg sm:h-18 sm:w-18" />
              </div>
            </div>
          </div>

          {/* Names */}
          {name1 && name2 && (
            <div
              className={cn('mb-4 flex items-center justify-center gap-3', anim('result-stagger'))}
              style={stagger(0.12)}
            >
              <span className="font-space min-w-0 rounded-lg bg-white/10 px-3 py-1.5 text-lg font-semibold wrap-anywhere text-gray-700 dark:bg-white/5 dark:text-gray-100">
                {name1}
              </span>
              <span
                className={cn('inline-block shrink-0 text-2xl', anim('motion-pulse'))}
                style={{ '--pulse-scale': '1.2', '--pulse-duration': '1.6s' } as CSSProperties}
                aria-hidden="true"
              >
                💕
              </span>
              <span className="sr-only"> and </span>
              <span className="font-space min-w-0 rounded-lg bg-white/10 px-3 py-1.5 text-lg font-semibold wrap-anywhere text-gray-700 dark:bg-white/5 dark:text-gray-100">
                {name2}
              </span>
            </div>
          )}

          {/* Result Title */}
          <h2
            className={cn(
              'font-heading mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl',
              'bg-clip-text text-transparent',
              anim('result-stagger')
            )}
            data-capture-target="result-title"
            data-result-color={colors.primary}
            style={{
              ...stagger(0.18),
              // Explicit gradient for html2canvas compatibility
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            {label.toUpperCase()}
          </h2>

          {/* Decorative divider */}
          <div
            className={cn(
              'mx-auto mb-4 h-0.5 w-24 origin-center rounded-full bg-linear-to-r',
              gradient.from,
              gradient.to,
              anim('motion-grow-x')
            )}
            style={{ '--grow-delay': '0.25s', transformOrigin: 'center' } as CSSProperties}
          />

          {/* Description */}
          <p
            className={cn(
              'mb-5 text-sm leading-relaxed font-medium wrap-anywhere text-gray-700 sm:text-base dark:text-gray-200',
              anim('result-stagger')
            )}
            style={stagger(0.26)}
          >
            {description}
          </p>

          {/* Quote */}
          <blockquote
            className={cn(
              'relative rounded-2xl border border-white/15 bg-white/8 p-5',
              'text-sm text-gray-600 italic dark:border-white/10 dark:bg-black/25 dark:text-gray-300',
              'sm:text-base',
              'before:text-muted-foreground before:absolute before:top-3 before:left-4 before:text-3xl before:content-[open-quote]',
              'after:text-muted-foreground after:absolute after:right-4 after:bottom-2 after:text-3xl after:content-[close-quote]',
              anim('result-stagger')
            )}
            style={stagger(0.34)}
          >
            <span className="relative z-10 px-3">{quote}</span>
          </blockquote>

          {/* Watermark for screenshot - hidden during normal view */}
          <div id="watermark" className="mt-4 hidden items-center justify-center gap-2 text-xs text-gray-400 opacity-0">
            <span>🔥</span>
            <span>theflames.app</span>
            <span>🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default memo(ResultCard);
