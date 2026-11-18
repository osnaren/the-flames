import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { LucideIcon } from 'lucide-react';

interface ToggleProps {
  isActive: boolean;
  isBusy?: boolean;
  onToggle: () => void;
  activeIcon: LucideIcon;
  inactiveIcon: LucideIcon;
  label: string;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

/**
 * A reusable toggle component with enhanced keyboard navigation and visual feedback
 */
export default function Toggle({
  isActive,
  isBusy = false,
  onToggle,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  label,
  activeColor = 'text-primary text-glow-sm',
  inactiveColor = 'text-on-surface-variant',
  backgroundColor = 'bg-linear-to-r from-primary-container/20 to-transparent dark:from-primary-container/20 dark:to-transparent',
  ariaLabel,
  tabIndex,
}: ToggleProps) {
  const Icon = isActive ? ActiveIcon : InactiveIcon;
  const { shouldAnimate } = useAnimationPreferences();
  const coarsePointer = useMediaQuery('(pointer: coarse)');

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-lg p-2.5 ${backgroundColor} border-outline/10 border transition-transform duration-200 ${shouldAnimate && !coarsePointer ? 'motion-safe:hover:scale-[1.02] motion-safe:focus-visible:scale-[1.02] motion-safe:active:scale-[0.98]' : ''} ${!coarsePointer ? 'hover:brightness-105 dark:hover:brightness-110' : ''} ${isActive ? 'shadow-glow-sm' : ''} focus:ring-primary dark:focus:ring-primary dark:focus:ring-offset-surface focus:ring-2 focus:ring-offset-2 focus:outline-none`}
      onClick={onToggle}
      role="switch"
      aria-checked={isActive}
      aria-disabled={isBusy || undefined}
      aria-label={ariaLabel || `Toggle ${label}`}
      tabIndex={tabIndex}
    >
      <span className="text-on-surface dark:text-on-surface text-sm font-medium">{label}</span>
      <Icon
        size={18}
        className={`${isActive ? activeColor : inactiveColor} transition-colors duration-200`}
        aria-hidden="true"
      />
    </button>
  );
}
