import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

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
  className = ''
}: NavItemProps) {
  const content = (
    <>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      <span>{label}</span>
    </>
  );

  // Base classes for styling
  const baseClasses = `
    flex items-center px-3 py-2 text-sm font-medium rounded-lg
    transition-all duration-200
    ${isActive 
      ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
    ${mobileOnly ? 'md:hidden' : ''}
    ${className}
  `;

  // Variants for motion animation
  const motionVariants = {
    hover: {
      scale: 1.05,
    }
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
    <motion.button
      onClick={onClick}
      className={baseClasses}
      whileHover="hover"
      variants={motionVariants}
    >
      {content}
    </motion.button>
  );
}