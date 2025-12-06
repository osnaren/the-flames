import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Copy, Download, Share2, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { downloadResultCard, generateShareUrl, shareOnTelegram, shareOnTwitter } from '@/lib/share';
import Button from '../Button';

// Social icons as simple SVG components
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export interface ShareData {
  name1: string;
  name2: string;
  result: string | null;
  resultText: string;
  imageUrl?: string;
}

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

  const handleDownload = useCallback(async () => {
    if (!resultCardRef.current) {
      toast.error('Nothing to download');
      return;
    }
    try {
      toast.loading('Preparing your result card...', { id: 'download' });
      await downloadResultCard(resultCardRef.current);
      toast.success('Result card downloaded!', { id: 'download' });
      onClose();
    } catch {
      toast.error('Failed to download result card', { id: 'download' });
    }
  }, [resultCardRef, onClose]);

  const handleCopyLink = useCallback(async () => {
    try {
      const url = generateShareUrl(shareData.name1, shareData.name2);
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!', {
        icon: '🔗',
        duration: 2000,
      });
      onClose();
    } catch {
      toast.error('Failed to copy link');
    }
  }, [shareData.name1, shareData.name2, onClose]);

  const handleTwitterShare = useCallback(() => {
    shareOnTwitter(shareData);
    toast.success('Opening Twitter...', {
      icon: '🐦',
      duration: 2000,
    });
    onClose();
  }, [shareData, onClose]);

  const handleTelegramShare = useCallback(() => {
    shareOnTelegram(shareData);
    toast.success('Opening Telegram...', {
      icon: '✈️',
      duration: 2000,
    });
    onClose();
  }, [shareData, onClose]);

  const handleWhatsAppShare = useCallback(() => {
    const text = `🔥 ${shareData.name1} + ${shareData.name2} = ${shareData.result}! ✨\nCheck out your FLAMES result too! 👇\n${window.location.origin}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...', {
      icon: '💬',
      duration: 2000,
    });
    onClose();
  }, [shareData, onClose]);

  // Animation variants for staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.08,
        delayChildren: 0.15,
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
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popover */}
          <motion.div
            ref={popoverRef}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/95"
            initial={{ opacity: 0, scale: 0.95, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-40%' }}
            transition={{
              type: shouldReduceMotion ? 'tween' : 'spring',
              duration: shouldReduceMotion ? 0.2 : undefined,
              bounce: shouldReduceMotion ? 0 : 0.3,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200/50 bg-linear-to-r from-pink-50 to-purple-50 p-4 dark:border-gray-700/50 dark:from-gray-800 dark:to-gray-800">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Share2 className="h-5 w-5 text-pink-500" />
                <span className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Share Result
                </span>
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                aria-label="Close share menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <motion.div
              className="space-y-4 p-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Share on Social */}
              <motion.div variants={childVariants}>
                <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Share on Social Media</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handleTwitterShare}
                    className="flex flex-col items-center gap-2 rounded-xl bg-black p-3 text-white transition-transform hover:scale-105"
                    aria-label="Share on X (Twitter)"
                  >
                    <TwitterIcon />
                    <span className="text-xs">X</span>
                  </button>
                  <button
                    onClick={handleTelegramShare}
                    className="flex flex-col items-center gap-2 rounded-xl bg-[#0088cc] p-3 text-white transition-transform hover:scale-105"
                    aria-label="Share on Telegram"
                  >
                    <TelegramIcon />
                    <span className="text-xs">Telegram</span>
                  </button>
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex flex-col items-center gap-2 rounded-xl bg-[#25D366] p-3 text-white transition-transform hover:scale-105"
                    aria-label="Share on WhatsApp"
                  >
                    <WhatsAppIcon />
                    <span className="text-xs">WhatsApp</span>
                  </button>
                </div>
              </motion.div>

              {/* Download & Copy */}
              <motion.div variants={childVariants}>
                <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Save & Copy</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" icon={Download} onClick={handleDownload}>
                    Download
                  </Button>
                  <Button variant="outline" icon={Copy} onClick={handleCopyLink}>
                    Copy Link
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              variants={childVariants}
              className="border-t border-gray-200/50 bg-gray-50/80 p-3 text-center dark:border-gray-700/50 dark:bg-gray-900/50"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Share the magic of FLAMES with your friends! ✨
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
