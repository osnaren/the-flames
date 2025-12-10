'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useBackgroundStore } from '@/store/useBackgroundStore';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { memo, useCallback, useEffect, useRef } from 'react';

// Critical components - loaded immediately
import { AnimatedHeader } from './components/AnimatedHeader';
import { InputForm } from './components/InputForm';
import { RecentMatchesSection } from './components/RecentMatches';
import type { MatchEntry } from './components/RecentMatches/types';
import { useFlamesEngine } from './hooks/useFlamesEngine';

// Dynamically loaded components for code splitting
const FlamesProcessor = dynamic(
  () => import('./components/FlamesProcessor').then((mod) => ({ default: mod.FlamesProcessor })),
  { ssr: false, loading: () => <ProcessingPlaceholder /> }
);

const ResultCard = dynamic(() => import('./components/ResultCard').then((mod) => mod.ResultCard), {
  ssr: false,
  loading: () => <ResultPlaceholder />,
});

// Lightweight loading placeholders
function ProcessingPlaceholder() {
  return (
    <div className="flex h-64 items-center justify-center">
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-pink-200 border-t-pink-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

function ResultPlaceholder() {
  return (
    <div className="mx-auto h-80 w-full max-w-md animate-pulse rounded-3xl bg-linear-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20" />
  );
}

/**
 * HomePage - Main FLAMES game page
 * Features streamlined stage management and beautiful animations
 */
function HomePage() {
  const { shouldAnimate } = useAnimationPreferences();
  const { setBackgroundState } = useBackgroundStore();

  // References for scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // FLAMES game engine state and actions
  const [
    { name1, name2, result, stage, runId, commonLetters, remainingLetters, isProcessing },
    { setName1, setName2, handleSubmit, resetGame, onFlamesAnimationComplete },
  ] = useFlamesEngine();

  // Sync game state with background system
  useEffect(() => {
    const variant = stage === 'result' ? 'result' : stage === 'processing' ? 'processing' : 'default';
    setBackgroundState({ variant, result });
  }, [stage, result, setBackgroundState]);

  // Scroll to results when they appear
  useEffect(() => {
    if (stage === 'result' && resultSectionRef.current) {
      const scrollDelay = shouldAnimate ? 800 : 200;
      const timer = setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, scrollDelay);
      return () => clearTimeout(timer);
    }
  }, [stage, shouldAnimate]);

  // Handle form submission
  const onSubmitForm = useCallback(
    (e: React.FormEvent) => {
      handleSubmit(e);
    },
    [handleSubmit]
  );

  // Handle processor completion - moves to result stage
  const handleProcessorComplete = useCallback(() => {
    onFlamesAnimationComplete();
  }, [onFlamesAnimationComplete]);

  // Handle replay from recent matches
  const handleMatchReplay = useCallback(
    (match: MatchEntry) => {
      // Reset game first if in result stage
      if (stage === 'result') {
        resetGame();
      }

      // Set names from the match (with a small delay to ensure reset completes)
      setTimeout(() => {
        setName1(match.name1);
        setName2(match.name2);
      }, 50);
    },
    [stage, resetGame, setName1, setName2]
  );

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 md:py-12"
      ref={containerRef}
      aria-label="FLAMES Game"
    >
      <div className="relative z-10 w-full max-w-2xl">
        {/* Animated Header */}
        <AnimatedHeader shouldAnimate={shouldAnimate} stage={stage} />

        {/* Main content area with stage-based transitions */}
        <AnimatePresence mode="wait">
          {/* Input Stage */}
          {stage === 'input' && (
            <motion.div
              key="input-stage"
              initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -30,
                scale: 0.95,
                filter: 'blur(4px)',
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <InputForm
                name1={name1}
                name2={name2}
                setName1={setName1}
                setName2={setName2}
                onSubmit={onSubmitForm}
                shouldAnimate={shouldAnimate}
                stage={stage}
                isCollapsing={isProcessing}
                isProcessing={isProcessing}
              />
            </motion.div>
          )}

          {/* Processing Stage - New unified processor */}
          {stage === 'processing' && (
            <motion.div
              key="processing-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <FlamesProcessor
                key={`${runId}`}
                name1={name1}
                name2={name2}
                commonLetters={commonLetters}
                remainingCount={remainingLetters.length}
                result={result}
                onComplete={handleProcessorComplete}
                shouldAnimate={shouldAnimate}
              />
            </motion.div>
          )}

          {/* Result Stage */}
          {stage === 'result' && result && (
            <motion.div
              key="result-stage"
              ref={resultSectionRef}
              initial={shouldAnimate ? { opacity: 0, y: 40, scale: 0.95 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: 'spring',
                stiffness: 150,
                damping: 20,
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

        {/* Footer tips - only on input stage */}
        {stage === 'input' && (
          <motion.div
            className="mt-12 space-y-3 text-center"
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            role="note"
            aria-label="FLAMES meaning legend"
          >
            <p className="font-space text-on-surface-variant/80 text-sm font-medium">
              <span className="text-blue-500">F</span>riends •<span className="text-pink-500"> L</span>ove •
              <span className="text-amber-500"> A</span>ffection •<span className="text-emerald-500"> M</span>arriage •
              <span className="text-red-500"> E</span>nemies •<span className="text-purple-500"> S</span>iblings
            </p>

            <p className="font-handwriting text-on-surface-variant/60 text-xs">
              ✨ The classic relationship game, reimagined with modern magic ✨
            </p>
          </motion.div>
        )}

        {/* Recent Matches Section - only on input stage */}
        {stage === 'input' && (
          <motion.div
            className="mt-8"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <RecentMatchesSection displayCount={5} onMatchClick={handleMatchReplay} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default memo(HomePage);
