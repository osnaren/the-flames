import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
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

export default function NavItem({
  icon: Icon,
  label,
  to,
  isActive = false,
  onClick,
  mobileOnly = false,
  className = '',
}: NavItemProps) {
  const content = (
    <>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{label}</span>
    </>
  );

  // Base classes for styling
  const baseClasses = `
    flex items-center px-3 py-2 text-sm font-medium rounded-lg
    transition-all duration-200
    ${
      isActive
        ? 'text-primary bg-primary-container/20'
        : 'text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface'
    }
    ${mobileOnly ? 'md:hidden' : ''}
    ${className}
  `;

  // Variants for motion animation
  const motionVariants = {
    hover: {
      scale: 1.05,
    },
  };

  if (to) {
    return (
      <motion.div whileHover="hover" variants={motionVariants}>
        <Link to={to} className={baseClasses}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button onClick={onClick} className={baseClasses} whileHover="hover" variants={motionVariants}>
      {content}
    </motion.button>
  );
}
