import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Heart, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ConfettiEffect from '@/components/ui/ConfettiEffect/ConfettiEffect';
import ResultGlow from '@/components/ui/ResultGlow/ResultGlow';
import { FlamesResult, GameStage, NonNullFlamesResult } from '@features/flamesGame/flames.types';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { useStaggeredAnimation } from '@hooks/useStaggeredAnimation';

interface ResultCardProps {
  result: FlamesResult;
  stage: GameStage;
  name1?: string;
  name2?: string;
  onRetry: () => void;
  onNavigateToManual?: () => void;
  onNavigateToStats?: () => void;
}

// Animation stages configuration - faster timing for snappier feel
const ANIMATION_STAGES = ['entry', 'icon', 'title', 'description', 'quote', 'actions'];
const ANIMATION_DELAYS = [100, 250, 400, 550, 700, 850]; // ~40% faster

// Result configuration for colors and labels
const RESULT_CONFIG: Record<NonNullFlamesResult, { label: string; gradient: string; icon: 'heart' | 'sparkles' }> = {
  F: { label: 'FRIENDSHIP', gradient: 'from-blue-500 to-indigo-600', icon: 'sparkles' },
  L: { label: 'LOVE', gradient: 'from-pink-500 to-rose-500', icon: 'heart' },
  A: { label: 'AFFECTION', gradient: 'from-amber-500 to-orange-500', icon: 'heart' },
  M: { label: 'MARRIAGE', gradient: 'from-emerald-500 to-green-600', icon: 'heart' },
  E: { label: 'ENEMY', gradient: 'from-red-500 to-red-600', icon: 'sparkles' },
  S: { label: 'SIBLING', gradient: 'from-purple-500 to-violet-600', icon: 'sparkles' },
};

// Get description based on result
const getFlamesDescription = (result: NonNullFlamesResult, name1?: string, name2?: string): string => {
  const names = name1 && name2 ? `**${name1}** and **${name2}**` : 'You two';

  const descriptions: Record<NonNullFlamesResult, string> = {
    F: `${names} are destined to be great friends! Your connection is built on trust and mutual respect.`,
    L: `${names} share a deep romantic love! Your hearts beat as one in a beautiful love story.`,
    A: `${names} have a warm affection! There's a special fondness and care in your relationship.`,
    M: `${names} are meant for marriage! Your souls are perfectly aligned for a lifetime together.`,
    E: `${names} have some conflicts to resolve. But enemies can become friends with understanding.`,
    S: `${names} share a sibling-like bond! Your relationship is filled with care and family-like love.`,
  };
  
  return descriptions[result];
};

const getFlamesQuote = (result: NonNullFlamesResult): string => {
  const quotes: Record<NonNullFlamesResult, string> = {
    F: 'Friendship is the only cement that will ever hold the world together.',
    L: 'Love is about how much you love each other every single day.',
    A: 'Affection is responsible for nine-tenths of our solid happiness.',
    M: 'A successful marriage requires falling in love many times, always with the same person.',
    E: 'The best way to destroy an enemy is to make them a friend.',
    S: 'Siblings teach us about fairness, cooperation, and unconditional love.',
  };
  
  return quotes[result];
};

/**
 * Component for displaying the FLAMES result with enhanced animations and effects
 */
