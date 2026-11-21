'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useBackgroundStore } from '@/store/useBackgroundStore';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';

// Critical components - loaded immediately
import { AnimatedHeader } from './components/AnimatedHeader';
import { InputForm } from './components/InputForm';
import { RecentMatchesSection } from './components/RecentMatches';
import type { MatchEntry } from './components/RecentMatches/types';
import { useFlamesEngine } from './hooks/useFlamesEngine';
import type { NonNullFlamesResult } from './types';

// Dynamically loaded components for code splitting
const FlamesProcessor = dynamic(
  () => import('./components/FlamesProcessor').then((mod) => ({ default: mod.FlamesProcessor })),
  { ssr: false, loading: () => <ProcessingPlaceholder /> }
);

const loadResult = () => import('./components/ResultCard');
const loadProcessor = () => import('./components/FlamesProcessor');
const ResultCard = lazy(() => loadResult().then(({ ResultCard }) => ({ default: ResultCard })));

function prepareResult(result: NonNullFlamesResult) {
  void loadResult()
    .then(({ preloadResultIcon }) => preloadResultIcon(result))
    .catch(() => {});
}

// Fetch the game chunks once the player shows intent (focus or tap on the form),
// so pressing "Reveal" never waits on the network or a cold parse.
let gameChunksRequested = false;
function prefetchGameChunks() {
  if (gameChunksRequested) return;
  gameChunksRequested = true;
  void loadProcessor().catch(() => {
    gameChunksRequested = false;
  });
  void loadResult().catch(() => {});
}

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

// Only this invisible subscriber needs client URL state. Keeping it inside its
// own boundary lets the calculator's title and form remain server-rendered.
function NameQuerySync({ setName1, setName2 }: { setName1: (name: string) => void; setName2: (name: string) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    const first = params.get('name1');
    const second = params.get('name2');
    if (first) setName1(first);
    if (second) setName2(second);
  }, [params, setName1, setName2]);
  return null;
}

/**
 * HomePage - Main FLAMES game page
 * Features streamlined stage management and beautiful animations
 */
