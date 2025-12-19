import { useGameIntegration } from '@/hooks/useGameIntegration';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FLAMES_DATA, PROCESSOR_TIMING } from '../../constants';
import type { FlamesResult } from '../../types';

interface FlamesProcessorProps {
  name1: string;
  name2: string;
  commonLetters: string[];
  remainingCount: number;
  result: FlamesResult;
  onComplete: () => void;
  shouldAnimate: boolean;
  runId?: number;
}

type ProcessingPhase = 'names-reveal' | 'striking' | 'counting' | 'result-reveal' | 'complete';

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
    transition: { duration: 0.3 },
  },
};

function FlamesProcessorComponent({
  name1,
  name2,
  commonLetters,
  remainingCount,
  result,
  onComplete,
  shouldAnimate,
  runId,
}: FlamesProcessorProps) {
  const { letterStrike, flamesCounting, resultReveal, uiInteraction } = useGameIntegration();
  const [phase, setPhase] = useState<ProcessingPhase>('names-reveal');
  const [struckLetters, setStruckLetters] = useState<Set<number>>(new Set());
  const [activeFlamesIndex, setActiveFlamesIndex] = useState<number | null>(null);
  const [finalResultIndex, setFinalResultIndex] = useState<number | null>(null);
  const [eliminatedFlames, setEliminatedFlames] = useState<Set<number>>(new Set());
  const [showSkip, setShowSkip] = useState(false);
  const [countDisplay, setCountDisplay] = useState(0);
  const [showFlames, setShowFlames] = useState(false);

  // Refs for tracking state across async callbacks
  const currentPositionRef = useRef<number>(-1);
  const eliminatedRef = useRef<Set<number>>(new Set());
  const remainingIndicesRef = useRef<number[]>([0, 1, 2, 3, 4, 5]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isCancelledRef = useRef(false);
  const flamesAnimatedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref up to date without triggering effects
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Memoize dependencies
  const safeRemainingCount = Math.max(1, remainingCount);

  // Prepare letter data
  const name1Letters = useMemo(() => name1.toUpperCase().split(''), [name1]);
  const name2Letters = useMemo(() => name2.toUpperCase().split(''), [name2]);
  const commonSet = useMemo(() => new Set(commonLetters.map((l) => l.toUpperCase())), [commonLetters]);

  // Dynamic strike completion time based on letter counts and animation delays
  const strikeAnimationDuration = useMemo(() => {
    const NAME1_DELAY_STEP = 50; // ms per letter for the staggered reveal
    const NAME2_BASE_DELAY = 300; // ms initial delay before second name starts animating
    const ANIMATION_DURATION = 300; // ms duration for each letter animation

    const name1LastFinish =
      name1Letters.length > 0 ? (name1Letters.length - 1) * NAME1_DELAY_STEP + ANIMATION_DURATION : 0;
    const name2LastFinish =
      name2Letters.length > 0
        ? NAME2_BASE_DELAY + (name2Letters.length - 1) * NAME1_DELAY_STEP + ANIMATION_DURATION
        : 0;

    const longestStrike = Math.max(name1LastFinish, name2LastFinish);

    // Ensure we never go below the legacy static duration, and add a small buffer for safety
    return Math.max(PROCESSOR_TIMING.STRIKE_DURATION, longestStrike + 150);
  }, [name1Letters.length, name2Letters.length]);

  // Find indices of common letters to strike (one occurrence matched to one occurrence)
  const getStrikeIndices = useCallback(() => {
    // Build lists that skip spaces but keep original indices for accurate striking
    const filtered1 = name1Letters.map((char, idx) => ({ char, idx })).filter(({ char }) => char.trim().length > 0);
    const filtered2 = name2Letters.map((char, idx) => ({ char, idx })).filter(({ char }) => char.trim().length > 0);

    const matched1 = new Set<number>();
    const matched2 = new Set<number>();
    const indices1: number[] = [];
    const indices2: number[] = [];

    for (const { char, idx } of filtered1) {
      // Find the first unmatched occurrence of this char in name2
      const match = filtered2.find(({ char: c2, idx: idx2 }) => c2 === char && !matched2.has(idx2));
      if (match) {
        matched1.add(idx);
        matched2.add(match.idx);
        indices1.push(idx);
        indices2.push(match.idx);
      }
    }

    return { indices1, indices2 };
  }, [name1Letters, name2Letters]);

  // Handle skip
  const handleSkip = useCallback(() => {
    isCancelledRef.current = true;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setPhase('complete');
    onCompleteRef.current();
  }, []);

  // Helper to add timeout and track it
  const addTimeout = useCallback((callback: () => void, delay: number) => {
    const id = setTimeout(() => {
      if (!isCancelledRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Reset state when animation should start
  useEffect(() => {
    if (!shouldAnimate) {
      setPhase('complete');
      setTimeout(() => onCompleteRef.current(), 100);
      return;
    }

    // Reset refs and state
    isCancelledRef.current = false;
    currentPositionRef.current = -1;
    eliminatedRef.current = new Set();
    remainingIndicesRef.current = [0, 1, 2, 3, 4, 5];
    flamesAnimatedRef.current = false;

    // Reset all UI state
    setPhase('names-reveal');
    setStruckLetters(new Set());
    setActiveFlamesIndex(null);
    setFinalResultIndex(null);
    setEliminatedFlames(new Set());
    setShowSkip(false);
    setCountDisplay(0);
    setShowFlames(false);

    // Start sequence
    addTimeout(() => setShowSkip(true), 1500);

    return () => {
      isCancelledRef.current = true;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [shouldAnimate, addTimeout, runId]);

  // Phase transition logic
  useEffect(() => {
    if (isCancelledRef.current || !shouldAnimate) return;

    switch (phase) {
      case 'names-reveal':
        addTimeout(() => setPhase('striking'), PROCESSOR_TIMING.NAMES_REVEAL);
        break;

      case 'striking': {
        // Calculate strike indices
        const { indices1, indices2 } = getStrikeIndices();
        const allIndices = [
          ...indices1.map((i) => ({ name: 1, idx: i })),
          ...indices2.map((i) => ({ name: 2, idx: i })),
        ];

        // Strike letters after delay
        addTimeout(() => {
          setStruckLetters(new Set(allIndices.map(({ name, idx }) => name * 100 + idx)));

          // Play sound for each struck letter
          allIndices.forEach((_, index) => {
            letterStrike(index, allIndices.length);
          });

          // Move to counting after strike duration
          addTimeout(() => setPhase('counting'), strikeAnimationDuration);
        }, PROCESSOR_TIMING.STRIKE_DELAY);
        break;
      }

      case 'counting':
        setShowFlames(true);
        flamesAnimatedRef.current = false;

        // Wait for FLAMES to animate in, then start counting
        addTimeout(() => {
          flamesAnimatedRef.current = true;
          startEliminationProcess();
        }, 600);
        break;

      case 'result-reveal':
        if (result) {
          resultReveal(result);
        }
        addTimeout(() => {
          setPhase('complete');
          onCompleteRef.current();
        }, PROCESSOR_TIMING.RESULT_REVEAL);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, shouldAnimate]); // Only re-run when phase changes

  // Counting logic
  const startEliminationProcess = useCallback(() => {
    const runCountingRound = () => {
      // If only one letter remains, reveal immediately without extra counting cycles
      if (remainingIndicesRef.current.length === 1) {
        const [onlyIdx] = remainingIndicesRef.current;
        setActiveFlamesIndex(onlyIdx);
        setCountDisplay(0);
        setFinalResultIndex(onlyIdx);
        setPhase('result-reveal');
        return;
      }

      let count = 0;

      const countStep = () => {
        if (count < safeRemainingCount) {
          count++;

          // Find next non-eliminated letter first
          let nextPos = currentPositionRef.current;
          do {
            nextPos = (nextPos + 1) % 6;
          } while (eliminatedRef.current.has(nextPos));

          currentPositionRef.current = nextPos;
          // Highlight the letter first
          setActiveFlamesIndex(nextPos);

          // Show count number after a brief delay so letter highlights first
          addTimeout(() => {
            setCountDisplay(count);
            flamesCounting(count, safeRemainingCount);
          }, 50);

          addTimeout(countStep, PROCESSOR_TIMING.COUNT_PER_LETTER);
        } else {
          // Count complete
          const remaining = remainingIndicesRef.current;

          if (remaining.length === 1) {
            // Result found!
            setActiveFlamesIndex(remaining[0]);
            setFinalResultIndex(remaining[0]);
            setCountDisplay(0);
            setPhase('result-reveal');
          } else {
            // Eliminate current letter
            const eliminatedIdx = currentPositionRef.current;
            eliminatedRef.current.add(eliminatedIdx);
            setEliminatedFlames(new Set(eliminatedRef.current));
            remainingIndicesRef.current = remainingIndicesRef.current.filter((i) => i !== eliminatedIdx);
            setCountDisplay(0);

            // Pause then next round
            addTimeout(() => {
              setActiveFlamesIndex(null);
              addTimeout(runCountingRound, 300);
            }, 350);
          }
        }
      };

      addTimeout(countStep, PROCESSOR_TIMING.COUNT_START);
    };

    runCountingRound();
  }, [addTimeout, safeRemainingCount, flamesCounting]);

  const resultData = result ? FLAMES_DATA.find((f) => f.letter === result) : null;

  // Keep the winning tile locked once determined
  useEffect(() => {
    if (finalResultIndex !== null) {
      setActiveFlamesIndex(finalResultIndex);
    }
  }, [finalResultIndex]);

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
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-black/40">
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
              {phase === 'complete' && '✅ Complete!'}
            </motion.h3>
          </div>

          {/* Names with letters */}
          <div className="space-y-4">
            {/* Name 1 */}
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-gray-500">First Name</div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {name1Letters.map((letter, idx) => {
                  const isCommon = commonSet.has(letter);
                  const isStruck = struckLetters.has(100 + idx);

                  return (
                    <motion.div
                      key={`n1-${idx}`}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all md:h-12 md:w-12 md:text-xl ${
                        isStruck
                          ? 'bg-red-100 text-red-400 dark:bg-red-900/30 dark:text-red-400'
                          : isCommon
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: isStruck ? 0.9 : 1,
                      }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      {letter}

                      {/* Strike line */}
                      <AnimatePresence>
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
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

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

            {/* Name 2 */}
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-gray-500">Second Name</div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {name2Letters.map((letter, idx) => {
                  const isCommon = commonSet.has(letter);
                  const isStruck = struckLetters.has(200 + idx);

                  return (
                    <motion.div
                      key={`n2-${idx}`}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all md:h-12 md:w-12 md:text-xl ${
                        isStruck
                          ? 'bg-red-100 text-red-400 dark:bg-red-900/30 dark:text-red-400'
                          : isCommon
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: isStruck ? 0.9 : 1,
                      }}
                      transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }}
                    >
                      {letter}

                      <AnimatePresence>
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
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Remaining count badge */}
          <AnimatePresence>
            {showFlames && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  {remainingCount} remaining letters
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FLAMES letters */}
          {showFlames && (
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {FLAMES_DATA.map((item, idx) => {
                  const isActive = activeFlamesIndex === idx;
                  const isEliminated = eliminatedFlames.has(idx);
                  const isResult = finalResultIndex === idx && (phase === 'result-reveal' || phase === 'complete');
                  const skipInitialAnimation = flamesAnimatedRef.current;

                  return (
                    <motion.div
                      key={item.letter}
                      className="relative"
                      initial={skipInitialAnimation ? false : { opacity: 0, scale: 0 }}
                      animate={{
                        opacity: isEliminated ? 0.3 : 1,
                        scale: isResult ? 1.2 : isEliminated ? 0.8 : 1,
                      }}
                      transition={{
                        delay: skipInitialAnimation ? 0 : idx * 0.08,
                        duration: 0.3,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      <motion.div
                        className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 font-bold transition-all md:h-16 md:w-16 ${
                          isResult
                            ? `bg-linear-to-br ${item.color} border-transparent text-white shadow-xl`
                            : isActive
                              ? 'border-primary bg-primary/10 text-primary'
                              : isEliminated
                                ? 'border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                                : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                        animate={
                          isActive && !isResult
                            ? {
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  '0 0 0 0 rgba(var(--color-primary-rgb), 0)',
                                  '0 0 0 8px rgba(var(--color-primary-rgb), 0.2)',
                                  '0 0 0 0 rgba(var(--color-primary-rgb), 0)',
                                ],
                              }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-xl md:text-2xl">{item.letter}</span>
                        {isResult && <span className="mt-0.5 text-xs">{item.emoji}</span>}
                      </motion.div>

                      {/* Count indicator - shows current count on active letter */}
                      <AnimatePresence>
                        {isActive && !isResult && countDisplay > 0 && (
                          <motion.div
                            className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white shadow-lg"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            key={countDisplay}
                          >
                            {countDisplay}
                          </motion.div>
                        )}
                      </AnimatePresence>

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
                          className="absolute -inset-2 -z-10 rounded-2xl opacity-50 blur-xl"
                          style={{ background: `linear-gradient(135deg, ${item.glow}, transparent)` }}
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
              {phase === 'result-reveal' && resultData && (
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className={`inline-block rounded-full bg-linear-to-r ${resultData.color} px-6 py-2 text-lg font-bold text-white shadow-lg md:text-xl`}
                  >
                    {resultData.emoji} {resultData.full}!
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && phase !== 'complete' && phase !== 'result-reveal' && (
              <motion.div
                className="flex justify-center pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => {
                    uiInteraction('click');
                    handleSkip();
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
    </motion.div>
  );
}

export const FlamesProcessor = memo(FlamesProcessorComponent);
export default FlamesProcessor;
