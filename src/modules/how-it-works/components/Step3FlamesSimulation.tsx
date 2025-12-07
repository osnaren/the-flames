'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Flame, Play, RefreshCcw, Target, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Step3Props {
  remainingCount: number;
}

const FLAMES_LETTERS = ['F', 'L', 'A', 'M', 'E', 'S'];
const FLAMES_MEANINGS: Record<string, { title: string; color: string }> = {
  F: { title: 'Friends', color: 'var(--tertiary)' },
  L: { title: 'Love', color: 'var(--error)' },
  A: { title: 'Affection', color: 'var(--secondary)' },
  M: { title: 'Marriage', color: 'var(--primary)' },
  E: { title: 'Enemies', color: 'var(--warning)' },
  S: { title: 'Siblings', color: 'var(--success)' },
};

/**
 * Enhanced Step 3 component showing the FLAMES elimination simulation
 * with sophisticated counting and striking animations
 */
export default function Step3FlamesSimulation({ remainingCount }: Step3Props) {
  const { shouldAnimate } = useAnimationPreferences();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(-1);
  const [eliminatedLetters, setEliminatedLetters] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [countDisplay, setCountDisplay] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Get active (non-eliminated) letters
  const getActiveLetters = () => {
    return FLAMES_LETTERS.map((letter, idx) => ({ letter, idx })).filter(
      (item) => !eliminatedLetters.includes(item.idx)
    );
  };

  // Run FLAMES simulation
  useEffect(() => {
    if (!isPlaying) return;

    const activeLetters = getActiveLetters();
    if (activeLetters.length === 1) {
      setResult(activeLetters[0].letter);
      setIsPlaying(false);
      return;
    }

    let count = 0;
    let activeIndex = currentPosition;

    // Count animation
    const countInterval = setInterval(() => {
      count++;
      setCountDisplay(count);

      // Move to next active letter
      let nextIndex = activeIndex;
      do {
        nextIndex = (nextIndex + 1) % FLAMES_LETTERS.length;
      } while (eliminatedLetters.includes(nextIndex));

      setCurrentPosition(nextIndex);
      activeIndex = nextIndex;

      if (count >= remainingCount) {
        clearInterval(countInterval);
        setTimeout(() => {
          setEliminatedLetters((prev) => [...prev, nextIndex]);
          setCountDisplay(0);

          // Check if we have a result
          const remaining = FLAMES_LETTERS.filter((_, idx) => !eliminatedLetters.includes(idx) && idx !== nextIndex);
          if (remaining.length === 1) {
            const resultIdx = FLAMES_LETTERS.findIndex((l) => l === remaining[0]);
            setResult(remaining[0]);
            setCurrentPosition(resultIdx);
            setIsPlaying(false);
          } else {
            // Continue to next round
            setCurrentPosition(nextIndex);
          }
        }, 300);
      }
    }, 200);

    return () => clearInterval(countInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, eliminatedLetters]);

  const handleStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPosition(-1);
    setEliminatedLetters([]);
    setResult(null);
    setCountDisplay(0);
    setHasStarted(false);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative"
    >
      <Card className="group/card relative overflow-hidden p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Animated background */}
        {shouldAnimate && (
          <motion.div
            className="from-primary/5 via-secondary/5 to-tertiary/5 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          {/* Enhanced Header */}
          <motion.h2
            className="font-heading text-on-surface mb-8 flex items-center gap-3 text-2xl font-bold"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.span
              className="bg-primary-container/20 text-primary ring-primary/20 flex h-10 w-10 items-center justify-center rounded-full ring-2"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              3
            </motion.span>
            <span className="flex items-center gap-2">
              Count & Eliminate
              <motion.span
                animate={shouldAnimate ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="text-primary inline h-6 w-6" />
              </motion.span>
            </span>
          </motion.h2>

          {/* Count Display */}
          <motion.div
            className="mb-6 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Target className="text-on-surface-variant h-4 w-4" />
            <span className="text-on-surface-variant text-sm">
              Remaining letters count: <span className="text-primary font-bold">{remainingCount}</span>
            </span>
          </motion.div>

          {/* FLAMES Letters Display */}
          <div className="relative mb-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {FLAMES_LETTERS.map((letter, idx) => {
              const isEliminated = eliminatedLetters.includes(idx);
              const isCurrent = currentPosition === idx && !isEliminated;
              const isResult = result === letter;
              const meaning = FLAMES_MEANINGS[letter];

              return (
                <motion.div
                  key={idx}
                  className="relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    delay: 0.5 + idx * 0.1,
                  }}
                >
                  <motion.div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold shadow-md transition-all duration-300 md:h-16 md:w-16 md:text-3xl ${
                      isResult
                        ? 'ring-success ring-4'
                        : isEliminated
                          ? 'bg-surface-container-low text-on-surface-variant/30 line-through'
                          : isCurrent
                            ? 'bg-primary text-on-primary ring-primary-container ring-4'
                            : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                    style={{
                      borderColor: isResult ? meaning.color : undefined,
                      boxShadow: isResult ? `0 0 20px ${meaning.color}` : undefined,
                    }}
                    animate={
                      isCurrent && shouldAnimate
                        ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              '0 10px 15px -3px rgba(249, 115, 22, 0.5)',
                              '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            ],
                          }
                        : isResult && shouldAnimate
                          ? {
                              scale: [1, 1.05, 1],
                              rotate: [0, 2, -2, 0],
                            }
                          : {}
                    }
                    transition={{
                      duration: 0.5,
                      repeat: isCurrent || isResult ? Infinity : 0,
                    }}
                    whileHover={!isEliminated ? { scale: 1.05, y: -2 } : {}}
                  >
                    {letter}

                    {/* Counting indicator */}
                    <AnimatePresence>
                      {isCurrent && countDisplay > 0 && (
                        <motion.div
                          className="bg-primary text-on-primary absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-lg"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          {countDisplay}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Result crown/indicator */}
                    {isResult && (
                      <motion.div
                        className="absolute -top-4"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Zap className="text-warning h-6 w-6 fill-current" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Meaning tooltip for result */}
                  {isResult && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-sm font-medium whitespace-nowrap"
                      style={{ color: meaning.color }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {meaning.title}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Control Buttons */}
          <div className="mb-8 flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleStart}
                disabled={isPlaying || result !== null}
                icon={Play}
                className="min-w-[120px]"
              >
                {hasStarted && !result ? 'Continue' : 'Start'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" onClick={handleReset} icon={RefreshCcw} className="min-w-[120px]">
                Reset
              </Button>
            </motion.div>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="mb-6 text-center"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
              >
                <motion.div
                  className="bg-surface-container-high inline-block rounded-2xl p-6 shadow-lg"
                  animate={
                    shouldAnimate
                      ? {
                          boxShadow: [
                            '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            `0 20px 25px -5px ${FLAMES_MEANINGS[result].color}40`,
                            '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-on-surface-variant mb-2 text-lg">The result is:</p>
                  <p className="text-3xl font-bold" style={{ color: FLAMES_MEANINGS[result].color }}>
                    {result} = {FLAMES_MEANINGS[result].title}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Description */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Count through{' '}
              <motion.span
                className="text-primary font-semibold"
                animate={
                  shouldAnimate
                    ? {
                        textShadow: [
                          '0 0 0px rgba(249, 115, 22, 0)',
                          '0 0 10px rgba(249, 115, 22, 0.5)',
                          '0 0 0px rgba(249, 115, 22, 0)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                F-L-A-M-E-S
              </motion.span>{' '}
              using the remaining letter count.
              <br className="hidden md:block" />
              Each cycle eliminates one letter until only the{' '}
              <span className="text-secondary font-semibold">final result</span> remains! 🎯
            </p>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
