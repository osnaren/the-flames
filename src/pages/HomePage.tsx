import { FlamesResult } from '@features/flamesGame/flames.types';
import {
  calculateFlamesResult,
  findCommonLetters,
  nameSchema,
  resultMeanings,
} from '@features/flamesGame/flames.utils';
import { useFlamesEngine } from '@features/flamesGame/useFlamesEngine';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { useShareActions } from '@hooks/useShareActions';
import ConfettiEffect from '@ui/ConfettiEffect';
import SharePopover from '@ui/SharePopover';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

// Import modular components
import FlamesSlotMachine from '@components/homepage/FlamesSlotMachine';
import InputForm from '@components/homepage/InputForm';
import NameTiles from '@components/homepage/NameTiles';
import ProcessingView from '@components/homepage/ProcessingView';
import ResultCard from '@components/homepage/ResultCard';

/**
 * Main HomePage component
 * Acts as a container/orchestrator for the FLAMES application
 */
function HomePage() {
  // Get URL search parameters
  const [searchParams] = useSearchParams();

  // Animation preferences using our custom hook
  const { shouldAnimate, animationsEnabled } = useAnimationPreferences();

  // References for scrolling and layout
  const resultCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for controlling animations and transition timing
  const [showIntroAmbientGlow, setShowIntroAmbientGlow] = useState(true);

  // FLAMES game engine state and actions
  const [
    { name1, name2, result, stage, commonLetters, anonymous, isSlotMachineAnimating },
    { setName1, setName2, handleSubmit, resetGame, setAnonymous },
  ] = useFlamesEngine();

  // Share functionality using our custom hook
  const { isSharePopoverOpen, setIsSharePopoverOpen, handleShare, handleCopyLink } = useShareActions(
    name1,
    name2,
    result
  );

  // Effect to track processing completion for a smoother transition to results
  useEffect(() => {
    if (stage === 'processing' && !isSlotMachineAnimating && result) {
      // Short delay before marking processing as complete for smoother transitions
      const timer = setTimeout(() => {}, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, isSlotMachineAnimating, result]);

  // Show/hide ambient glow based on stage
  useEffect(() => {
    setShowIntroAmbientGlow(stage === 'input');
  }, [stage]);

  // Scroll to results when they appear with a proper delay
  useEffect(() => {
    if (stage === 'result' && resultCardRef.current) {
      // Wait for animations to complete before scrolling
      const scrollDelay = shouldAnimate ? 800 : 100;
      const timer = setTimeout(() => {
        resultCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, scrollDelay);
      return () => clearTimeout(timer);
    }
  }, [stage, shouldAnimate]);

  // Handle URL parameters on component mount
  useEffect(() => {
    if (stage !== 'input') {
      // Skip if we're already past the input stage
      return;
    }

    const urlName1 = searchParams.get('name1');
    const urlName2 = searchParams.get('name2');

    // If both names are present in the URL, process them
    if (urlName1 && urlName2) {
      try {
        // Validate the names
        const validName1 = nameSchema.parse(urlName1);
        const validName2 = nameSchema.parse(urlName2);

        // Check if names are not identical
        if (validName1.toLowerCase() === validName2.toLowerCase()) {
          toast.error('Names cannot be the same!');
          return;
        }

        // Set the names in the form
        setName1(validName1);
        setName2(validName2);

        // Calculate result and update UI
        setAnonymous(true); // Default to anonymous for shared links

        // Use a timeout to ensure the UI updates with the names first
        setTimeout(() => {
          // Calculate common letters
          findCommonLetters(validName1, validName2);

          // Calculate result
          calculateFlamesResult(validName1, validName2);

          // Manually trigger the result flow via handleSubmit
          const event = new Event('submit') as unknown as React.FormEvent;
          handleSubmit(event);
        }, 100);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error('Invalid names in URL');
        } else {
          console.error('Error processing URL parameters:', error);
          toast.error('Something went wrong.');
        }
      }
    }
  }, [searchParams, stage, setName1, setName2, setAnonymous, handleSubmit]);

  // Memoized form submission handler
  const onSubmitForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center p-4 py-8 md:py-12"
      ref={containerRef}
    >
      {/* Confetti effect - remains active during result stage */}
      <ConfettiEffect result={result} isActive={stage === 'result'} />

      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="sr-only">FLAMES - Relationship Calculator</h1>
          <motion.p
            className="text-on-surface-variant dark:text-on-surface-variant text-lg font-medium"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            Discover your relationship destiny!
          </motion.p>
        </div>

        {/* Main content area with AnimatePresence for transitions */}
        <AnimatePresence>
          {/* Input Stage - Only shown during input stage */}
          {stage === 'input' && (
            <motion.div
              key="input"
              className="transition-shadow duration-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <InputForm
                name1={name1}
                name2={name2}
                setName1={setName1}
                setName2={setName2}
                onSubmit={onSubmitForm}
                shouldAnimate={shouldAnimate}
                animationsEnabled={animationsEnabled}
                anonymous={anonymous}
                setAnonymous={setAnonymous}
              />
            </motion.div>
          )}

          {/* Processing Stage - Shown during processing */}
          {stage === 'processing' && (
            <motion.div
              key="processing"
              className="bg-background/60 rounded-xl p-6 shadow-lg backdrop-blur-sm md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <ProcessingView
                name1={name1}
                name2={name2}
                commonLetters={commonLetters}
                result={result}
                shouldAnimate={shouldAnimate}
                stage={stage}
              />
            </motion.div>
          )}

          {/* Result Stage */}
          {stage === 'result' && (
            <motion.div
              key="result"
              className="relative space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Processing view components in a soft container */}
              <motion.div
                className="bg-background/60 rounded-xl p-6 shadow-sm backdrop-blur-sm md:p-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Keep NameTiles visible during result stage */}
                <NameTiles name1={name1} name2={name2} commonLetters={commonLetters} shouldAnimate={false} />

                {/* Keep FlamesSlotMachine visible during result stage */}
                <FlamesSlotMachine result={result} shouldAnimate={false} stage={stage} />
              </motion.div>

              {/* Result Card with ref for scrolling */}
              <div ref={resultCardRef}>
                <ResultCard
                  name1={name1}
                  name2={name2}
                  result={result as FlamesResult}
                  shouldAnimate={shouldAnimate}
                  onReset={resetGame}
                  onShare={handleShare}
                  onCopyLink={handleCopyLink}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Popover - remains outside AnimatePresence */}
      <SharePopover
        isOpen={isSharePopoverOpen}
        onClose={() => setIsSharePopoverOpen(false)}
        resultCardRef={resultCardRef}
        shareData={{
          name1,
          name2,
          result: result || '',
          resultText: result ? resultMeanings[result].text : '',
        }}
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(HomePage);
