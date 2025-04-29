import { FlamesResult } from '@features/flamesGame/flames.types';
import { resultMeanings } from '@features/flamesGame/flames.utils';
import { useFlamesEngine } from '@features/flamesGame/useFlamesEngine';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { useShareActions } from '@hooks/useShareActions';
import ConfettiEffect from '@ui/ConfettiEffect';
import SharePopover from '@ui/SharePopover';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useRef } from 'react';

// Import modular components
import InputForm from '@components/homepage/InputForm';
import ProcessingView from '@components/homepage/ProcessingView';
import ResultCard from '@components/homepage/ResultCard';

/**
 * Main HomePage component
 * Acts as a container/orchestrator for the FLAMES application
 */
function HomePage() {
  // Animation preferences using our custom hook
  const { shouldAnimate, animationsEnabled } = useAnimationPreferences();

  // References
  const resultCardRef = useRef<HTMLDivElement>(null);

  // FLAMES game engine state and actions
  const [
    { name1, name2, result, stage, commonLetters, slotStopIndex, anonymous },
    { setName1, setName2, handleSubmit, resetGame, setAnonymous },
  ] = useFlamesEngine({ animationsEnabled });

  // Share functionality using our custom hook
  const { isSharePopoverOpen, setIsSharePopoverOpen, handleShare, handleCopyLink } = useShareActions(
    name1,
    name2,
    result
  );

  // Memoized form submission handler
  const onSubmitForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Confetti effect */}
      <ConfettiEffect result={result} isActive={stage === 'result'} />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="sr-only">FLAMES - Relationship Calculator</h1>
          <p className="text-gray-700 dark:text-gray-300">Discover your relationship destiny!</p>
        </div>

        {/* Input form - only show when in input stage */}
        {stage === 'input' && (
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
        )}

        {/* Processing Stage Content */}
        {stage === 'processing' && (
          <ProcessingView
            name1={name1}
            name2={name2}
            commonLetters={commonLetters}
            slotStopIndex={slotStopIndex}
            result={result}
            shouldAnimate={shouldAnimate}
            animationsEnabled={animationsEnabled}
          />
        )}

        {/* Result Stage Content */}
        <AnimatePresence>
          {stage === 'result' && (
            <div ref={resultCardRef}>
              <motion.div
                className="relative space-y-8"
                initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Name comparisons and slot machine */}
                <ProcessingView
                  name1={name1}
                  name2={name2}
                  commonLetters={commonLetters}
                  slotStopIndex={slotStopIndex}
                  result={result}
                  shouldAnimate={shouldAnimate}
                  animationsEnabled={animationsEnabled}
                />

                {/* Result Card */}
                <ResultCard
                  name1={name1}
                  name2={name2}
                  result={result as FlamesResult}
                  shouldAnimate={shouldAnimate}
                  animationsEnabled={animationsEnabled}
                  onReset={resetGame}
                  onShare={handleShare}
                  onCopyLink={handleCopyLink}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Popover */}
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
