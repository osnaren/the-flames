import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { useTimers } from '@/hooks/useTimers';
import { GameStage } from '@features/flamesGame/flames.types';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';

interface ProcessingViewProps {
  stage: GameStage;
  isVisible?: boolean;
}

const processingMessages = [
  'Analyzing your names...',
  'Calculating compatibility...',
  'Finding common letters...',
  'Running FLAMES algorithm...',
  'Preparing your result...',
];

const INTRO_DELAY = 300;
const MESSAGE_INTERVAL = 1200;

/**
 * Component for displaying the processing animation
 * Enhanced with better timing and visual feedback
 */
export function ProcessingView({ stage, isVisible = false }: ProcessingViewProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const { addTimeout, addInterval, clearAll } = useTimers();

  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  // Reset state when stage changes
  useEffect(() => {
    if (stage !== 'processing') {
      setHasIntroPlayed(false);
      setCurrentMessageIndex(0);
      setShowOverlay(false);
      clearAll();
    }
  }, [stage, clearAll]);

  // Handle the intro sequence and message progression
  useEffect(() => {
    if (stage !== 'processing' || !isVisible) return;

    // Clear any existing timers when starting fresh
    clearAll();

    // Start intro animation
    if (!hasIntroPlayed) {
      setShowOverlay(true);

      const introTimer = addTimeout(() => {
        setHasIntroPlayed(true);

        // Start message progression
        const messageInterval = addInterval(() => {
          setCurrentMessageIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= processingMessages.length) {
              // Reset to start for continuous loop
              return 0;
            }
            return nextIndex;
          });
        }, MESSAGE_INTERVAL);

        // Keep reference for cleanup
        return () => clearInterval(messageInterval);
      }, INTRO_DELAY);

      return () => clearTimeout(introTimer);
    }
  }, [stage, isVisible, hasIntroPlayed, addTimeout, addInterval, clearAll]);

  const getMessageAnimation = useCallback(
    (index: number) => {
      if (!shouldAnimate) {
        return {
          opacity: currentMessageIndex === index ? 1 : 0,
          y: 0,
          scale: 1,
        };
      }

      return currentMessageIndex === index
        ? {
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -20],
            scale: [0.95, 1, 1, 0.95],
          }
        : {
            opacity: 0,
            y: 20,
            scale: 0.95,
          };
    },
    [currentMessageIndex, shouldAnimate]
  );

  // Don't render if not in processing stage
  if (stage !== 'processing') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showOverlay ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldAnimate ? 0.8 : 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      {/* Dramatic intro overlay */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: hasIntroPlayed ? 1 : 0.8,
          opacity: hasIntroPlayed ? 1 : 0,
        }}
        transition={{
          duration: shouldAnimate ? 1.2 : 0,
          ease: 'easeOut',
        }}
        className="relative p-8 text-center"
      >
        {/* Pulsing background glow */}
        {shouldAnimate && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Main processing content */}
        <div className="relative z-10">
          {/* Spinning loader */}
          <motion.div
            className="mx-auto mb-8 h-16 w-16 rounded-full border-4 border-white/20 border-t-white"
            animate={shouldAnimate ? { rotate: 360 } : {}}
            transition={
              shouldAnimate
                ? {
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }
                : {}
            }
          />

          {/* Status messages */}
          <div className="relative mb-4 h-8">
            {processingMessages.map((message: string, index: number) => (
              <motion.p
                key={`${message}-${index}`}
                className="absolute inset-0 text-xl font-medium text-white"
                animate={getMessageAnimation(index)}
                transition={{
                  duration: shouldAnimate ? 0.8 : 0,
                  ease: 'easeInOut',
                }}
              >
                {message}
              </motion.p>
            ))}
          </div>

          {/* Progress indicator */}
          {shouldAnimate && (
            <motion.div
              className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          )}

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-sm text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldAnimate ? 1 : 0 }}
          >
            This may take a moment...
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProcessingView;
