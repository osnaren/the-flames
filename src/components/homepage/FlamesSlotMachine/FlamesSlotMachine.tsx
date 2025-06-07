import { FlamesResult } from '@features/flamesGame/flames.types';
import { getResultData } from '@features/flamesGame/resultData';
import { useFlamesEngine } from '@features/flamesGame/useFlamesEngine';
import ConfettiEffect from '@ui/ConfettiEffect';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface FlamesSlotMachineProps {
  result: FlamesResult;
  shouldAnimate: boolean;
  stage: 'input' | 'processing' | 'result';
}

const letters = ['F', 'L', 'A', 'M', 'E', 'S'];
const BASE_SPEED_MS = 180; // Starting speed (slightly slower for better visibility)
const MAX_SPEED_MS = 800; // Max slowdown (longer for more dramatic effect)
const SLOWDOWN_FACTOR = 1.15; // How much to slow down each iteration (gentler)
const SPEED_UP_FACTOR = 0.96; // Speed up during initial phase (gentler)
const MIN_SPEED_MS = 140; // Minimum speed during speed-up phase (not too fast)

// Animation phases
const PHASES = {
  SPEED_UP: 'speed-up', // Initial fast spinning
  CONSTANT: 'constant', // Maintain constant speed briefly
  SLOW_DOWN: 'slow-down', // Begin slowing down
  FINAL_APPROACH: 'final-approach', // Final dramatic slowdown
};

/**
 * Component for the horizontal FLAMES letter animation
 * Uses CSS Grid-based approach for more reliable animations
 * Shows confetti and particles when the final result is revealed
 */
