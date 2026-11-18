import { useGameIntegration } from '@/hooks/useGameIntegration';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTimers } from '@/hooks/useTimers';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { memo, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
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

  return (
    <div className="text-center">
      <div className="mb-2 text-sm font-medium text-gray-500">{label}</div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {letters.map((letter, index) => {
          const isCommon = matches.has(index);
          const isStruck = struck && isCommon;

          return (
            <motion.div
              key={index}
              className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-colors duration-200 md:h-12 md:w-12 md:text-xl ${
                isStruck
                  ? 'bg-red-100 text-red-400 dark:bg-red-900/30 dark:text-red-400'
                  : isCommon
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
              }`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: isStruck ? 0.9 : 1 }}
              transition={{ delay: isStruck ? 0 : delay + index * stagger, duration: isStruck ? 0.2 : 0.3 }}
            >
              {letter.toUpperCase()}
              {isStruck && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute h-0.5 w-full rotate-45 bg-red-500" />
                  <div className="absolute h-0.5 w-full -rotate-45 bg-red-500" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
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
        className={`relative overflow-hidden rounded-3xl border border-white/20 p-6 shadow-2xl md:p-8 dark:border-white/10 ${
          compactDevice ? 'bg-surface-container' : 'bg-white/80 backdrop-blur-xl dark:bg-black/40'
        }`}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5" />

        {/* Content */}
        <div className="relative space-y-8">
          {/* Phase indicator */}
          <div className="text-center">
            <motion.h3
              className="text-on-surface text-lg font-bold md:text-xl"
              key={phase}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              aria-live="polite"
            >
              {phase === 'names-reveal' && '✨ Analyzing names...'}
              {phase === 'striking' && '❌ Removing common letters...'}
              {phase === 'counting' && (
                <span>
                  🔢 Counting to {remainingCount}...{' '}
                  {countDisplay > 0 && (
                    <motion.span
                      key={countDisplay}
                      className="text-primary inline-block"
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      ({countDisplay})
                    </motion.span>
                  )}
                </span>
              )}
              {phase === 'result-reveal' && '🎉 Your result is ready!'}
            </motion.h3>
          </div>

          {/* Names with letters */}
          <div className="space-y-4">
            <NameLetters label="First Name" letters={firstLetters} matches={firstMatches} struck={struck} delay={0} />

            {/* Heart connector */}
            <div className="flex justify-center">
              <motion.span
                className="text-3xl"
                animate={{
                  scale: phase === 'result-reveal' ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: phase === 'result-reveal' ? Infinity : 0 }}
              >
                💕
              </motion.span>
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
          <div className="min-h-9">
            {showFlames && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  {remainingCount} remaining letters
                </div>
              </motion.div>
            )}
          </div>

          {/* FLAMES letters */}
          <div style={{ visibility: showFlames ? 'visible' : 'hidden' }} aria-hidden={!showFlames}>
            <motion.div
              className="pt-4"
              initial={false}
              animate={{ opacity: showFlames ? 1 : 0, y: showFlames ? 0 : 12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {FLAMES_DATA.map((item, idx) => {
                  const isActive = activeLetter === item.letter;
                  const isEliminated = eliminated.includes(item.letter);
                  const isResult = isActive && phase === 'result-reveal';

                  return (
                    <motion.div
                      key={item.letter}
                      className="relative"
                      initial={false}
                      animate={{
                        opacity: showFlames ? (isEliminated ? 0.3 : 1) : 0,
                        scale: showFlames ? (isResult ? 1.2 : isEliminated ? 0.8 : 1) : 0.5,
                      }}
                      transition={{
                        delay: isResult || isEliminated ? 0 : idx * 0.035,
                        duration: 0.2,
                      }}
                    >
                      <motion.div
                        className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 font-bold md:h-16 md:w-16 ${
                          isResult
                            ? `bg-linear-to-br ${item.color} border-transparent text-white shadow-xl`
                            : isActive
                              ? 'border-primary bg-primary/10 text-primary'
                              : isEliminated
                                ? 'border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                                : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                        animate={{ scale: isActive && !isResult ? 1.08 : 1 }}
                        transition={{ duration: 0.12 }}
                      >
                        <span className="text-xl md:text-2xl">{item.letter}</span>
                        {isResult && <span className="mt-0.5 text-xs">{item.emoji}</span>}
                      </motion.div>

                      {/* Count indicator - shows current count on active letter */}
                      {isActive && !isResult && countDisplay > 0 && (
                        <motion.div
                          className="absolute -top-3 -right-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-500 px-1 text-xs font-bold text-white shadow-lg"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.12 }}
                        >
                          {countDisplay}
                        </motion.div>
                      )}

                      {/* Eliminated X */}
                      {isEliminated && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="absolute h-0.5 w-full rotate-45 bg-red-500" />
                          <div className="absolute h-0.5 w-full -rotate-45 bg-red-500" />
                        </motion.div>
                      )}

                      {/* Result glow */}
                      {isResult && (
                        <motion.div
                          className="absolute -inset-4 -z-10 rounded-full"
                          style={{ background: `radial-gradient(circle, ${item.glow}, transparent 72%)` }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Result label */}
              <div className="min-h-20 pt-6">
                {phase === 'result-reveal' && resultData && (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={`inline-block rounded-full bg-linear-to-r ${resultData.color} px-6 py-2 text-lg font-bold text-white shadow-lg md:text-xl`}
                    >
                      {resultData.emoji} {resultData.full}!
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Skip button */}
          <div className="min-h-10">
            <AnimatePresence>
              {showSkip && phase !== 'result-reveal' && (
                <motion.div
                  className="flex justify-center pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={() => {
                      clearAll();
                      void uiInteraction('click');
                      if (result) void resultReveal(result);
                      onComplete(true);
                    }}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Skip animation →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const FlamesProcessor = memo(FlamesProcessorComponent);
export default FlamesProcessor;
