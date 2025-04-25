import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, memo } from 'react';
import { FlamesResult } from '../../../features/flamesGame/flames.types';
import { resultMeanings } from '../../../features/flamesGame/flames.utils';

interface SlotMachineLetterProps {
  letter: string;
  index: number;
  slotStopIndex: number;
  result: FlamesResult;
  animationsEnabled?: boolean;
}

/**
 * A single letter slot in the FLAMES slot machine animation
 * Memoized to prevent unnecessary re-renders
 */
function SlotMachineLetter({ 
  letter, 
  index, 
  slotStopIndex, 
  result,
  animationsEnabled = true 
}: SlotMachineLetterProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);
  
  // Should we enable animations based on both user settings and system preferences
  const shouldAnimate = useMemo(() => {
    return animationsEnabled && !prefersReducedMotion;
  }, [animationsEnabled, prefersReducedMotion]);
  
  // Memoize these calculations to prevent unnecessary re-renders
  const isResult = useMemo(() => result === letter, [result, letter]);
  const hasStopped = useMemo(() => index <= slotStopIndex, [index, slotStopIndex]);
  const flames = useMemo(() => ['F', 'L', 'A', 'M', 'E', 'S'], []);
  
  // Get the appropriate icon color based on the current letter, memoized to prevent recalculation
  const letterColor = useMemo(() => {
    const currentLetter = letter as keyof typeof resultMeanings;
    return resultMeanings[currentLetter]?.color || 'text-gray-800 dark:text-gray-200';
  }, [letter]);
  
  // Compute accessibility attributes
  const accessibilityLabel = useMemo(() => {
    if (hasStopped) {
      return isResult 
        ? `${letter} - this is the result` 
        : letter;
    }
    return 'Spinning letter';
  }, [letter, hasStopped, isResult]);
  
  // Optimize animation variants
  const animationVariants = useMemo(() => ({
    stopped: { y: 0, opacity: 1 },
    initial: { y: 20, opacity: 0 },
    spinning: { 
      y: ['0%', '-500%'],
      transition: { 
        repeat: Infinity, 
        duration: 0.5,
        ease: 'linear'
      }
    }
  }), []);
  
  // If reduced motion is preferred, show a simplified version
  if (!shouldAnimate) {
    return (
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-lg 
        ${hasStopped ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'} 
        ${isResult && hasStopped ? 'ring-2 ring-offset-2 ring-orange-400 dark:ring-offset-gray-900' : ''} 
        shadow-md flex items-center justify-center text-2xl font-bold relative transition-all duration-200`}
        aria-label={accessibilityLabel}
        role="img"
      >
        <div className={`${isResult ? letterColor : 'text-gray-800 dark:text-gray-200'}`}>
          {letter}
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={`w-14 h-14 md:w-16 md:h-16 rounded-lg 
      ${hasStopped ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'} 
      ${isResult && hasStopped ? 'ring-2 ring-offset-2 ring-orange-400 dark:ring-offset-gray-900' : ''} 
      shadow-md overflow-hidden flex items-center justify-center text-2xl font-bold relative`}
      aria-label={accessibilityLabel}
      role="img"
    >
      {hasStopped ? (
        <motion.div
          initial="initial"
          animate="stopped"
          variants={animationVariants}
          className={`${isResult ? letterColor : 'text-gray-800 dark:text-gray-200'}`}
        >
          {letter}
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate="spinning"
          variants={animationVariants}
          aria-hidden="true"
        >
          {flames.map(flameLetter => (
            <div key={flameLetter} className="h-14 md:h-16 flex items-center justify-center dark:text-white">
              {flameLetter}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(SlotMachineLetter);