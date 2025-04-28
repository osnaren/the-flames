import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  icon?: LucideIcon;
  label: string;
  to?: string;
  isActive?: boolean;
  onClick?: () => void;
  mobileOnly?: boolean;
  className?: string;
}

function NavItem({
  icon: Icon,
  label,
  to,
  isActive = false,
  onClick,
  mobileOnly = false,
  className = '',
}: NavItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const animationsEnabled = !prefersReducedMotion;

  const content = (
    <>
      {Icon && (
        <motion.div
          className="relative"
          whileHover={animationsEnabled ? { rotate: [-5, 5, 0], transition: { duration: 0.5 } } : {}}
        >
          <Icon className="mr-2 h-4 w-4" />
        </motion.div>
      )}
      <span>{label}</span>
    </>
  );

  // Base classes for styling
  const baseClasses = `
    flex items-center px-3 py-2 text-sm font-medium rounded-lg
    group relative overflow-hidden
    transition-all duration-300 ease-in-out relative
    ${isActive ? 'text-primary bg-primary-container/20 shadow-sm' : 'text-on-surface-variant'}
    ${mobileOnly ? 'md:hidden' : ''}
    ${className}
  `;

  // Variants for motion animation
  const motionVariants = {
    hover: {
      scale: animationsEnabled ? 1.05 : 1,
    },
    tap: {
      scale: animationsEnabled ? 0.95 : 1,
    },
  };

  if (to) {
    return (
      <motion.div whileHover="hover" whileTap="tap" variants={motionVariants} initial={false}>
        <Link to={to} className={baseClasses} aria-current={isActive ? 'page' : undefined}>
          {content}
          {!isActive && (
            <span className="bg-secondary/20 absolute inset-0 -z-10 translate-y-full rounded-lg transition-transform duration-300 group-hover:translate-y-0" />
          )}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      whileHover="hover"
      whileTap="tap"
      variants={motionVariants}
      initial={false}
      aria-pressed={isActive}
    >
      {content}
      {!isActive && (
        <span className="bg-primary absolute inset-0 -z-10 translate-y-full rounded-lg transition-transform duration-300 group-hover:translate-y-0" />
      )}
    </motion.button>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(NavItem);
