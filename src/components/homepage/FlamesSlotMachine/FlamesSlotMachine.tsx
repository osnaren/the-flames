import { FlamesResult } from '@features/flamesGame/flames.types';
import { getResultVisuals } from '@features/flamesGame/resultVisuals';
import ConfettiEffect from '@ui/ConfettiEffect';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface FlamesHighlightAnimationProps {
  result: FlamesResult;
  shouldAnimate: boolean;
  stage: 'input' | 'processing' | 'result';
}

const letters = ['F', 'L', 'A', 'M', 'E', 'S'];
const BASE_SPEED_MS = 200; // Starting speed
const MAX_SPEED_MS = 600; // Max slowdown
const SLOWDOWN_FACTOR = 1.4; // How much to slow down each iteration

/**
 * Component for the horizontal FLAMES letter animation
 * Animates a marker ring that moves through FLAMES letters, slowing down with easing
 * Shows confetti when the final result is revealed
 */
export function FlamesSlotMachine({ result, shouldAnimate, stage }: FlamesHighlightAnimationProps) {
  // References and state
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLDivElement | null)[]>(Array(letters.length).fill(null));
  const [letterPositions, setLetterPositions] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef(BASE_SPEED_MS);

  // Animation controls for the ring
  const ringControls = useAnimationControls();

  // Get result styling - using theme-based colors
  const { color: resultColorClass, glowColor } = result ? getResultVisuals(result) : { color: '', glowColor: '' };

  // Calculate letter positions after layout is complete
  useLayoutEffect(() => {
    if (containerRef.current && letterRefs.current.every((ref) => ref !== null)) {
      // Get container's left position as reference point
      const containerLeft = containerRef.current.getBoundingClientRect().left;

      // Calculate and store each letter's center position relative to container
      const positions = letterRefs.current.map((ref) => {
        if (!ref) return 0;
        const rect = ref.getBoundingClientRect();
        // Return center position relative to container
        return rect.left - containerLeft + rect.width / 2;
      });

      setLetterPositions(positions);
    }
  }, [stage]); // Recalculate on stage change since layout might shift

  // Animation logic with sequential steps
  const animateRing = useCallback(
    (index: number) => {
      if (index >= letters.length) index = 0;

      // Set current highlighted letter
      setCurrentIndex(index);

      // Get target position from calculated positions array
      const targetPosition = letterPositions[index];
      if (targetPosition === undefined) return;

      // Move ring to position
      ringControls.start({
        x: targetPosition,
        transition: {
          duration: speedRef.current / 1000,
          ease: 'easeInOut',
        },
      });

      // Get target letter index for the result
      const targetResultIndex = letters.findIndex((letter) => letter === result);

      // Check if we're at the result letter
      if (index === targetResultIndex) {
        // Increase slowdown
        speedRef.current = Math.min(speedRef.current * SLOWDOWN_FACTOR, MAX_SPEED_MS);

        // If slow enough, finish animation
        if (speedRef.current > MAX_SPEED_MS * 0.8) {
          setAnimationFinished(true);
          return; // Stop animation loop
        }
      }

      // Schedule next animation step
      animationRef.current = setTimeout(() => {
        animateRing((index + 1) % letters.length);
      }, speedRef.current);
    },
    [letterPositions, result, ringControls]
  );

  // Start animation when result is available during processing stage
  useEffect(() => {
    // Only start animation when:
    // 1. We have the result
    // 2. Animations are enabled
    // 3. We're in the processing stage
    // 4. Letter positions are calculated
    // 5. Animation hasn't already started
    const shouldStartAnimation =
      result &&
      shouldAnimate &&
      stage === 'processing' &&
      letterPositions.length === letters.length &&
      !animationStarted;

    if (shouldStartAnimation) {
      // Reset animation state
      speedRef.current = BASE_SPEED_MS;
      setAnimationFinished(false);
      setAnimationStarted(true);

      // Position ring at first letter and make visible
      ringControls.set({
        opacity: 1,
        x: letterPositions[0],
        scale: 1,
      });

      // Start animation with slight delay to ensure visibility
      animationRef.current = setTimeout(() => {
        animateRing(0);
      }, 300);
    }

    // When in result stage, ensure result is highlighted
    if (stage === 'result' && result) {
      setAnimationFinished(true);
      const resultIndex = letters.findIndex((l) => l === result);
      if (resultIndex >= 0 && letterPositions[resultIndex]) {
        ringControls.set({
          opacity: 1,
          x: letterPositions[resultIndex],
          scale: 1,
        });
      }
    }

    // Cleanup on unmount or dependency change
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [result, shouldAnimate, stage, letterPositions, animateRing, ringControls, animationStarted]);

  // Non-animated version
  if (!shouldAnimate) {
    const resultIndex = letters.findIndex((l) => l === result);
    return (
      <div className="relative flex justify-center space-x-2 py-6 md:space-x-4 md:py-8">
        {letters.map((letter, index) => (
          <div
            key={letter}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
            // Use theme colors for background and text
            className={`bg-surface dark:bg-surface-container-high flex h-12 w-12 items-center justify-center rounded-lg text-xl font-bold shadow-md md:h-16 md:w-16 md:text-2xl ${index === resultIndex && result ? `ring-primary ring-offset-background dark:ring-offset-background ring-2 ring-offset-2 ${resultColorClass}` : 'text-on-surface dark:text-on-surface'}`}
            aria-label={index === resultIndex ? `${letter} - this is the result` : letter}
          >
            {letter}
          </div>
        ))}
      </div>
    );
  }

  // Animated version
  return (
    <>
      <AnimatePresence>
        {animationFinished && result && <ConfettiEffect result={result} isActive={true} />}
      </AnimatePresence>

      <div ref={containerRef} className="relative flex justify-center space-x-2 py-6 md:space-x-4 md:py-8">
        {/* Absolutely positioned ring that moves between letters */}
        <motion.div
          className="pointer-events-none absolute top-0 z-10 flex items-center justify-center"
          style={{
            width: 'calc(3rem)', // Match letter width
            height: 'calc(100%)', // Match container height
            y: 0, // Centered vertically in container
            translateX: '-50%', // Center horizontally on target position
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ringControls}
        >
          {/* Use theme colors for ring */}
          <div className="border-primary dark:border-primary h-12 w-12 rounded-lg border-2 md:h-16 md:w-16" />
        </motion.div>

        {letters.map((letter, index) => {
          const isResult = letter === result;
          const isHighlighted = index === currentIndex;
          const isResultFinished = isResult && animationFinished;

          return (
            <motion.div
              key={letter}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              // Use theme colors for background and text
              className={`bg-surface dark:bg-surface-container-high relative flex h-12 w-12 items-center justify-center rounded-lg text-xl font-bold shadow-md transition-colors duration-200 md:h-16 md:w-16 md:text-2xl ${isResultFinished ? resultColorClass : 'text-on-surface dark:text-on-surface'}`}
              animate={{
                scale: isHighlighted ? 1.05 : 1,
                transition: { duration: 0.1 },
              }}
              aria-label={isResultFinished ? `${letter} - this is the result` : letter}
            >
              {letter}

              {/* Result glow effect with improved animation */}
              {isResultFinished && (
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  style={{
                    boxShadow: `0 0 15px 5px ${glowColor}`,
                  }}
                  aria-hidden="true"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

export default FlamesSlotMachine;
