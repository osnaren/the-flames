import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Download, Twitter, GitBranch as BrandTelegram, X } from 'lucide-react';
import Button from '../Button';
import { useRef, useEffect } from 'react';
import { downloadResultCard, shareOnTwitter, shareOnTelegram } from '../../../lib/share';
import type { ShareData } from '../../../lib/share';
import toast from 'react-hot-toast';

interface SharePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  resultCardRef: React.RefObject<HTMLElement>;
  shareData: ShareData;
}

export default function SharePopover({
  isOpen,
  onClose,
  resultCardRef,
  shareData
}: SharePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    if (!resultCardRef.current) return;
    try {
      await downloadResultCard(resultCardRef.current);
      toast.success('Result card downloaded!');
      onClose();
    } catch (error) {
      toast.error('Failed to download result card');
    }
  };

  const handleTwitterShare = () => {
    shareOnTwitter(shareData);
    toast.success('Opening Twitter...');
    onClose();
  };

  const handleTelegramShare = () => {
    shareOnTelegram(shareData);
    toast.success('Opening Telegram...');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popover */}
          <motion.div
            ref={popoverRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm
                     bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden
                     border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.95, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-40%" }}
            transition={{ 
              type: shouldReduceMotion ? "tween" : "spring",
              duration: shouldReduceMotion ? 0.2 : undefined,
              bounce: shouldReduceMotion ? 0 : 0.35
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Share Result
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={X}
                aria-label="Close share menu"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Download section */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Save Result
                </h4>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={Download}
                  onClick={handleDownload}
                >
                  Download Result Card
                </Button>
              </div>

              {/* Share section */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Share on...
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="blue"
                    icon={Twitter}
                    onClick={handleTwitterShare}
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="blue"
                    icon={BrandTelegram}
                    onClick={handleTelegramShare}
                  >
                    Telegram
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Share the magic of FLAMES with your friends! ✨
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}