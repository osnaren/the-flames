import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

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
  activeColor = 'text-orange-500',
  inactiveColor = 'text-gray-400',
  backgroundColor = 'bg-orange-100 dark:bg-orange-950',
}: ToggleProps) {
  const Icon = isActive ? ActiveIcon : InactiveIcon;
  
  return (
    <motion.button
      className={`flex items-center justify-between w-full p-2.5 rounded-lg 
                ${backgroundColor} transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400
                focus:ring-offset-2 dark:focus:ring-offset-gray-900
                hover:brightness-105 dark:hover:brightness-110
                active:scale-95`}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ scale: 1.02 }}
      role="switch"
      aria-checked={isActive}
      aria-label={`Toggle ${label}`}
    >
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </span>
      <Icon
        size={18}
        className={`${isActive ? activeColor : inactiveColor} transition-colors duration-200`}
        aria-hidden="true"
      />
    </motion.button>
  );
}