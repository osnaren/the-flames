import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { FlamesResult } from '@features/flamesGame/flames.types';
import { getResultData } from '@features/flamesGame/resultData';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface FlamesAnimationProps {
  remainingLetters: string[];
  onComplete: (result: FlamesResult) => void;
  isVisible: boolean;
  result?: FlamesResult; // Pre-calculated result for immediate display
}

interface FlamesLetter {
  letter: FlamesResult;
  isActive: boolean;
  isEliminated: boolean;
  position: number;
}

/**
 * Enhanced FLAMES animation with circular arrangement and spark indicator
 * Mimics the traditional counting game with visual flair
 */
export function FlamesAnimation({ remainingLetters, onComplete, isVisible, result }: FlamesAnimationProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const [flamesLetters, setFlamesLetters] = useState<FlamesLetter[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [eliminationCount, setEliminationCount] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const letters: FlamesResult[] = ['F', 'L', 'A', 'M', 'E', 'S'];
  const countValue = remainingLetters.length;

  // Initialize FLAMES letters
  useEffect(() => {
    if (!isVisible) return;

    const initialLetters = letters.map((letter, index) => ({
      letter,
      isActive: false,
      isEliminated: false,
      position: index,
    }));

    setFlamesLetters(initialLetters);
    setCurrentPosition(0);
    setEliminationCount(0);
    setRoundsCompleted(0);
    setIsAnimating(false);
  }, [isVisible]);

  // Start the FLAMES counting animation
  const startAnimation = useCallback(() => {
    if (!shouldAnimate && result) {
      // Skip animation and show result immediately
      const resultIndex = letters.findIndex((l) => l === result);
      setFlamesLetters((prev) =>
        prev.map((letter, index) => ({
          ...letter,
          isEliminated: index !== resultIndex,
          isActive: index === resultIndex,
        }))
      );
      setEliminationCount(5);
      setTimeout(() => onComplete(result), 500);
      return;
    }

    setIsAnimating(true);

    // Create a mutable reference for the animation state
    const animationState = {
      currentLetters: [...letters],
      position: 0,
    };

    const performRound = () => {
      if (animationState.currentLetters.length === 1) {
        // Animation complete - final result
        const finalResult = animationState.currentLetters[0];
        setFlamesLetters((prev) =>
          prev.map((letter) => ({
            ...letter,
            isActive: letter.letter === finalResult,
            isEliminated: letter.letter !== finalResult,
          }))
        );
        setEliminationCount(5);
        setIsAnimating(false);

        setTimeout(() => {
          onComplete(finalResult);
        }, 1000);
        return;
      }

      // Count through the remaining letters
      let currentCount = 0;
      const countingSpeed = 400; // milliseconds per count

      const countStep = () => {
        if (currentCount < countValue) {
          // Highlight current position
          const currentLetter =
            animationState.currentLetters[animationState.position % animationState.currentLetters.length];
          setCurrentPosition(letters.findIndex((l) => l === currentLetter));

          setFlamesLetters((prev) =>
            prev.map((letter) => ({
              ...letter,
              isActive: letter.letter === currentLetter && !letter.isEliminated,
            }))
          );

          animationState.position++;
          currentCount++;
          setTimeout(countStep, countingSpeed);
        } else {
          // Eliminate the letter we landed on
          const eliminationPosition = (animationState.position - 1) % animationState.currentLetters.length;
          const eliminatedLetter = animationState.currentLetters[eliminationPosition];

          // Remove from current letters array
          animationState.currentLetters.splice(eliminationPosition, 1);

          // Update visual state
          setFlamesLetters((prev) =>
            prev.map((letter) => ({
              ...letter,
              isEliminated: letter.letter === eliminatedLetter ? true : letter.isEliminated,
              isActive: false,
            }))
          );

          setEliminationCount((prev) => prev + 1);
          setRoundsCompleted((prev) => prev + 1);

          // Adjust position for next round
          if (eliminationPosition < animationState.currentLetters.length) {
            animationState.position = eliminationPosition;
          } else {
            animationState.position = 0;
          }

          // Continue to next round after a pause
          setTimeout(() => {
            performRound();
          }, 1200);
        }
      };

      // Start counting for this round
      setTimeout(countStep, 500);
    };

    // Start the first round
    setTimeout(performRound, 800);
  }, [shouldAnimate, result, countValue, onComplete, letters]);

  // Auto-start animation when component becomes visible
  useEffect(() => {
    if (isVisible && flamesLetters.length > 0 && !isAnimating) {
      const timer = setTimeout(startAnimation, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, flamesLetters.length, isAnimating, startAnimation]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="flex flex-col items-center space-y-8 p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-on-surface dark:text-on-surface mb-2 text-2xl font-bold">F.L.A.M.E.S</h3>
        <p className="text-on-surface-variant dark:text-on-surface-variant">
          Counting with {countValue} remaining letters...
        </p>
      </motion.div>

      {/* Circular FLAMES arrangement */}
      <div className="relative h-80 w-80">
        {/* Center flame indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform"
          animate={
            isAnimating && shouldAnimate
              ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: isAnimating ? Infinity : 0,
            ease: 'linear',
          }}
        >
          <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-lg">
            🔥
          </div>
        </motion.div>

        {/* FLAMES letters in circle */}
        {flamesLetters.map((flamesLetter, index) => {
          const angle = index * 60 - 90; // 60 degrees apart, starting from top
          const radius = 120;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          const resultData = getResultData(flamesLetter.letter);

          return (
            <motion.div
              key={flamesLetter.letter}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(${x - 32}px, ${y - 32}px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: flamesLetter.isEliminated ? 0.3 : 1,
                scale: flamesLetter.isEliminated ? 0.7 : 1,
              }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <motion.div
                className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 text-xl font-bold transition-all duration-300 ${
                  flamesLetter.isActive && !flamesLetter.isEliminated
                    ? `${resultData.color} border-primary shadow-lg`
                    : flamesLetter.isEliminated
                      ? 'bg-surface-container/50 border-outline/30 text-on-surface-variant'
                      : 'bg-surface-container border-outline/50 text-on-surface'
                } `}
                animate={
                  flamesLetter.isActive && !flamesLetter.isEliminated && shouldAnimate
                    ? {
                        boxShadow: [
                          '0 0 0 0 rgba(var(--color-primary-rgb), 0)',
                          '0 0 0 12px rgba(var(--color-primary-rgb), 0.3)',
                          '0 0 0 0 rgba(var(--color-primary-rgb), 0)',
                        ],
                        scale: [1, 1.1, 1],
                      }
                    : flamesLetter.isEliminated && shouldAnimate
                      ? {
                          rotate: [0, 180],
                          filter: ['blur(0px)', 'blur(2px)'],
                        }
                      : {}
                }
                transition={{
                  duration: flamesLetter.isActive ? 1 : 0.8,
                  repeat: flamesLetter.isActive && !flamesLetter.isEliminated ? Infinity : 0,
                }}
              >
                {flamesLetter.letter}

                {/* Elimination effect */}
                {flamesLetter.isEliminated && (
                  <motion.div
                    className="bg-error/20 absolute inset-0 flex items-center justify-center rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="bg-error h-0.5 w-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    />
                  </motion.div>
                )}

                {/* Spark trail effect */}
                {flamesLetter.isActive && !flamesLetter.isEliminated && shouldAnimate && (
                  <motion.div
                    className="absolute -inset-2 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${resultData.glowColor}, transparent)`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
              </motion.div>

              {/* Letter meaning tooltip */}
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform text-center text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: flamesLetter.isEliminated ? 0.5 : 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-surface-container/80 dark:bg-surface-container-high/80 text-on-surface dark:text-on-surface rounded px-2 py-1 backdrop-blur-sm">
                  {resultData.text}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Counting indicator */}
        {isAnimating && (
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-medium">
              Counting: {countValue} letters | Round {roundsCompleted + 1}
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress indicator */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="bg-surface-container dark:bg-surface-container-high rounded-lg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-on-surface dark:text-on-surface text-sm font-medium">Elimination Progress</span>
            <span className="text-on-surface-variant dark:text-on-surface-variant text-sm">{eliminationCount} / 5</span>
          </div>
          <div className="bg-outline/20 h-2 w-full rounded-full">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(eliminationCount / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Animation status */}
      {isAnimating && shouldAnimate && (
        <motion.div
          className="text-on-surface-variant dark:text-on-surface-variant text-center text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🎵 Follow the counting rhythm...
        </motion.div>
      )}
    </motion.div>
  );
}
