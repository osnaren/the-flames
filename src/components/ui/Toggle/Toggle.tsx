import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ToggleProps {
  isActive: boolean;
  onToggle: () => void;
  activeIcon: LucideIcon;
  inactiveIcon: LucideIcon;
  label: string;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
}

/**
 * A reusable toggle component with enhanced keyboard navigation and visual feedback
 */
export default function Toggle({
  isActive,
  onToggle,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  label,
  activeColor = 'text-primary text-glow-sm',
  inactiveColor = 'text-on-surface-variant',
  backgroundColor = 'bg-gradient-to-r from-primary-container/20 to-transparent dark:from-primary-container/20 dark:to-transparent',
}: ToggleProps) {
  const Icon = isActive ? ActiveIcon : InactiveIcon;

  return (
    <motion.button
      className={`flex w-full items-center justify-between rounded-lg p-2.5 ${backgroundColor} border-outline/10 border backdrop-blur-xs transition-all duration-200 ${isActive ? 'shadow-glow-sm' : ''} focus:ring-primary dark:focus:ring-primary dark:focus:ring-offset-surface hover:brightness-105 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 dark:hover:brightness-110`}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ scale: 1.02 }}
      role="switch"
      aria-checked={isActive}
      aria-label={`Toggle ${label}`}
    >
      <span className="text-on-surface dark:text-on-surface text-sm font-medium">{label}</span>
      <Icon
        size={18}
        className={`${isActive ? activeColor : inactiveColor} transition-colors duration-200`}
        aria-hidden="true"
      />
    </motion.button>
  );
}
