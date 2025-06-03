import { FlamesResult } from '@features/flamesGame/flames.types';
import { useFlamesEngine } from '@features/flamesGame/useFlamesEngine';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import FlamesSlotMachine from '../FlamesSlotMachine';
import NameTiles from '../NameTiles';

interface ProcessingViewProps {
  name1: string;
  name2: string;
  commonLetters: string[];
  result: FlamesResult | null;
  shouldAnimate: boolean;
  stage: 'input' | 'processing' | 'result';
}

/**
 * Component for displaying the processing animation
 */
export function ProcessingView({ name1, name2, commonLetters, result, shouldAnimate, stage }: ProcessingViewProps) {
  // Get state from flamesEngine for better synchronization
  const [{ isSlotMachineAnimating }] = useFlamesEngine();

  // State for cycling message animation
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    'Analyzing your connection...',
    'Calculating your destiny...',
    'Finding common bonds...',
    result ? 'Revealing your destiny...' : 'Almost there...',
  ];

  // Cycle through messages for more engaging experience
  useEffect(() => {
    if (!shouldAnimate) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [shouldAnimate, messages.length]);

  // Current status message
  const statusMessage = result ? 'Revealing your destiny...' : messages[messageIndex];

  return (
    <motion.div
      className="relative space-y-10 px-2 py-4"
      initial={shouldAnimate ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Name Tiles Section with margin for better spacing */}
      <motion.div
        className="mb-8"
        initial={shouldAnimate ? { y: -10, opacity: 0 } : { y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: shouldAnimate ? 0.3 : 0, duration: 0.5 }}
      >
        <NameTiles name1={name1} name2={name2} commonLetters={commonLetters} shouldAnimate={shouldAnimate} />
      </motion.div>

      {/* FLAMES horizontal highlight animation */}
      <FlamesSlotMachine result={result} shouldAnimate={shouldAnimate} stage={stage} />

      {/* Enhanced status message with text transitions */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldAnimate ? 0.7 : 0, duration: 0.5 }}
      >
        <div className="relative flex min-h-[2.5rem] min-w-[12rem] items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={statusMessage}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="bg-secondary-container/20 text-on-secondary-container dark:text-secondary inline-block rounded-full px-5 py-2 text-center text-sm font-medium italic"
                aria-live="polite"
              >
                {/* Add pulsing ellipsis effect to status message */}
                {statusMessage}
                <motion.span
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {result && isSlotMachineAnimating ? '' : '...'}
                </motion.span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProcessingView;
