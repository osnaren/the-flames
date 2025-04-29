import { FlamesResult } from '@features/flamesGame/flames.types';
import { resultMeanings } from '@features/flamesGame/flames.utils';
import { copyShareUrl, shareResult } from '@lib/share';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook to manage sharing functionality
 */
export function useShareActions(name1: string, name2: string, result: FlamesResult | null) {
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

  const handleShare = useCallback(async () => {
    if (!result) return;

    const shareData = {
      name1,
      name2,
      result,
      resultText: resultMeanings[result].text,
    };

    try {
      // Use Web Share API if available, otherwise show popover
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

  const handleCopyLink = useCallback(async () => {
    try {
      await copyShareUrl(name1, name2);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy link');
    }
  }, [name1, name2]);

  return {
    isSharePopoverOpen,
    setIsSharePopoverOpen,
    handleShare,
    handleCopyLink,
  };
}