function HomePage() {
  const { shouldAnimate } = useAnimationPreferences();
  const setBackgroundState = useBackgroundStore((state) => state.setBackgroundState);
  const { resumeThemeBGM, isGameActive } = useSoundSystem();

  // References for scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceHeight, setWorkspaceHeight] = useState<number>();
  const [skipHero, setSkipHero] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // FLAMES game engine state and actions
  const [
    { name1, name2, result, stage, runId, remainingLetters, isProcessing },
    { setName1, setName2, handleSubmit, resetGame, onFlamesAnimationComplete },
  ] = useFlamesEngine();

  // Resume theme BGM when navigating away from game page if game was in progress
  useEffect(() => {
    return () => {
      // On unmount, if game was in progress, resume theme BGM
      if (isGameActive()) {
        resumeThemeBGM();
      }
    };
  }, [isGameActive, resumeThemeBGM]);

  // Sync game state with background system
  useEffect(() => {
    const variant = stage === 'result' ? 'result' : stage === 'processing' ? 'processing' : 'default';
    setBackgroundState({ variant, result });
  }, [stage, result, setBackgroundState]);

  // The reserved height only protects the page from jumping while the game is
  // running. Release it when the player is back on the form.
  useEffect(() => {
    if (stage === 'input') setWorkspaceHeight(undefined);
  }, [stage]);

  // Warm the game chunks during idle time as a fallback for players who paste
  // names or arrive with a shared link.
  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      const timer = setTimeout(prefetchGameChunks, 4000);
      return () => clearTimeout(timer);
    }
    const id = window.requestIdleCallback(prefetchGameChunks, { timeout: 6000 });
    return () => window.cancelIdleCallback(id);
  }, []);

  const scrollToResult = useCallback(() => {
    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    resultSectionRef.current?.scrollIntoView({
      behavior: shouldAnimate ? 'smooth' : 'instant',
      block: compact ? 'start' : 'center',
    });
  }, [shouldAnimate]);

  // Handle form submission
  const onSubmitForm = useCallback(
    (e: React.FormEvent) => {
      // Keep the guide and title still throughout delayed game transitions.
      if (workspaceRef.current) setWorkspaceHeight(workspaceRef.current.getBoundingClientRect().height);
      prefetchGameChunks();
      setHasPlayed(true);
      handleSubmit(e);
    },
    [handleSubmit]
  );

  // Handle processor completion - moves to result stage
  const handleProcessorComplete = useCallback(
    (skipAnimation = false) => {
      setSkipHero(skipAnimation);
      onFlamesAnimationComplete();
    },
    [onFlamesAnimationComplete]
  );

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
      className="relative flex flex-col items-center px-4 pt-4 pb-10 md:pt-8 md:pb-16"
      ref={containerRef}
      aria-label="FLAMES Game"
      onFocusCapture={prefetchGameChunks}
      onPointerDownCapture={prefetchGameChunks}
    >
      <Suspense fallback={null}>
        <NameQuerySync setName1={setName1} setName2={setName2} />
      </Suspense>
      <div className="relative z-10 w-full max-w-2xl">
        {/* Animated Header */}
        <AnimatedHeader shouldAnimate={shouldAnimate} stage={stage} />

        {/* Main content area with stage-based transitions */}
        <div ref={workspaceRef} style={{ minHeight: workspaceHeight }}>
          <AnimatePresence mode="wait">
            {/* Input Stage */}
            {stage === 'input' && (
              <motion.div
                key="input-stage"
                initial={hasPlayed && shouldAnimate ? { opacity: 0, y: 24 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldAnimate
                    ? {
                        opacity: 0,
                        y: -30,
                        scale: 0.95,
                      }
                    : undefined
                }
                transition={{
                  duration: 0.35,
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

                <div
                  className="motion-rise mt-8 space-y-2 text-center md:mt-10"
                  style={{ '--rise-delay': '0.35s' } as React.CSSProperties}
                  role="note"
                  aria-label="FLAMES meaning legend"
                >
                  <p className="font-space text-on-surface-variant/80 text-sm font-medium">
                    <span className="text-blue-500">F</span>riends •<span className="text-pink-500"> L</span>ove •
                    <span className="text-amber-500"> A</span>ffection •<span className="text-emerald-500"> M</span>
                    arriage •<span className="text-red-500"> E</span>nemies •<span className="text-purple-500"> S</span>
                    iblings
                  </p>

                  <p className="font-handwriting text-on-surface-variant/60 text-xs">
                    ✨ The classic relationship game, reimagined with modern magic ✨
                  </p>
                </div>

                <div className="motion-rise mt-10 md:mt-14" style={{ '--rise-delay': '0.5s' } as React.CSSProperties}>
                  <RecentMatchesSection displayCount={5} onMatchClick={handleMatchReplay} />
                </div>
              </motion.div>
            )}

            {/* Processing Stage - New unified processor */}
            {stage === 'processing' && (
              <div key="processing-stage">
                <FlamesProcessor
                  key={`${runId}`}
                  name1={name1}
                  name2={name2}
                  remainingCount={remainingLetters.length}
                  result={result}
                  onPrepareResult={prepareResult}
                  onComplete={handleProcessorComplete}
                  shouldAnimate={shouldAnimate}
                />
              </div>
            )}

            {/* Result Stage */}
            {stage === 'result' && result && (
              <motion.div
                key="result-stage"
                ref={resultSectionRef}
                className="scroll-mt-20"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={shouldAnimate ? { opacity: 0, y: -20, scale: 0.95 } : undefined}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
              >
                <Suspense fallback={<ResultPlaceholder />}>
                  <ResultCard
                    result={result}
                    stage={stage}
                    name1={name1}
                    name2={name2}
                    skipHero={skipHero}
                    onResultVisible={scrollToResult}
                    onRetry={resetGame}
                    onNavigateToManual={() => window.open('/manual', '_blank')}
                    onNavigateToStats={() => window.open('/charts', '_blank')}
                  />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default memo(HomePage);
