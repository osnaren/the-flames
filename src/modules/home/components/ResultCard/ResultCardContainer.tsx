import { copyShareUrl } from '@lib/share';
import { memo, useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import SharePopover from '@/components/ui/SharePopover';
import { useGameIntegration } from '@/hooks/useGameIntegration';
import { canShareFiles, downloadBlob } from '@/utils/canvasColor';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import type { FlamesResult, GameStage } from '../../types';

import ResultActionsDock from './ResultActionsDock';
import ResultCardDisplay from './ResultCardDisplay';
import ResultHeroTransition from './ResultHeroTransition';
import { captureResultCardAsImage, shareAsImage } from './resultCard.utils';

interface ResultCardContainerProps {
  result: FlamesResult;
  stage: GameStage;
  name1?: string;
  name2?: string;
  skipHero?: boolean;
  onResultVisible?: () => void;
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
  skipHero = false,
  onResultVisible,
  onRetry,
  onNavigateToManual,
  onNavigateToStats,
}: ResultCardContainerProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const { uiInteraction } = useGameIntegration();
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const [heroTransitionComplete, setHeroTransitionComplete] = useState(!shouldAnimate || skipHero);
  const isVisible = stage === 'result' && result !== null;
  const showHero = isVisible && shouldAnimate && !skipHero && !heroTransitionComplete;
  const notifyResultVisible = useEffectEvent(() => onResultVisible?.());

  useEffect(() => {
    if (!isVisible || showHero) return;
    setHeroTransitionComplete(true);
    const frame = requestAnimationFrame(notifyResultVisible);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, showHero]);

  // Handle hero transition completion
  const handleHeroTransitionComplete = useCallback(() => {
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

      // Check if sharing is supported before attempting
      const shareSupported = canShareFiles();
      const shareSuccess = shareSupported ? await shareAsImage(imageBlob, name1, name2, result) : false;

      if (shareSuccess) {
        uiInteraction('success');
        toast.success('Shared successfully!', { id: 'capture' });
        return;
      }

      // Fallback to download if share fails or unsupported
      const filename = `flames-result-${Date.now()}.png`;
      downloadBlob(imageBlob, filename);
      uiInteraction('success');
      toast.success(shareSupported ? 'Sharing unavailable, image downloaded!' : 'Image downloaded!', {
        id: 'capture',
      });
    } catch (error) {
      console.error('Share as image failed:', error);
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
      toast.success('Link copied to clipboard!', { icon: '🔗', duration: 2000 });
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

  if (!isVisible || !result) return null;

  if (showHero) {
    return <ResultHeroTransition result={result} onTransitionComplete={handleHeroTransitionComplete} />;
  }

  return (
    <div className="flex flex-col items-center">
      {/* Result Card Display */}
      <ResultCardDisplay
        ref={resultCardRef}
        result={result}
        stage={stage}
        name1={name1}
        name2={name2}
        className={isCapturing ? 'pointer-events-none' : ''}
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
        onShareAsImage={handleShareAsImage}
        isCapturingImage={isCapturing}
      />
    </div>
  );
}

export default memo(ResultCardContainer);