export function ResultCard({
  result,
  stage,
  name1,
  name2,
  onRetry,
  onNavigateToManual,
  onNavigateToStats,
}: ResultCardProps) {
  const { shouldAnimate } = useAnimationPreferences();

  // Use the staggered animation hook
  const { stageCompleted, hasStarted, startAnimation, resetAnimation } = useStaggeredAnimation({
    stages: ANIMATION_STAGES,
    delays: ANIMATION_DELAYS,
    shouldAnimate,
  });

  // Track the visible state for the container
  const [isVisible, setIsVisible] = useState(false);

  // Early return if not in result stage or no result
  const isValidResult = stage === 'result' && result !== null;

  // Cast to strict type after null check for type safety
  const strictResult = result as NonNullFlamesResult;

  // Memoize result configuration (use F as fallback, but we only render if result is valid)
  const config = useMemo(
    () => (result ? RESULT_CONFIG[strictResult] : RESULT_CONFIG.F),
    [result, strictResult]
  );
  const description = useMemo(
    () => (result ? getFlamesDescription(strictResult, name1, name2) : ''),
    [result, strictResult, name1, name2]
  );
  const quote = useMemo(() => (result ? getFlamesQuote(strictResult) : ''), [result, strictResult]);
  const isResultPositive = result === 'L' || result === 'A' || result === 'M';

  // Start animation when component becomes visible
  useEffect(() => {
    if (isValidResult && !hasStarted) {
      setIsVisible(true);
      startAnimation();
    } else if (!isValidResult) {
      setIsVisible(false);
      resetAnimation();
    }
  }, [isValidResult, hasStarted, startAnimation, resetAnimation]);

  const ResultIcon = config.icon === 'heart' ? Heart : Sparkles;

  const handleShare = useCallback(() => {
    const text = name1 && name2 ? `${name1} + ${name2} = ${config.label}! 💕` : `My FLAMES result is ${config.label}! 💕`;

    if (navigator.share) {
      navigator
        .share({
          title: 'FLAMES Game Result',
          text,
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard?.writeText(`${text} ${window.location.href}`);
        });
    } else {
      navigator.clipboard?.writeText(`${text} ${window.location.href}`);
    }
  }, [config.label, name1, name2]);

  // Don't render if no valid result
  if (!isValidResult) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{
            opacity: stageCompleted.entry ? 1 : 0,
            y: stageCompleted.entry ? 0 : 40,
            scale: stageCompleted.entry ? 1 : 0.95,
          }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            duration: shouldAnimate ? 0.4 : 0,
          }}
          className="relative mx-auto mt-6 w-full max-w-md will-change-transform"
        >
          {/* Result Glow Effect */}
          <ResultGlow result={result} isVisible={stageCompleted.entry} />

          {/* Confetti Effect for positive results */}
          {isResultPositive && stageCompleted.entry && <ConfettiEffect result={result} isActive={true} />}

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-5`} />

            {/* Content */}
            <div className="relative p-6 text-center sm:p-8">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: stageCompleted.icon ? 1 : 0,
                  rotate: stageCompleted.icon ? 0 : -180,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  duration: shouldAnimate ? 0.5 : 0,
                }}
                className="mx-auto mb-5 will-change-transform"
              >
                <div className={`relative h-16 w-16 rounded-full bg-linear-to-br ${config.gradient} p-3 shadow-lg sm:h-20 sm:w-20 sm:p-4`}>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-full bg-linear-to-br ${config.gradient} opacity-40 blur-md`} />
                  <ResultIcon className="relative z-10 h-full w-full text-white" />
                </div>
              </motion.div>

              {/* Result Title */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: stageCompleted.title ? 1 : 0,
                  y: stageCompleted.title ? 0 : 15,
                }}
                transition={{
                  duration: shouldAnimate ? 0.4 : 0,
                  ease: 'easeOut',
                }}
                className={`mb-3 text-3xl font-bold tracking-tight sm:text-4xl bg-linear-to-r ${config.gradient} bg-clip-text text-transparent`}
              >
                {config.label}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: stageCompleted.description ? 1 : 0,
                  y: stageCompleted.description ? 0 : 15,
                }}
                transition={{
                  duration: shouldAnimate ? 0.4 : 0,
                  ease: 'easeOut',
                }}
                className="mb-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base"
              >
                {description.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                )}
              </motion.p>

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: stageCompleted.quote ? 1 : 0,
                  scale: stageCompleted.quote ? 1 : 0.95,
                }}
                transition={{
                  duration: shouldAnimate ? 0.4 : 0,
                  ease: 'easeOut',
                }}
                className="mb-6 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-600 italic dark:border-white/5 dark:bg-black/10 dark:text-gray-400 sm:p-4 sm:text-base"
              >
                &ldquo;{quote}&rdquo;
              </motion.blockquote>

              {/* Action Buttons - Grid layout for mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: stageCompleted.actions ? 1 : 0,
                  y: stageCompleted.actions ? 0 : 20,
                }}
                transition={{
                  duration: shouldAnimate ? 0.4 : 0,
                  ease: 'easeOut',
                }}
                className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3"
              >
                {/* Try Again Button */}
                <motion.button
                  onClick={onRetry}
                  className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-md sm:px-6 sm:py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Try Again</span>
                </motion.button>

                {/* Share Button */}
                <motion.button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md sm:px-6 sm:py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </motion.button>

                {/* Manual Mode Button */}
                {onNavigateToManual && (
                  <motion.button
                    onClick={onNavigateToManual}
                    className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-md sm:px-6 sm:py-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Manual</span>
                  </motion.button>
                )}

                {/* Global Charts Button */}
                {onNavigateToStats && (
                  <motion.button
                    onClick={onNavigateToStats}
                    className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-indigo-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md sm:px-6 sm:py-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Charts</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResultCard;
