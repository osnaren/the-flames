import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Heart, Link2, BellRing as Ring, Share2, Star, Sword, Users, Wand2, X } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom'; // Kept for future navigation features
import { FlamesResult } from '@features/flamesGame/flames.types';
import { resultMeanings } from '@features/flamesGame/flames.utils';
import { useFlamesEngine } from '@features/flamesGame/useFlamesEngine';
import { copyShareUrl, shareResult } from '@lib/share';
import AmbientGlow from '@ui/AmbientGlow';
import Button from '@ui/Button';
import ConfettiEffect from '@ui/ConfettiEffect';
import ResultGlow from '@ui/ResultGlow';
import SharePopover from '@ui/SharePopover';
import SlotMachineLetter from '@ui/SlotMachineLetter';

interface HomePageProps {
  animationsEnabled: boolean;
}

function HomePage({ animationsEnabled }: HomePageProps) {
  // Keep navigate for future route handling implementations
  // const navigate = useNavigate(); // Reserved for future navigation features
  const resultCardRef = useRef<HTMLDivElement>(null);
  const resultActionsRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Use the custom FLAMES game engine hook
  const [
    { name1, name2, result, stage, commonLetters, slotStopIndex },
    { setName1, setName2, handleSubmit, resetGame },
  ] = useFlamesEngine({ animationsEnabled });

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
  const shouldAnimate = animationsEnabled && !prefersReducedMotion;

  // Auto-focus the first action button when result appears, or the name input when resetting
  useEffect(() => {
    if (stage === 'result' && resultActionsRef.current) {
      const firstButton = resultActionsRef.current.querySelector('button');
      if (firstButton instanceof HTMLElement) {
        setTimeout(
          () => {
            firstButton.focus();
          },
          shouldAnimate ? 1000 : 0
        ); // Delay to allow animations to complete
      }
    } else if (stage === 'input' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [stage, shouldAnimate]);

  // Memoized share handler to prevent unnecessary re-renders
  const handleShare = useCallback(async () => {
    if (!result) return;

    const shareData = {
      name1,
      name2,
      result,
      resultText: resultMeanings[result].text,
    };

    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await shareResult(shareData);
      } else {
        setIsSharePopoverOpen(true);
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share result');
    }
  }, [name1, name2, result]);

  // Memoized copy link handler
  const handleCopyLink = useCallback(async () => {
    try {
      await copyShareUrl(name1, name2);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy link');
    }
  }, [name1, name2]);

  // Memoized show manual mode handler
  const showManualMode = useCallback(() => {
    toast('Manual Mode coming soon!', {
      icon: '🔮',
    });
  }, []);

  // Reset game with keyboard focus management
  const handleReset = useCallback(() => {
    resetGame();
    // Focus will be handled by the useEffect above when stage changes
  }, [resetGame]);

  // Map the result letters to their respective icons
  const getIconComponent = useCallback((letter: FlamesResult) => {
    if (!letter) return Flame;

    switch (letter) {
      case 'F':
        return Users;
      case 'L':
        return Heart;
      case 'A':
        return Star;
      case 'M':
        return Ring;
      case 'E':
        return Sword;
      case 'S':
        return Users;
      default:
        return Flame;
    }
  }, []);

  const ResultIcon = getIconComponent(result);

  // Memoized letter renderer to prevent unnecessary re-renders
  const renderLetter = useCallback(
    (letter: string, isCommon: boolean, index: number) => (
      <motion.span
        key={`${letter}-${index}`}
        className={`mx-1 inline-block rounded px-2 py-1 ${
          isCommon
            ? 'bg-red-100 text-red-500 line-through dark:bg-red-950 dark:text-red-400'
            : 'bg-orange-100 dark:bg-orange-950 dark:text-orange-300'
        }`}
        initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldAnimate ? index * 0.1 : 0 }}
      >
        {letter}
      </motion.span>
    ),
    [shouldAnimate]
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
      <ConfettiEffect result={result} isActive={stage === 'result'} animationsEnabled={animationsEnabled} />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="sr-only">FLAMES - Relationship Calculator</h1>
          <p className="text-gray-700 dark:text-gray-300">Discover your relationship destiny!</p>
        </div>

        {/* Input form - only show when in input stage */}
        {stage === 'input' && (
          <motion.form
            onSubmit={onSubmitForm}
            className="relative space-y-6"
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Input form ambient glow */}
            <AmbientGlow isVisible={true} animationsEnabled={animationsEnabled} />

            <div className="mb-4">
              <label htmlFor="name1" className="sr-only">
                Your name
              </label>
              <input
                id="name1"
                ref={nameInputRef}
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Who are you? 💁"
                className="w-full rounded-lg border border-orange-200 px-4 py-3.5 transition-all duration-200 outline-none hover:border-orange-300 focus:scale-[1.01] focus:border-orange-500 focus:ring-2 focus:ring-orange-300 dark:border-orange-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:hover:border-orange-800 dark:focus:border-orange-600 dark:focus:ring-orange-800"
                required
                aria-label="Your name"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="name2" className="sr-only">
                Their name
              </label>
              <input
                id="name2"
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Their name? 💘"
                className="w-full rounded-lg border border-orange-200 px-4 py-3.5 transition-all duration-200 outline-none hover:border-orange-300 focus:scale-[1.01] focus:border-orange-500 focus:ring-2 focus:ring-orange-300 dark:border-orange-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:hover:border-orange-800 dark:focus:border-orange-600 dark:focus:ring-orange-800"
                required
                aria-label="Their name"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!name1.trim() || !name2.trim() || name1.trim() === name2.trim()}
            >
              FLAME ON! 🔥
            </Button>
          </motion.form>
        )}

        {/* Processing/Result Stage Content */}
        {(stage === 'processing' || stage === 'result') && (
          <motion.div
            className="relative space-y-8"
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Common ambient glow for processing stage */}
            {stage === 'processing' && <AmbientGlow isVisible={true} animationsEnabled={animationsEnabled} />}

            {/* Name Tiles Section */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex-1 text-center">
                <motion.p
                  className="mb-2 text-sm text-gray-700 dark:text-gray-300"
                  initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  {name1}
                </motion.p>
                <div className="flex flex-wrap justify-center">
                  {[...name1.toLowerCase()].map((letter, i) => renderLetter(letter, commonLetters.includes(letter), i))}
                </div>
              </div>
              <div className="mx-4 flex justify-center">
                <Flame className="h-8 w-8 animate-pulse text-orange-500 dark:text-orange-400" role="presentation" />
              </div>
              <div className="flex-1 text-center">
                <motion.p
                  className="mb-2 text-sm text-gray-700 dark:text-gray-300"
                  initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  {name2}
                </motion.p>
                <div className="flex flex-wrap justify-center">
                  {[...name2.toLowerCase()].map((letter, i) => renderLetter(letter, commonLetters.includes(letter), i))}
                </div>
              </div>
            </div>

            {/* FLAMES Slot Machine */}
            <motion.div
              className="flex justify-center space-x-2 pt-4 md:space-x-4"
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldAnimate ? 0.5 : 0 }}
            >
              {['F', 'L', 'A', 'M', 'E', 'S'].map((letter, i) => (
                <SlotMachineLetter
                  key={letter}
                  letter={letter}
                  index={i}
                  slotStopIndex={slotStopIndex}
                  result={result}
                  animationsEnabled={animationsEnabled}
                />
              ))}
            </motion.div>

            {/* Calculating message */}
            {stage === 'processing' && (
              <motion.p
                className="text-center text-sm text-gray-700 italic dark:text-gray-300"
                initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shouldAnimate ? 1 : 0 }}
                aria-live="polite"
              >
                Calculating your destiny...
              </motion.p>
            )}

            {/* Result Card */}
            <AnimatePresence>
              {stage === 'result' && (
                <motion.div
                  ref={resultCardRef}
                  className="relative mt-8 overflow-hidden rounded-xl bg-white p-8 text-center shadow-xl dark:bg-gray-800"
                  initial={shouldAnimate ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    delay: shouldAnimate ? 0.6 : 0,
                  }}
                  aria-live="polite"
                  role="region"
                  aria-label="FLAMES result"
                >
                  {/* Result-specific glow effect */}
                  <ResultGlow result={result} isVisible={true} animationsEnabled={animationsEnabled} />

                  <motion.div
                    className="mb-6"
                    initial={shouldAnimate ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: shouldAnimate ? 0.7 : 0 }}
                  >
                    <ResultIcon
                      className={`mx-auto h-16 w-16 ${result ? resultMeanings[result].color : ''}`}
                      aria-hidden="true"
                    />
                  </motion.div>

                  <h2 className="text-shadow mb-2 text-3xl font-bold dark:text-white">
                    {result ? resultMeanings[result].text : ''}
                  </h2>

                  <motion.p
                    className="mb-4 text-gray-700 dark:text-gray-300"
                    initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldAnimate ? 0.9 : 0 }}
                  >
                    {name1} and {name2} are destined to be {result ? resultMeanings[result].text.toLowerCase() : ''}!
                  </motion.p>

                  <motion.div
                    className="mb-8 rounded-lg bg-gray-50 p-3 text-sm italic dark:bg-gray-700 dark:text-gray-200"
                    initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldAnimate ? 1.1 : 0 }}
                  >
                    "{result ? resultMeanings[result].quote : ''}"
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-2 gap-3"
                    initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldAnimate ? 1.2 : 0 }}
                    ref={resultActionsRef}
                  >
                    <Button onClick={handleReset} variant="secondary" icon={X}>
                      Try Again
                    </Button>

                    <Button onClick={handleShare} variant="blue" icon={Share2} aria-label="Share your FLAMES result">
                      Share
                    </Button>

                    <Button
                      onClick={showManualMode}
                      variant="purple"
                      icon={Wand2}
                      aria-label="Try the manual calculation mode"
                    >
                      Manual Mode
                    </Button>

                    <Button
                      onClick={handleCopyLink}
                      variant="green"
                      icon={Link2}
                      aria-label="Copy a shareable link to your result"
                    >
                      Copy Link
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
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
