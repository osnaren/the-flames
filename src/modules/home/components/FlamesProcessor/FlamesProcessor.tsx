import { useGameIntegration } from '@/hooks/useGameIntegration';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTimers } from '@/hooks/useTimers';
import { motion, Variants } from 'framer-motion';
import { memo, useEffect, useEffectEvent, useMemo, useRef, useState, type CSSProperties } from 'react';
import { FLAMES_DATA, PROCESSOR_TIMING } from '../../constants';
import type { FlamesResult, NonNullFlamesResult } from '../../types';
import { getFlamesRounds } from '../../utils';

interface FlamesProcessorProps {
  name1: string;
  name2: string;
  remainingCount: number;
  result: FlamesResult;
  onPrepareResult: (result: NonNullFlamesResult) => void;
  onComplete: (skipAnimation?: boolean) => void;
  shouldAnimate: boolean;
}

type ProcessingPhase = 'names-reveal' | 'striking' | 'counting' | 'result-reveal';

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.16 },
  },
};

const NameLetters = memo(function NameLetters({
  label,
  letters,
  matches,
  struck,
  delay,
}: {
  label: string;
  letters: string[];
  matches: Set<number>;
  struck: boolean;
  delay: number;
}) {
  const stagger = Math.min(0.05, 0.42 / Math.max(letters.length - 1, 1));
  let strikeOrder = 0;

  return (
    <div className="text-center">
      <div className="text-on-surface-variant mb-2 text-xs font-semibold tracking-wider uppercase">{label}</div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {letters.map((letter, index) => {
          const isCommon = matches.has(index);
          const isStruck = struck && isCommon;
          const order = isCommon ? strikeOrder++ : 0;
          if (letter === ' ') return <span key={index} className="w-2" aria-hidden="true" />;

          return (
            <div
              key={index}
              className="motion-rise"
              style={
                {
                  '--rise-delay': `${delay + index * stagger}s`,
                  '--rise-duration': '0.35s',
                  '--rise-distance': '10px',
                } as CSSProperties
              }
            >
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-[transform,background-color,color] duration-300 ease-out md:h-12 md:w-12 md:text-xl ${
                  isStruck
                    ? 'scale-90 bg-red-100 text-red-400 dark:bg-red-900/30 dark:text-red-400'
                    : isCommon
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                }`}
                style={{ transitionDelay: isStruck ? `${order * 60}ms` : '0ms' }}
              >
                {letter.toUpperCase()}
                {isStruck && (
                  <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <span
                      className="motion-grow-x absolute h-0.5 w-full rotate-45 bg-red-500"
                      style={{ '--grow-duration': '0.22s', '--grow-delay': `${order * 0.06}s` } as CSSProperties}
                    />
                    <span
                      className="motion-grow-x absolute h-0.5 w-full -rotate-45 bg-red-500"
                      style={{ '--grow-duration': '0.22s', '--grow-delay': `${order * 0.06 + 0.08}s` } as CSSProperties}
                    />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const PHASES: { id: ProcessingPhase; label: string }[] = [
  { id: 'names-reveal', label: 'Names' },
  { id: 'striking', label: 'Strike' },
  { id: 'counting', label: 'Count' },
  { id: 'result-reveal', label: 'Reveal' },
];

const PhaseSteps = memo(function PhaseSteps({ phase }: { phase: ProcessingPhase }) {
  const current = PHASES.findIndex((item) => item.id === phase);
  return (
    <ol className="mx-auto flex max-w-xs items-center justify-between gap-1" aria-label="Calculation progress">
      {PHASES.map((item, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={item.id} className="flex flex-1 items-center gap-1 last:flex-none">
            <span className="flex flex-col items-center gap-1">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-[transform,background-color,color] duration-300 ${
                  active
                    ? 'scale-110 bg-linear-to-br from-pink-500 to-purple-500 text-white shadow-md shadow-pink-500/30'
                    : done
                      ? 'bg-pink-500/15 text-pink-500'
                      : 'bg-surface-container-high text-on-surface-variant'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                {done ? '✓' : index + 1}
              </span>
              <span
                className={`text-[10px] font-medium tracking-wide uppercase ${active ? 'text-on-surface' : 'text-on-surface-variant/70'}`}
              >
                {item.label}
              </span>
            </span>
            {index < PHASES.length - 1 && (
              <span className="bg-surface-container-high relative mb-4 h-0.5 flex-1 overflow-hidden rounded-full">
                <span
                  className="absolute inset-0 origin-left bg-linear-to-r from-pink-500 to-purple-500 transition-transform duration-500 ease-out"
                  style={{ transform: `scaleX(${done ? 1 : 0})` }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
});

function FlamesProcessorComponent({
  name1,
  name2,
  remainingCount,
  result,
  onPrepareResult,
  onComplete,
  shouldAnimate,
}: FlamesProcessorProps) {
  const { letterStrike, flamesCounting, resultReveal, uiInteraction } = useGameIntegration();
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const { addTimeout, clearAll } = useTimers();
  const [phase, setPhase] = useState<ProcessingPhase>('names-reveal');
  const [struck, setStruck] = useState(false);
  const [activeLetter, setActiveLetter] = useState<NonNullFlamesResult | null>(null);
  const [eliminated, setEliminated] = useState<NonNullFlamesResult[]>([]);
  const [showSkip, setShowSkip] = useState(false);
  const [countDisplay, setCountDisplay] = useState(0);
  const hasRevealedRef = useRef(false);

  const firstLetters = useMemo(() => [...name1], [name1]);
  const secondLetters = useMemo(() => [...name2], [name2]);
  const { firstMatches, secondMatches } = useMemo(() => {
    const firstMatches = new Set<number>();
    const secondMatches = new Set<number>();
    firstLetters.forEach((letter, index) => {
      if (!/\p{L}/u.test(letter)) return;
      const matchingIndex = secondLetters.findIndex(
        (other, otherIndex) => other.toLowerCase() === letter.toLowerCase() && !secondMatches.has(otherIndex)
      );
      if (matchingIndex !== -1) {
        firstMatches.add(index);
        secondMatches.add(matchingIndex);
      }
    });
    return { firstMatches, secondMatches };
  }, [firstLetters, secondLetters]);

  const playStrike = useEffectEvent(() => void letterStrike(0, 1));
  const playCount = useEffectEvent((count: number) => void flamesCounting(count, remainingCount));
  const finish = useEffectEvent(onComplete);
  const playResult = useEffectEvent(() => {
    if (result && !hasRevealedRef.current) {
      hasRevealedRef.current = true;
      void resultReveal(result);
    }
  });

  useEffect(() => {
    if (!shouldAnimate) {
      finish();
      return;
    }

    const { rounds } = getFlamesRounds(remainingCount);
    // Warm the result bundle and the single winning icon once the names are onscreen.
    addTimeout(() => {
      if (result) onPrepareResult(result);
    }, 300);
    addTimeout(() => setShowSkip(true), 1100);

    function revealWinner() {
      setPhase('result-reveal');
      setActiveLetter(result);
      playResult();
      addTimeout(finish, PROCESSOR_TIMING.RESULT_REVEAL);
    }

    function playRound(roundIndex: number) {
      const round = rounds[roundIndex];
      const fastCount = remainingCount > 10;
      const lastCycle = remainingCount - round.letters.length + 1;
      const stepDuration = fastCount ? PROCESSOR_TIMING.FAST_COUNT : PROCESSOR_TIMING.COUNT_PER_LETTER;

      function eliminate() {
        setEliminated((previous) => [...previous, round.eliminated]);
        setActiveLetter(null);
        setCountDisplay(0);
        addTimeout(() => {
          if (roundIndex + 1 === rounds.length) revealWinner();
          else playRound(roundIndex + 1);
        }, PROCESSOR_TIMING.ROUND_PAUSE);
      }

      function countStep(count: number) {
        setActiveLetter(round.letters[(round.start + count - 1) % round.letters.length]);
        setCountDisplay(count);
        playCount(count);
        if (count === remainingCount) {
          addTimeout(eliminate, stepDuration);
        } else {
          // Keep the opening beats and the final lap for large counts. The
          // counter and the active tile both jump to their actual position.
          const next = fastCount && count === 2 ? lastCycle : count + 1;
          addTimeout(() => countStep(next), stepDuration);
        }
      }

      if (remainingCount === 0) {
        setActiveLetter(round.eliminated);
        addTimeout(eliminate, stepDuration);
      } else {
        countStep(1);
      }
    }

    addTimeout(() => {
      setPhase('striking');
      setStruck(true);
      const strikeBeats = Math.min(firstMatches.size * 2, 8);
      for (let beat = 0; beat < strikeBeats; beat++) {
        addTimeout(playStrike, beat * 60);
      }
      addTimeout(() => {
        setPhase('counting');
        addTimeout(() => playRound(0), PROCESSOR_TIMING.COUNT_START);
      }, PROCESSOR_TIMING.STRIKE_DURATION);
    }, PROCESSOR_TIMING.NAMES_REVEAL);

    return clearAll;
  }, [addTimeout, clearAll, firstMatches, onPrepareResult, remainingCount, result, shouldAnimate]);

  const showFlames = phase === 'counting' || phase === 'result-reveal';
  const resultData = FLAMES_DATA.find((item) => item.letter === result);

  if (!shouldAnimate) return null;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="status"
      aria-live="polite"
      aria-label="Processing FLAMES calculation"
    >
      {/* Main processing card */}
      <div
        className={`relative overflow-hidden rounded-3xl border border-white/20 p-5 shadow-2xl sm:p-6 md:p-8 dark:border-white/10 ${
          compactDevice ? 'bg-surface-container' : 'bg-white/80 backdrop-blur-xl dark:bg-black/40'
        }`}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5" />

        {/* Content */}
        <div className="relative space-y-6 md:space-y-7">
          <PhaseSteps phase={phase} />

          {/* Phase heading */}
          <div className="text-center">
            <h3 key={phase} className="motion-rise text-on-surface text-lg font-bold md:text-xl" aria-live="polite">
              {phase === 'names-reveal' && '✨ Analyzing names...'}
              {phase === 'striking' && '❌ Removing common letters...'}
              {phase === 'counting' && (
                <span>
                  🔢 Counting to {remainingCount}
                  <span className="text-primary ml-1.5 inline-block min-w-[3ch] text-left tabular-nums">
                    {countDisplay > 0 ? `(${countDisplay})` : ''}
                  </span>
                </span>
              )}
              {phase === 'result-reveal' && '🎉 Your result is ready!'}
            </h3>
          </div>

          {/* Names with letters */}
          <div className="space-y-3 md:space-y-4">
            <NameLetters label="First Name" letters={firstLetters} matches={firstMatches} struck={struck} delay={0} />

            {/* Heart connector */}
            <div className="flex justify-center" aria-hidden="true">
              <span
                className={`inline-block text-3xl ${phase === 'result-reveal' ? 'motion-pulse' : ''}`}
                style={{ '--pulse-scale': '1.3', '--pulse-duration': '0.6s' } as CSSProperties}
              >
                💕
              </span>
            </div>

            <NameLetters
              label="Second Name"
              letters={secondLetters}
              matches={secondMatches}
              struck={struck}
              delay={0.22}
            />
          </div>

          {/* Remaining count badge */}
          <div className="flex min-h-9 justify-center">
            <div
              className="rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-[opacity,transform] duration-300 ease-out"
              style={{ opacity: showFlames ? 1 : 0, transform: showFlames ? 'none' : 'translateY(10px)' }}
              aria-hidden={!showFlames}
            >
              {remainingCount} remaining {remainingCount === 1 ? 'letter' : 'letters'}
            </div>
          </div>

          {/* FLAMES letters */}
          <div
            className="transition-[opacity,transform] duration-300 ease-out"
            style={{
              opacity: showFlames ? 1 : 0,
              transform: showFlames ? 'none' : 'translateY(12px)',
              visibility: showFlames ? 'visible' : 'hidden',
            }}
            aria-hidden={!showFlames}
          >
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {FLAMES_DATA.map((item, idx) => {
                const isActive = activeLetter === item.letter;
                const isEliminated = eliminated.includes(item.letter);
                const isResult = isActive && phase === 'result-reveal';
                const scale = isResult ? 1.2 : isEliminated ? 0.8 : isActive ? 1.08 : 1;

                return (
                  <div
                    key={item.letter}
                    className="relative transition-[opacity,transform] duration-200 ease-out"
                    style={{
                      opacity: isEliminated ? 0.3 : 1,
                      transform: `scale(${scale})`,
                      transitionDelay: showFlames && !isActive && !isEliminated ? `${idx * 35}ms` : '0ms',
                      zIndex: isResult ? 1 : undefined,
                    }}
                  >
                    {/* Result glow (radial gradient, no blur filter) */}
                    {isResult && (
                      <span
                        aria-hidden="true"
                        className="motion-pulse absolute -inset-5 -z-10 rounded-full"
                        style={
                          {
                            backgroundImage: `radial-gradient(circle, ${item.glow}, transparent 70%)`,
                            '--pulse-scale': '1.15',
                            '--pulse-duration': '1.4s',
                          } as CSSProperties
                        }
                      />
                    )}

                    <div
                      className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 font-bold transition-colors duration-150 md:h-16 md:w-16 ${
                        isResult
                          ? `bg-linear-to-br ${item.color} border-transparent text-white shadow-xl`
                          : isActive
                            ? 'border-primary bg-primary/10 text-primary shadow-md'
                            : isEliminated
                              ? 'border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                              : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <span className="text-xl md:text-2xl">{item.letter}</span>
                      {isResult && <span className="mt-0.5 text-xs">{item.emoji}</span>}
                    </div>

                    {/* Count indicator - shows current count on active letter */}
                    {isActive && !isResult && countDisplay > 0 && (
                      <span
                        key={countDisplay}
                        className="motion-rise absolute -top-3 -right-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-500 px-1 text-xs font-bold text-white tabular-nums shadow-lg"
                        style={{ '--rise-duration': '0.14s', '--rise-distance': '4px' } as CSSProperties}
                      >
                        {countDisplay}
                      </span>
                    )}

                    {/* Eliminated X */}
                    {isEliminated && (
                      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span
                          className="motion-grow-x absolute h-0.5 w-full rotate-45 bg-red-500"
                          style={{ '--grow-duration': '0.18s' } as CSSProperties}
                        />
                        <span
                          className="motion-grow-x absolute h-0.5 w-full -rotate-45 bg-red-500"
                          style={{ '--grow-duration': '0.18s', '--grow-delay': '0.06s' } as CSSProperties}
                        />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Result label */}
            <div className="flex min-h-16 items-center justify-center pt-5">
              {phase === 'result-reveal' && resultData && (
                <div
                  className="motion-rise"
                  style={{ '--rise-duration': '0.3s', '--rise-distance': '10px' } as CSSProperties}
                >
                  <div
                    className={`inline-block rounded-full bg-linear-to-r ${resultData.color} px-6 py-2 text-lg font-bold text-white shadow-lg md:text-xl`}
                  >
                    {resultData.emoji} {resultData.full}!
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skip button */}
          <div className="flex min-h-10 justify-center">
            <button
              onClick={() => {
                clearAll();
                void uiInteraction('click');
                if (result) void resultReveal(result);
                onComplete(true);
              }}
              disabled={!showSkip || phase === 'result-reveal'}
              className="text-on-surface-variant hover:text-on-surface bg-surface-container-high hover:bg-surface-container-highest rounded-full px-4 py-2 text-sm font-medium transition-[opacity,background-color,color] duration-300 disabled:pointer-events-none"
              style={{ opacity: showSkip && phase !== 'result-reveal' ? 1 : 0 }}
              aria-hidden={!showSkip || phase === 'result-reveal'}
              tabIndex={showSkip && phase !== 'result-reveal' ? 0 : -1}
            >
              Skip animation →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const FlamesProcessor = memo(FlamesProcessorComponent);
export default FlamesProcessor;
