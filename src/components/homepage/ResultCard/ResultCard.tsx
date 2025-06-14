import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Heart, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import ConfettiEffect from '@/components/ui/ConfettiEffect/ConfettiEffect';
import ResultGlow from '@/components/ui/ResultGlow/ResultGlow';
import { FlamesResult, GameStage } from '@features/flamesGame/flames.types';
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

// Animation stages configuration
const ANIMATION_STAGES = ['entry', 'icon', 'title', 'description', 'quote', 'actions'];
const ANIMATION_DELAYS = [300, 600, 900, 1200, 1500, 1800];

// Utility functions for result data
const getFlamesDescription = (result: FlamesResult, name1?: string, name2?: string): string => {
  const names = name1 && name2 ? `<strong>${name1}</strong> and <strong>${name2}</strong>` : 'You two';

  switch (result) {
    case 'F':
      return `${names} are destined to be great friends! Your connection is built on trust, understanding, and mutual respect.`;
    case 'L':
      return `${names} share a deep romantic love! Your hearts beat as one, creating a beautiful love story.`;
    case 'A':
      return `${names} have a warm affection for each other! There's a special fondness and care in your relationship.`;
    case 'M':
      return `${names} are meant for marriage! Your souls are perfectly aligned for a lifetime of happiness together.`;
    case 'E':
      return `${names} have some conflicts to resolve. But remember, even enemies can become friends with understanding.`;
    case 'S':
      return `${names} share a sibling-like bond! Your relationship is filled with care, protection, and family-like love.`;
    default:
      return `${names} have a special connection that's unique and wonderful in its own way.`;
  }
};

