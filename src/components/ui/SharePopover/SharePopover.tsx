import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GitBranch as BrandTelegram, Download, Facebook, Instagram, Twitter, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import type { ShareData } from '../../../lib/share';
import { downloadResultCard, shareOnTelegram, shareOnTwitter } from '../../../lib/share';
import Button from '../Button';

interface SharePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  resultCardRef: React.RefObject<HTMLElement | null>;
  shareData: ShareData;
}

export default function SharePopover({ isOpen, onClose, resultCardRef, shareData }: SharePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      // Focus trap - focus first button when opened
      setTimeout(() => {
        const firstButton = popoverRef.current?.querySelector('button');
        if (firstButton) {
          (firstButton as HTMLElement).focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    if (!resultCardRef.current) return;
    try {
      toast.loading('Preparing your result card...', { id: 'download' });
      await downloadResultCard(resultCardRef.current);
      toast.success('Result card downloaded!', { id: 'download' });
      onClose();
    } catch {
      toast.error('Failed to download result card', { id: 'download' });
    }
  };

  const handleTwitterShare = () => {
    shareOnTwitter(shareData);
    toast.success('Opening Twitter...', {
      icon: '🐦',
      duration: 3000,
    });
    onClose();
  };

  const handleTelegramShare = () => {
    shareOnTelegram(shareData);
    toast.success('Opening Telegram...', {
      icon: '✈️',
      duration: 3000,
    });
    onClose();
  };

  // Animation variants for staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popover */}
          <motion.div
            ref={popoverRef}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, scale: 0.95, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-40%' }}
            transition={{
              type: shouldReduceMotion ? 'tween' : 'spring',
              duration: shouldReduceMotion ? 0.2 : undefined,
              bounce: shouldReduceMotion ? 0 : 0.35,
            }}
          >
            {/* Header with subtle gradient */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-orange-50 to-pink-50 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Share Result
                </span>
                <span className="text-base">✨</span>
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose} icon={X} aria-label="Close share menu">
                Close
              </Button>
            </div>

            {/* Content */}
            <motion.div
              className="space-y-5 p-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Download section */}
              <motion.div variants={childVariants}>
                <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Save Result</h4>
                <Button variant="secondary" fullWidth icon={Download} onClick={handleDownload}>
                  Download Result Card
                </Button>
              </motion.div>

              {/* Share section */}
              <motion.div variants={childVariants}>
                <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Share on...</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="blue" icon={Twitter} onClick={handleTwitterShare}>
                    Twitter
                  </Button>
                  <Button variant="blue" icon={BrandTelegram} onClick={handleTelegramShare}>
                    Telegram
                  </Button>
                  <Button
                    variant="purple"
                    icon={Instagram}
                    onClick={() => {
                      toast('Instagram sharing coming soon!', {
                        icon: '📸',
                        duration: 3000,
                      });
                    }}
                  >
                    Instagram
                  </Button>
                  <Button
                    variant="blue"
                    icon={Facebook}
                    onClick={() => {
                      toast('Facebook sharing coming soon!', {
                        icon: '👍',
                        duration: 3000,
                      });
                    }}
                  >
                    Facebook
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              variants={childVariants}
              className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
            >
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Share the magic of FLAMES with your friends! ✨
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
