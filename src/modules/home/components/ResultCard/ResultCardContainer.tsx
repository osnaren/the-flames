import { copyShareUrl } from '@lib/share';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import SharePopover from '@/components/ui/SharePopover';
import { useGameIntegration } from '@/hooks/useGameIntegration';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import type { FlamesResult, GameStage, NonNullFlamesResult } from '../../types';

import ResultActionsDock from './ResultActionsDock';
import ResultCardDisplay from './ResultCardDisplay';
import ResultHeroTransition from './ResultHeroTransition';
import { captureResultCardAsImage, shareAsImage } from './resultCard.utils';

interface ResultCardContainerProps {
  result: FlamesResult;
  stage: GameStage;
  name1?: string;
  name2?: string;
  onRetry: () => void;
  onNavigateToManual?: () => void;
  onNavigateToStats?: () => void;
}

/**
 * Container component for the Result Card
 * Manages state and actions for the result display and sharing
 * Now includes hero transition for dramatic result reveal
 */
function ResultCardContainer({
  result,
  stage,
  name1,
  name2,
  onRetry,
  onNavigateToManual,
  onNavigateToStats,
}: ResultCardContainerProps) {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const { uiInteraction } = useGameIntegration();
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Hero transition state
  const [showHeroTransition, setShowHeroTransition] = useState(false);
  const [heroTransitionComplete, setHeroTransitionComplete] = useState(false);

  const isVisible = stage === 'result' && result !== null;

  // Handle stage transition - trigger hero animation when result becomes visible
  const prevStageRef = useRef<GameStage | null>(null);

  useEffect(() => {
    // Stage just changed to result - start hero transition
    if (stage === 'result' && prevStageRef.current !== 'result' && result !== null) {
      if (shouldAnimate && !prefersReducedMotion) {
        setShowHeroTransition(true);
        setHeroTransitionComplete(false);
      } else {
        // Skip hero transition if animations disabled
        setHeroTransitionComplete(true);
      }
    }

    // Reset hero state when leaving result stage
    if (stage !== 'result' && prevStageRef.current === 'result') {
      setShowHeroTransition(false);
      setHeroTransitionComplete(false);
    }

    prevStageRef.current = stage;
  }, [stage, result, shouldAnimate, prefersReducedMotion]);

  // Handle hero transition completion
  const handleHeroTransitionComplete = useCallback(() => {
    setShowHeroTransition(false);
    setHeroTransitionComplete(true);
  }, []);

  // Handle native share
  const handleShare = useCallback(async () => {
    if (!result || !name1 || !name2) return;

    const shareData = {
      title: '🔥 FLAMES Game Result 🔥',
      text: `${name1} ❤️ ${name2} = ${result}! Check out your FLAMES result! ✨`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed - open popover as fallback
        if ((err as Error).name !== 'AbortError') {
          setIsSharePopoverOpen(true);
        }
      }
    } else {
      setIsSharePopoverOpen(true);
    }
  }, [result, name1, name2]);

  // Handle share as image
  const handleShareAsImage = useCallback(async () => {
    if (!resultCardRef.current || !result) {
      toast.error('Nothing to share');
      return;
    }

    setIsCapturing(true);
    toast.loading('Creating image...', { id: 'capture' });

    try {
      const imageBlob = await captureResultCardAsImage(resultCardRef.current);

      if (!imageBlob) {
        toast.error('Failed to create image', { id: 'capture' });
        return;
      }

      const shareSuccess = await shareAsImage(imageBlob, name1, name2, result);

      if (shareSuccess) {
        uiInteraction('success');
        toast.success('Shared successfully!', { id: 'capture' });
      } else {
        // Fallback to download if share fails
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flames-result-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        uiInteraction('success');
        toast.success('Image downloaded!', { id: 'capture' });
      }
    } catch {
      uiInteraction('error');
      toast.error('Failed to create image. Try again.', { id: 'capture' });
    } finally {
      setIsCapturing(false);
    }
  }, [result, name1, name2, uiInteraction]);

  // Handle copy link
  const handleCopyLink = useCallback(async () => {
    try {
      if (!name1 || !name2) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        await copyShareUrl(name1, name2);
      }
      // Toast is already shown in ResultActionsDock
    } catch {
      uiInteraction('error');
      toast.error('Failed to copy link');
    }
  }, [name1, name2, uiInteraction]);

  // Share popover data
  const shareData = {
    name1: name1 || '',
    name2: name2 || '',
    result: result,
    resultText: result || '',
  };

  return (
    <>
      {/* Hero Transition - Large icon reveal */}
      {result !== null && (
        <ResultHeroTransition
          result={result as NonNullFlamesResult}
          isActive={showHeroTransition}
          onTransitionComplete={handleHeroTransitionComplete}
        />
      )}

      <AnimatePresence mode="wait">
        {isVisible && heroTransitionComplete && (
          <motion.div
            key="result-container"
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Result Card Display */}
            <ResultCardDisplay
              ref={resultCardRef}
              result={result}
              stage={stage}
              name1={name1}
              name2={name2}
              className={isCapturing ? 'pointer-events-none' : ''}
              heroTransitionComplete={heroTransitionComplete}
            />

            {/* Actions Dock */}
            <ResultActionsDock
              isVisible={isVisible}
              onRetry={onRetry}
              onShare={handleShare}
              onShareAsImage={handleShareAsImage}
              onCopyLink={handleCopyLink}
              onNavigateToManual={onNavigateToManual}
              onNavigateToStats={onNavigateToStats}
            />

            {/* Share Popover */}
            <SharePopover
              isOpen={isSharePopoverOpen}
              onClose={() => setIsSharePopoverOpen(false)}
              resultCardRef={resultCardRef}
              shareData={shareData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(ResultCardContainer);