export function FlamesSlotMachine({ result, shouldAnimate, stage }: FlamesSlotMachineProps) {
  // Get state & actions from flamesEngine hook
  const [{ isSlotMachineAnimating }, { onSlotMachineComplete }] = useFlamesEngine();

  // Local state for animation control
  const [activeLetterIndex, setActiveLetterIndex] = useState<number>(0); // Initialize with 0 rather than null
  const [animationFinished, setAnimationFinished] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(PHASES.SPEED_UP);

  // Refs for animation control
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef(BASE_SPEED_MS);
  const cyclesRef = useRef(0);
  const animationStartedRef = useRef(false);

  // Result letter animation controller
  const resultLetterControls = useAnimationControls();

  // Get result styling based on theme
  const { color: resultColorClass, glowColor } = result ? getResultData(result) : { color: '', glowColor: '' };

  // Enhanced ring pulse animation for better visibility
  const ringPulseAnimation = {
    scale: [1, 1.12, 1],
    boxShadow: [
      '0 0 0 2px rgba(var(--color-primary-rgb), 0.5), 0 0 0px rgba(var(--color-primary-rgb), 0.3)',
      '0 0 0 3px rgba(var(--color-primary-rgb), 0.8), 0 0 20px rgba(var(--color-primary-rgb), 0.6)',
      '0 0 0 2px rgba(var(--color-primary-rgb), 0.5), 0 0 0px rgba(var(--color-primary-rgb), 0.3)',
    ],
    transition: {
      duration: 0.5, // Slower animation for better visibility
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  };

  // Position state to enable smooth transitions between letters
  // const [ringPosition, setRingPosition] = useState({ x: 0, opacity: 0 });

  // Reset animation state when component unmounts or dependencies change
  const cleanupAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    animationStartedRef.current = false;
    cyclesRef.current = 0;
    speedRef.current = BASE_SPEED_MS;
  }, []);

  // Core animation function - moves the highlight from letter to letter
  const animateLetters = useCallback(
    (index: number) => {
      if (!result) return;

      // Ensure index is within bounds
      const safeIndex = index % letters.length;

      // Update active letter - this is key for making ring visible
      setActiveLetterIndex(safeIndex);

      // Find the target letter index for the result
      const targetIndex = letters.findIndex((letter) => letter === result);

      // Track animation cycles for phase management
      cyclesRef.current += 1;

      // Dynamic speed management based on animation phase
      if (animationPhase === PHASES.SPEED_UP) {
        // More visible speed-up phase
        speedRef.current = Math.max(speedRef.current * SPEED_UP_FACTOR, MIN_SPEED_MS);

        // Shorter initial phase so we spend more time in the visible constant phase
        if (cyclesRef.current > 6) {
          setAnimationPhase(PHASES.CONSTANT);
          speedRef.current = BASE_SPEED_MS;
        }
      } else if (animationPhase === PHASES.CONSTANT && cyclesRef.current > 14) {
        // Begin slowing down after constant phase
        setAnimationPhase(PHASES.SLOW_DOWN);
      } else if (animationPhase === PHASES.SLOW_DOWN || animationPhase === PHASES.FINAL_APPROACH) {
        // Extra slow down when approaching result letter
        if (safeIndex === targetIndex) {
          // Enter final dramatic approach
          if (animationPhase !== PHASES.FINAL_APPROACH && speedRef.current > MAX_SPEED_MS * 0.4) {
            setAnimationPhase(PHASES.FINAL_APPROACH);
          }

          // More gradual slowdown for better visual effect
          speedRef.current = Math.min(speedRef.current * SLOWDOWN_FACTOR, MAX_SPEED_MS);

          // Stop animation when slow enough
          if (speedRef.current >= MAX_SPEED_MS * 0.75) {
            // Final pause before completion
            animationRef.current = setTimeout(() => {
              // Mark animation as complete
              setAnimationFinished(true);
              setActiveLetterIndex(targetIndex);
              setIsAnimating(false);

              // Highlight final result
              resultLetterControls.start({
                scale: [1, 1.3, 1],
                transition: { duration: 0.6, ease: 'easeOut' },
              });

              // Notify engine that animation is complete - immediately show result
              onSlotMachineComplete();
            }, 300); // Shorter pause before showing result
            return;
          }
        } else {
          // Milder slowdown when not on target letter
          speedRef.current = Math.min(speedRef.current * 1.03, MAX_SPEED_MS);
        }
      }

      // Schedule next animation step
      animationRef.current = setTimeout(() => {
        animateLetters((safeIndex + 1) % letters.length);
      }, speedRef.current);
    },
    [animationPhase, result, resultLetterControls, onSlotMachineComplete]
  );

  // Start animation effect - manages when animation should start
  useEffect(() => {
    // Start animation as soon as we enter processing stage (even before result is available)
    // This shows the ring moving immediately
    if (stage === 'processing' && !animationStartedRef.current && shouldAnimate) {
      console.log('Starting initial animation sequence');

      // Start ring moving immediately, even before we know the result
      cleanupAnimation();
      setAnimationPhase(PHASES.SPEED_UP);
      setAnimationFinished(false);
      setIsAnimating(true);
      animationStartedRef.current = true;

      // Begin with the first letter immediately
      setActiveLetterIndex(0);

      // Start animation immediately
      animationRef.current = setTimeout(() => {
        animateLetters(0);
      }, 100); // Very short delay to start
    }

    // Once result is available and animation is ongoing, make sure we're targeting the right result
    if (result && animationStartedRef.current && shouldAnimate) {
      // The animation is already running, just let it continue to the right result
      console.log('Result available during animation:', result);
    }

    // Handle immediate transition to result stage (non-animated case)
    if (stage === 'result' && result && !isAnimating && !animationFinished) {
      const resultIndex = letters.findIndex((l) => l === result);
      setActiveLetterIndex(resultIndex);
      setAnimationFinished(true);
    }

    // Cleanup on unmount or dependencies change
    return cleanupAnimation;
  }, [
    result,
    shouldAnimate,
    stage,
    isSlotMachineAnimating,
    animateLetters,
    cleanupAnimation,
    isAnimating,
    animationFinished,
  ]);

  // Safety check to ensure we don't get stuck in processing
  useEffect(() => {
    // If we have a result but animation isn't running in processing stage,
    // force transition to result view
    if (stage === 'processing' && result && !isAnimating && !animationFinished) {
      const forceResultTimeout = setTimeout(() => {
        console.log('Force completing animation due to stalled state');
        const resultIndex = letters.findIndex((l) => l === result);
        setActiveLetterIndex(resultIndex);
        setAnimationFinished(true);
        onSlotMachineComplete();
      }, 2000);

      return () => clearTimeout(forceResultTimeout);
    }
  }, [stage, result, isAnimating, animationFinished, onSlotMachineComplete]);

  // Non-animated version - simple static display
  if (!shouldAnimate) {
    const resultIndex = letters.findIndex((l) => l === result);
    return (
      <div className="grid grid-cols-6 gap-2 py-6 md:gap-4 md:py-8">
        {letters.map((letter, index) => (
          <div
            key={letter}
            className={`bg-surface dark:bg-surface-container-high flex h-12 w-12 items-center justify-center rounded-lg text-xl font-bold shadow-md md:h-16 md:w-16 md:text-2xl ${
              index === resultIndex && result
                ? `ring-primary ring-offset-background dark:ring-offset-background ring-2 ring-offset-2 ${resultColorClass}`
                : 'text-on-surface dark:text-on-surface'
            }`}
            aria-label={index === resultIndex ? `${letter} - this is the result` : letter}
          >
            {letter}
          </div>
        ))}
      </div>
    );
  }

  // Animated version with enhanced visual effects
  return (
    <>
      <AnimatePresence>
        {animationFinished && result && <ConfettiEffect result={result} isActive={true} />}
      </AnimatePresence>

      <div className="grid grid-cols-6 gap-2 py-6 md:gap-4 md:py-8">
        {letters.map((letter, index) => {
          const isResult = letter === result;
          // Show active ring on the current letter, whether animating or finished
          const isActive = index === activeLetterIndex;
          const isResultFinished = isResult && animationFinished;

          return (
            <div key={letter} className="relative">
              {/* Animated ring/halo around active letter - ALWAYS show when there's an activeLetterIndex */}
              {isActive && (
                <motion.div
                  className="pointer-events-none absolute inset-0 z-10"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={
                    isAnimating
                      ? ringPulseAnimation
                      : {
                          opacity: 1,
                          scale: 1,
                        }
                  }
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    duration: 0.2,
                  }}
                  layoutId="activeRing"
                >
                  {/* Outer glow effect - always visible during animation for better visibility */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-80"
                    animate={{
                      boxShadow: '0 0 12px 4px rgba(var(--color-primary-rgb), 0.8)',
                    }}
                  />

                  {/* Border ring */}
                  <div
                    className={`h-full w-full rounded-lg border-2 ${
                      isResultFinished
                        ? 'border-primary dark:border-primary'
                        : 'border-primary/90 dark:border-primary/90'
                    }`}
                  />
                </motion.div>
              )}

              {/* Letter box with animations */}
              <motion.div
                className={`bg-surface dark:bg-surface-container-high relative flex h-12 w-12 items-center justify-center rounded-lg text-xl font-bold shadow-md transition-colors md:h-16 md:w-16 md:text-2xl ${
                  isResultFinished
                    ? resultColorClass
                    : isActive
                      ? 'text-primary dark:text-primary'
                      : 'text-on-surface dark:text-on-surface'
                }`}
                animate={
                  isResult && animationFinished
                    ? resultLetterControls
                    : {
                        scale: isActive ? 1.08 : 1,
                        transition: { type: 'spring', stiffness: 500, damping: 30 },
                      }
                }
                transition={{
                  duration: 0.2,
                  ease: 'easeInOut',
                }}
                aria-label={isResultFinished ? `${letter} - this is the result` : letter}
              >
                {letter}

                {/* Result letter glow effect */}
                {isResultFinished && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                    style={{
                      boxShadow: `0 0 18px 8px ${glowColor}`,
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Particle effects for result letter */}
                {isResultFinished && (
                  <div className="absolute inset-0 overflow-hidden rounded-lg" aria-hidden="true">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-1.5 w-1.5 rounded-full"
                        initial={{
                          x: '50%',
                          y: '50%',
                          opacity: 0,
                        }}
                        animate={{
                          x: `${50 + (Math.random() * 100 - 50)}%`,
                          y: `${50 + (Math.random() * 100 - 50)}%`,
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          repeat: Infinity,
                          delay: Math.random() * 2,
                          repeatType: 'loop',
                        }}
                        style={{
                          backgroundColor: glowColor,
                          zIndex: -1,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Accessibility announcement */}
      {animationFinished && result && (
        <div className="sr-only" role="status" aria-live="polite">
          Result is {result}
        </div>
      )}
    </>
  );
}

export default FlamesSlotMachine;
