import { FlamesResult } from '@features/flamesGame/flames.types';
import { calculateFlamesResult, findCommonLetters, nameSchema } from '@features/flamesGame/flames.utils';
import { getResultData } from '@features/flamesGame/resultData';
import { useFlamesEngine } from '@features/flamesGame/useFlamesEngine';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { useShareActions } from '@hooks/useShareActions';
import AmbientGlow from '@ui/AmbientGlow';
import ConfettiEffect from '@ui/ConfettiEffect';
import ParticleBackground from '@ui/ParticleBackground';
import SharePopover from '@ui/SharePopover';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

// Import modular components
import InputForm from '@components/homepage/InputForm';
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
  const { shouldAnimate } = useAnimationPreferences();

  // References for scrolling and layout
  const resultCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processingContainerRef = useRef<HTMLDivElement>(null);

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

  // Effect to handle timing between animations
  useEffect(() => {
    if (stage === 'processing' && !isSlotMachineAnimating && result) {
      // Short delay before transitioning to result stage
      // This is handled internally by the useFlamesEngine hook
    }
  }, [stage, isSlotMachineAnimating, result]);

  // Scroll to results when they appear with a proper delay
  useEffect(() => {
    if (stage === 'result' && resultCardRef.current) {
      // Wait for animations to complete before scrolling
      const scrollDelay = shouldAnimate ? 1000 : 100;
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
      {/* Enhanced ambient background effects */}
      <AmbientGlow isVisible={stage !== 'result'} />
      <ParticleBackground
        enabled={stage === 'input'}
        className="z-0"
        particleCount={shouldAnimate ? 15 : 0}
        color="var(--color-primary-container)"
      />

      {/* Confetti effect - remains active during result stage */}
      <ConfettiEffect result={result} isActive={stage === 'result'} />

      <div className="w-full max-w-lg">
        {/* Enhanced header with better visual hierarchy */}
        <motion.div
          className="mb-8 text-center"
          initial={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="sr-only">FLAMES - Relationship Calculator</h1>

          {/* Main title with magical effects */}
          <motion.div
            className="mb-4"
            animate={
              shouldAnimate
                ? {
                    textShadow: [
                      '0 0 20px rgba(var(--color-primary-rgb), 0.3)',
                      '0 0 30px rgba(var(--color-primary-rgb), 0.5)',
                      '0 0 20px rgba(var(--color-primary-rgb), 0.3)',
                    ],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <h2 className="text-primary dark:text-primary text-4xl font-bold tracking-tight md:text-5xl">
              F.L.A.M.E.S
            </h2>
          </motion.div>

          {/* Enhanced tagline with pulsing glow */}
          <motion.p
            className="text-on-surface-variant dark:text-on-surface-variant text-lg font-medium"
            animate={
              shouldAnimate
                ? {
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.02, 1],
                  }
                : { opacity: 1 }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            Enter two names and let the sparks fly ✨
          </motion.p>

          {/* Subtle magic sparkle animation */}
          {shouldAnimate && stage === 'input' && (
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2"
              animate={{
                y: [-5, -15, -5],
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <span className="text-2xl">✨</span>
            </motion.div>
          )}
        </motion.div>

        {/* Main content area with AnimatePresence for transitions */}
        <AnimatePresence mode="sync">
          {/* Input Stage - Only shown during input stage */}
          {stage === 'input' && (
            <motion.div
              key="input"
              className="bg-surface/80 border-outline/20 rounded-xl border p-6 shadow-lg backdrop-blur-sm transition-shadow duration-500 md:p-8"
              initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.6,
                type: 'spring',
                stiffness: 300,
                damping: 24,
              }}
            >
              <InputForm
                name1={name1}
                name2={name2}
                setName1={setName1}
                setName2={setName2}
                onSubmit={onSubmitForm}
                shouldAnimate={shouldAnimate}
                anonymous={anonymous}
                setAnonymous={setAnonymous}
              />
            </motion.div>
          )}

          {/* Shared container for processing and results - This ensures layout consistency */}
          {(stage === 'processing' || stage === 'result') && (
            <motion.div
              key="process-result-container"
              className="relative"
              initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              ref={processingContainerRef}
            >
              {/* Processing Stage */}
              <AnimatePresence mode="wait">
                <motion.div
                  key="processing"
                  className="bg-surface/80 border-outline/20 rounded-xl border p-6 shadow-lg backdrop-blur-sm md:p-8"
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProcessingView stage={stage} isVisible={stage === 'processing'} />
                </motion.div>
              </AnimatePresence>

              {/* Result Card - Positioned absolutely during transition, then normal flow */}
              <AnimatePresence>
                {stage === 'result' && (
                  <motion.div
                    key="result-card-container"
                    className="mt-8"
                    ref={resultCardRef}
                    initial={shouldAnimate ? { opacity: 0, y: 50, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                    }}
                  >
                    <ResultCard
                      name1={name1}
                      name2={name2}
                      result={result as FlamesResult}
                      stage={stage}
                      onRetry={() => {}}
                      onNavigateToManual={() => {}}
                      onNavigateToStats={() => {}}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
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
          resultText: result ? getResultData(result).text : '',
        }}
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(HomePage);