const getFlamesQuote = (result: FlamesResult): string => {
  switch (result) {
    case 'F':
      return 'Friendship is the only cement that will ever hold the world together.';
    case 'L':
      return 'Love is not about how many days, months, or years you have been together. It is about how much you love each other every single day.';
    case 'A':
      return 'Affection is responsible for nine-tenths of whatever solid and durable happiness there is in our lives.';
    case 'M':
      return 'A successful marriage requires falling in love many times, always with the same person.';
    case 'E':
      return 'The best way to destroy an enemy is to make him a friend.';
    case 'S':
      return 'Siblings are the people we practice on, the people who teach us about fairness and cooperation.';
    default:
      return 'Every relationship teaches us something valuable about life and love.';
  }
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

  // Start animation when component becomes visible
  useEffect(() => {
    if (stage === 'result' && result && !hasStarted) {
      setIsVisible(true);
      startAnimation();
    } else if (stage !== 'result') {
      setIsVisible(false);
      resetAnimation();
    }
  }, [stage, result, hasStarted, startAnimation, resetAnimation]);

  const getResultIcon = useCallback(() => {
    switch (result) {
      case 'L':
        return Heart;
      case 'M':
        return Heart;
      default:
        return Sparkles;
    }
  }, [result]);

  const getResultColor = useCallback(() => {
    switch (result) {
      case 'L':
        return 'from-pink-500 to-rose-500';
      case 'A':
        return 'from-amber-500 to-orange-500';
      case 'M':
        return 'from-emerald-500 to-green-500';
      case 'E':
        return 'from-red-500 to-red-600';
      case 'F':
        return 'from-blue-500 to-indigo-500';
      case 'S':
        return 'from-purple-500 to-violet-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  }, [result]);

  const handleShare = useCallback(() => {
    const text = name1 && name2 ? `${name1} + ${name2} = ${result}! 💕` : `My FLAMES result is ${result}! 💕`;

    if (navigator.share) {
      navigator
        .share({
          title: 'FLAMES Game Result',
          text,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback for browsers that don't support Web Share API
          navigator.clipboard?.writeText(`${text} ${window.location.href}`);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard?.writeText(`${text} ${window.location.href}`);
    }
  }, [result, name1, name2]);

  // Early return if not in result stage or no result
  if (stage !== 'result' || !result) {
    return null;
  }

  const isResultPositive = result === 'L' || result === 'A' || result === 'M';
  const description = getFlamesDescription(result, name1, name2);
  const quote = getFlamesQuote(result);
  const ResultIcon = getResultIcon();
  const resultColor = getResultColor();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{
            opacity: stageCompleted.entry ? 1 : 0,
            y: stageCompleted.entry ? 0 : 50,
            scale: stageCompleted.entry ? 1 : 0.9,
          }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: shouldAnimate ? 0.6 : 0,
          }}
          className="relative mx-auto mt-8 w-full max-w-md"
        >
          {/* Result Glow Effect - with correct props */}
          <ResultGlow result={result} isVisible={stageCompleted.entry} />

          {/* Confetti Effect for positive results - with correct props */}
          {isResultPositive && stageCompleted.entry && <ConfettiEffect result={result} isActive={true} />}

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${resultColor} opacity-5`} />

            {/* Content */}
            <div className="relative p-8 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: stageCompleted.icon ? 1 : 0,
                  rotate: stageCompleted.icon ? 0 : -180,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  duration: shouldAnimate ? 0.8 : 0,
                }}
                className="mx-auto mb-6"
              >
                <div className={`relative h-20 w-20 rounded-full bg-gradient-to-br ${resultColor} p-4 shadow-lg`}>
                  {/* Multi-layered glow effect */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${resultColor} opacity-50 blur-md`}
                  />
                  <div
                    className={`absolute inset-1 rounded-full bg-gradient-to-br ${resultColor} opacity-30 blur-sm`}
                  />

                  <ResultIcon className="relative z-10 h-full w-full text-white" />
                </div>
              </motion.div>

              {/* Result Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: stageCompleted.title ? 1 : 0,
                  y: stageCompleted.title ? 0 : 20,
                }}
                transition={{
                  duration: shouldAnimate ? 0.6 : 0,
                  ease: 'easeOut',
                }}
                className={`mb-4 bg-gradient-to-r text-4xl font-bold ${resultColor} bg-clip-text text-transparent`}
              >
                {result === 'F'
                  ? 'FRIENDSHIP'
                  : result === 'L'
                    ? 'LOVE'
                    : result === 'A'
                      ? 'AFFECTION'
                      : result === 'M'
                        ? 'MARRIAGE'
                        : result === 'E'
                          ? 'ENEMY'
                          : result === 'S'
                            ? 'SISTER'
                            : result}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: stageCompleted.description ? 1 : 0,
                  y: stageCompleted.description ? 0 : 20,
                }}
                transition={{
                  duration: shouldAnimate ? 0.6 : 0,
                  ease: 'easeOut',
                  delay: shouldAnimate ? 0.1 : 0,
                }}
                className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: description }}
              />

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: stageCompleted.quote ? 1 : 0,
                  scale: stageCompleted.quote ? 1 : 0.9,
                }}
                transition={{
                  duration: shouldAnimate ? 0.6 : 0,
                  ease: 'easeOut',
                  delay: shouldAnimate ? 0.2 : 0,
                }}
                className="mb-8 rounded-lg border border-white/10 bg-white/5 p-4 text-gray-600 italic dark:border-white/5 dark:bg-black/10 dark:text-gray-400"
              >
                "{quote}"
              </motion.blockquote>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: stageCompleted.actions ? 1 : 0,
                  y: stageCompleted.actions ? 0 : 30,
                }}
                transition={{
                  duration: shouldAnimate ? 0.6 : 0,
                  ease: 'easeOut',
                  delay: shouldAnimate ? 0.3 : 0,
                }}
                className="flex flex-wrap justify-center gap-3"
              >
                {/* Try Again Button */}
                <button
                  onClick={onRetry}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>

                {/* Manual Mode Button */}
                {onNavigateToManual && (
                  <button
                    onClick={onNavigateToManual}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-orange-700 hover:shadow-lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    Manual Mode
                  </button>
                )}

                {/* Global Charts Button */}
                {onNavigateToStats && (
                  <button
                    onClick={onNavigateToStats}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Global Charts
                  </button>
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
