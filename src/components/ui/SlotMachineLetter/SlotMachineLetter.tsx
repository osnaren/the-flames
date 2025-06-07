import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react'; // Removed unused useEffect, useState
import { FlamesResult } from '../../../features/flamesGame/flames.types';
import { resultData } from '../../../features/flamesGame/resultData';

interface SlotMachineLetterProps {
  letter: string;
  index: number;
  slotStopIndex: number;
  result: FlamesResult;
  // animationsEnabled prop removed
}

/**
 * A single letter slot in the FLAMES slot machine animation
 * Memoized to prevent unnecessary re-renders
 */
function SlotMachineLetter({ letter, index, slotStopIndex, result }: SlotMachineLetterProps) {
  const { shouldAnimate } = useAnimationPreferences();

  // Memoize these calculations to prevent unnecessary re-renders
  const isResult = useMemo(() => result === letter, [result, letter]);
  const hasStopped = useMemo(() => index <= slotStopIndex, [index, slotStopIndex]);
  const flames = useMemo(() => ['F', 'L', 'A', 'M', 'E', 'S'], []);

  // Get the appropriate icon color based on the current letter, memoized to prevent recalculation
  const letterColor = useMemo(() => {
    const currentLetter = letter as keyof typeof resultData;
    return resultData[currentLetter]?.color || 'text-gray-800 dark:text-gray-200';
  }, [letter]);

  // Compute accessibility attributes
  const accessibilityLabel = useMemo(() => {
    if (hasStopped) {
      return isResult ? `${letter} - this is the result` : letter;
    }
    return 'Spinning letter';
  }, [letter, hasStopped, isResult]);

  // Optimize animation variants
  const animationVariants = useMemo(
    () => ({
      stopped: { y: 0, opacity: 1 },
      initial: { y: 20, opacity: 0 },
      spinning: {
        y: ['0%', '-500%'],
        transition: {
          repeat: Infinity,
          duration: 0.5,
          ease: 'linear',
        },
      },
    }),
    []
  );

  // If reduced motion is preferred, show a simplified version
  if (!shouldAnimate) {
    return (
      <div
        className={`h-14 w-14 rounded-lg md:h-16 md:w-16 ${hasStopped ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'} ${isResult && hasStopped ? 'ring-2 ring-orange-400 ring-offset-2 dark:ring-offset-gray-900' : ''} relative flex items-center justify-center text-2xl font-bold shadow-md transition-all duration-200`}
        aria-label={accessibilityLabel}
        role="img"
      >
        <div className={`${isResult ? letterColor : 'text-gray-800 dark:text-gray-200'}`}>{letter}</div>
      </div>
    );
  }

  return (
    <div
      className={`h-14 w-14 rounded-lg md:h-16 md:w-16 ${hasStopped ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'} ${isResult && hasStopped ? 'ring-2 ring-orange-400 ring-offset-2 dark:ring-offset-gray-900' : ''} relative flex items-center justify-center overflow-hidden text-2xl font-bold shadow-md`}
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
          {flames.map((flameLetter) => (
            <div key={flameLetter} className="flex h-14 items-center justify-center md:h-16 dark:text-white">
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
