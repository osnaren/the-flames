import { useDeferredAction } from '@/hooks/useDeferredAction';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion } from 'framer-motion';
import { BarChart3, ImageDown, Link2, RotateCcw, Share2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { useGameIntegration } from '@/hooks/useGameIntegration';
import { cn } from '@/utils';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';

interface ResultActionsDockProps {
  onRetry: () => void;
  onShare: () => void;
  onShareAsImage: () => void;
  onCopyLink: () => void;
  onNavigateToManual?: () => void;
  onNavigateToStats?: () => void;
  isVisible: boolean;
  className?: string;
}

interface DockButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  delay?: number;
  isBusy?: boolean;
  compact?: boolean;
  pendingLabel?: string;
}

const variantStyles = {
  primary: 'from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500',
  secondary: 'from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500',
  success: 'from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500',
  warning: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500',
  info: 'from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500',
};

function DockButton({
  icon: Icon,
  label,
  onClick,
  variant = 'secondary',
  delay = 0,
  isBusy = false,
  compact = false,
  pendingLabel,
}: DockButtonProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const [isPressed, setIsPressed] = useState(false);
  const ButtonElement = compact ? 'button' : motion.button;

  return (
    <ButtonElement
      type="button"
      onClick={onClick}
      disabled={isBusy}
      aria-busy={isBusy || undefined}
      {...(!compact && {
        onPointerDown: () => setIsPressed(true),
        onPointerUp: () => setIsPressed(false),
        onPointerLeave: () => setIsPressed(false),
        initial: shouldAnimate ? { opacity: 0, y: 20, scale: 0.8 } : false,
        animate: { opacity: 1, y: 0, scale: isPressed ? 0.95 : 1 },
        transition: { delay: shouldAnimate ? delay : 0, type: 'spring', stiffness: 400, damping: 25 },
        whileHover: shouldAnimate ? { scale: 1.1, y: -4 } : {},
        whileTap: { scale: 0.9 },
      })}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-3 py-2.5',
        'bg-linear-to-br shadow-lg',
        'transition-all duration-200',
        'disabled:cursor-wait disabled:opacity-60',
        'focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none',
        variantStyles[variant]
      )}
      aria-label={label}
    >
      {/* Icon container */}
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-xl bg-white/20',
          !compact && 'backdrop-blur-sm'
        )}
      >
        <Icon
          className={cn('h-4 w-4 text-white transition-transform group-hover:scale-110', isBusy && 'animate-spin')}
        />
      </span>

      {/* Label */}
      <span className="grid text-[10px] font-medium text-white/90 sm:text-xs">
        {pendingLabel && (
          <span aria-hidden="true" className="invisible col-start-1 row-start-1">
            {pendingLabel}
          </span>
        )}
        <span className="col-start-1 row-start-1">{isBusy ? pendingLabel || label : label}</span>
      </span>

      {/* Glow effect on hover */}
      {!compact && (
        <motion.div
          className={cn(
            'absolute inset-0 -z-10 rounded-2xl bg-linear-to-br opacity-0 blur-xl transition-opacity',
            variantStyles[variant]
          )}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
        />
      )}
    </ButtonElement>
  );
}

/**
 * Dock component for result card action buttons
 * Displayed as a floating dock below the result card
 */
function ResultActionsDock({
  onRetry,
  onShare,
  onShareAsImage,
  onCopyLink,
  onNavigateToManual: _onNavigateToManual, // Future feature - currently commented out in UI
  onNavigateToStats,
  isVisible,
  className,
}: ResultActionsDockProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const { uiInteraction, gameReset } = useGameIntegration();
  const [isResetting, startResetTransition] = useDeferredAction();

  const handleCopyLink = useCallback(() => {
    uiInteraction('click');
    onCopyLink();
    toast.success('Link copied to clipboard!', {
      icon: '🔗',
      duration: 2000,
    });
  }, [onCopyLink, uiInteraction]);

  const handleRetry = useCallback(() => {
    // Acknowledge the action while React prepares the input stage without
    // blocking the next frame with the entire result-tree replacement.
    startResetTransition(() => {
      void gameReset();
      onRetry();
    });
  }, [gameReset, onRetry, startResetTransition]);

  const handleShare = useCallback(() => {
    uiInteraction('click');
    onShare();
  }, [uiInteraction, onShare]);

  const handleShareAsImage = useCallback(() => {
    uiInteraction('click');
    onShareAsImage();
  }, [uiInteraction, onShareAsImage]);

  const handleStats = useCallback(() => {
    uiInteraction('click');
    onNavigateToStats?.();
  }, [uiInteraction, onNavigateToStats]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 30, scale: 0.9 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: shouldAnimate ? 0.3 : 0,
      }}
      className={cn(
        'mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3',
        'rounded-3xl border border-white/10 px-3 py-3',
        compactDevice ? 'bg-surface-container-high' : 'bg-black/20 backdrop-blur-xl',
        'shadow-2xl shadow-black/20',
        'dark:border-white/5 dark:bg-black/40',
        className
      )}
    >
      {/* Primary Actions */}
      <DockButton
        icon={RotateCcw}
        label="Reset"
        onClick={handleRetry}
        variant="secondary"
        delay={0}
        isBusy={isResetting}
        pendingLabel="Resetting…"
        compact={compactDevice}
      />

      <DockButton
        icon={Share2}
        label="Share"
        onClick={handleShare}
        variant="primary"
        delay={0.05}
        compact={compactDevice}
      />

      <DockButton
        icon={ImageDown}
        label="Save Image"
        onClick={handleShareAsImage}
        variant="success"
        delay={0.1}
        compact={compactDevice}
      />

      <DockButton
        icon={Link2}
        label="Copy"
        onClick={handleCopyLink}
        variant="info"
        delay={0.15}
        compact={compactDevice}
      />

      {/* Optional Actions */}
      {/* {onNavigateToManual && (
        <DockButton icon={Sparkles} label="Manual" onClick={handleManual} variant="warning" delay={0.2} />
      )} */}

      {onNavigateToStats && (
        <DockButton
          icon={BarChart3}
          label="Charts"
          onClick={handleStats}
          variant="info"
          delay={0.25}
          compact={compactDevice}
        />
      )}
    </motion.div>
  );
}

export default memo(ResultActionsDock);
