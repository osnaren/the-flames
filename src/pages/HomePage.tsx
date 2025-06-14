import { useFlamesEngine } from '@features/flamesGame/useFlamesEngine';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useRef } from 'react';

// Import new components
import { CommonLettersStrike } from '@components/homepage/CommonLettersStrike';
import { FlamesAnimation } from '@components/homepage/FlamesAnimation';
import InputForm from '@components/homepage/InputForm';
import ResultCard from '@components/homepage/ResultCard';
import DynamicBackground from '@components/ui/DynamicBackground';
import ConfettiEffect from '@ui/ConfettiEffect';

/**
 * Completely revamped HomePage with streamlined architecture
 * Features centralized stage management, instant calculations, and enhanced animations
 */
function HomePage() {
  // Animation preferences
  const { shouldAnimate } = useAnimationPreferences();

  // References for scrolling and layout
  const resultCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processedElementsRef = useRef<HTMLDivElement>(null);

  // FLAMES game engine state and actions
  const [
    { name1, name2, result, stage, commonLetters, remainingLetters, anonymous, isProcessing, stageProgress },
    {
      setName1,
      setName2,
      handleSubmit,
      resetGame,
      setAnonymous,
      onCommonLettersComplete,
      onFlamesAnimationComplete,
      onResultReveal,
    },
  ] = useFlamesEngine();

  // Scroll to results when they appear
  useEffect(() => {
    if (stage === 'result' && resultCardRef.current) {
      const scrollDelay = shouldAnimate ? 1500 : 300;
      const timer = setTimeout(() => {
        resultCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, scrollDelay);
      return () => clearTimeout(timer);
    }
  }, [stage, shouldAnimate]);

  // Handle form submission with enhanced effects
  const onSubmitForm = useCallback(
    (e: React.FormEvent) => {
      handleSubmit(e);
    },
    [handleSubmit]
  );

  // Determine current season for background theming
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month === 1) return 'valentine'; // February
    if (month === 9) return 'halloween'; // October
    if (month === 11) return 'christmas'; // December
    return undefined;
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center p-4 py-8 md:py-12"
      ref={containerRef}
    >
      {/* Dynamic background system */}
      <DynamicBackground
        variant={stage === 'result' ? 'result' : stage === 'processing' ? 'processing' : 'default'}
        result={result}
        season={getCurrentSeason()}
        intensity="medium"
      />

      {/* Confetti effect for results */}
      <ConfettiEffect result={result} isActive={stage === 'result'} />

      <div className="w-full max-w-2xl">
        {/* Enhanced header with magical effects */}
        <motion.div
          className="mb-8 text-center"
          initial={shouldAnimate ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
          animate={{
            opacity: 1,
            y: stage === 'processing' ? -20 : 0,
            scale: stage === 'processing' ? 0.9 : 1,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="sr-only">FLAMES - Relationship Calculator</h1>

          {/* Main title with enhanced effects */}
          <motion.div
            className="mb-6"
            animate={
              shouldAnimate && stage === 'input'
                ? {
                    textShadow: [
                      '0 0 20px rgba(var(--color-primary-rgb), 0.3)',
                      '0 0 40px rgba(var(--color-primary-rgb), 0.6)',
                      '0 0 20px rgba(var(--color-primary-rgb), 0.3)',
                    ],
                  }
                : {}
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <h2 className="text-primary dark:text-primary text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              F.L.A.M.E.S
            </h2>
          </motion.div>

          {/* Enhanced tagline */}
          <motion.p
            className="text-on-surface-variant dark:text-on-surface-variant text-xl font-medium md:text-2xl"
            animate={
              shouldAnimate && stage === 'input'
                ? {
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.02, 1],
                  }
                : { opacity: 1 }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            Discover your relationship destiny ✨
          </motion.p>

          {/* Floating sparkles */}
          {shouldAnimate && stage === 'input' && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl"
                  style={{
                    left: `${30 + i * 20}%`,
                    top: `${-10 + i * 5}%`,
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2 + i,
                    delay: i * 0.5,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        {/* Main content area with stage-based transitions */}
        <AnimatePresence mode="wait">
          {/* Input Stage */}
          {stage === 'input' && (
            <motion.div
              key="input-stage"
              initial={shouldAnimate ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -50,
                scale: 0.8,
                filter: 'blur(8px)',
                rotateX: 45,
              }}
              transition={{
                duration: shouldAnimate ? 0.8 : 0,
                ease: 'easeInOut',
                type: 'spring',
                stiffness: 100,
                damping: 20,
              }}
              style={{ transformStyle: 'preserve-3d' }}
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
                stage={stage}
                isCollapsing={isProcessing}
              />
            </motion.div>
          )}

          {/* Processing Stage */}
          {stage === 'processing' && (
            <motion.div
              key="processing-stage"
              className="space-y-6"
              initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: shouldAnimate ? 0.6 : 0 }}
            >
              {/* Processing container */}
              <motion.div
                className="bg-surface/90 dark:bg-surface-container/90 border-outline/20 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
                animate={
                  shouldAnimate
                    ? {
                        boxShadow: [
                          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                          '0 0 80px rgba(var(--color-primary-rgb), 0.2)',
                          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Common Letters Strike Phase */}
                <AnimatePresence mode="wait">
                  {stageProgress.commonLettersRevealed && !stageProgress.flamesAnimationStarted && (
                    <motion.div
                      key="common-letters-phase"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -100,
                        scale: 0.8,
                        transition: { duration: 0.5 },
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <CommonLettersStrike
                        name1={name1}
                        name2={name2}
                        commonLetters={commonLetters}
                        onComplete={onCommonLettersComplete}
                        isVisible={true}
                      />
                    </motion.div>
                  )}

                  {/* FLAMES Animation Phase */}
                  {stageProgress.flamesAnimationStarted && !stageProgress.flamesAnimationComplete && (
                    <motion.div
                      key="flames-animation-phase"
                      initial={{ opacity: 0, y: 100, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        y: -100,
                        scale: 0.8,
                        transition: { duration: 0.5 },
                      }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <FlamesAnimation
                        remainingLetters={remainingLetters}
                        onComplete={onFlamesAnimationComplete}
                        isVisible={true}
                        result={result}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Show processed elements moving up */}
              {stageProgress.flamesAnimationStarted && (
                <motion.div
                  ref={processedElementsRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.6, y: -80 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="pointer-events-none text-center"
                >
                  <div className="text-on-surface-variant dark:text-on-surface-variant text-sm">
                    Common letters processed: {commonLetters.join(', ')}
                  </div>
                  <div className="text-on-surface-variant/60 dark:text-on-surface-variant/60 text-xs">
                    {remainingLetters.length} letters remaining for FLAMES
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Result Stage */}
          {stage === 'result' && result && (
            <motion.div
              key="result-stage"
              ref={resultCardRef}
              initial={shouldAnimate ? { opacity: 0, y: 50, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{
                duration: shouldAnimate ? 1 : 0,
                ease: 'easeOut',
                type: 'spring',
                stiffness: 200,
                damping: 25,
              }}
            >
              <ResultCard
                result={result}
                stage={stage}
                name1={name1}
                name2={name2}
                onRetry={resetGame}
                onNavigateToManual={() => window.open('/manual', '_blank')}
                onNavigateToStats={() => window.open('/charts', '_blank')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced footer with tips */}
        {stage === 'input' && (
          <motion.div
            className="mt-12 space-y-4 text-center"
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.p
              className="text-on-surface-variant/80 dark:text-on-surface-variant/80 text-sm"
              animate={
                shouldAnimate
                  ? {
                      opacity: [0.6, 1, 0.6],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity }}
            >
              💡 <strong>F</strong>riends • <strong>L</strong>ove • <strong>A</strong>ffection • <strong>M</strong>
              arriage • <strong>E</strong>nemies • <strong>S</strong>iblings
            </motion.p>

            <motion.p
              className="text-on-surface-variant/60 dark:text-on-surface-variant/60 text-xs"
              animate={
                shouldAnimate
                  ? {
                      opacity: [0.4, 0.8, 0.4],
                    }
                  : {}
              }
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              ✨ Experience the magic of the classic relationship game with modern flair
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default memo(HomePage);
