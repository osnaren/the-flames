import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'interactive';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * A motion-enhanced card component with variants and improved accessibility
 */
export default function Card({
  children,
  className = '',
  variant = 'default',
  elevation = 'md',
  ...props
}: CardProps) {
  // Animation variants
  const variants: Record<string, Variants> = {
    default: {},
    hover: {
      initial: { y: 0 },
      whileHover: { y: -5, transition: { duration: 0.2 } },
    },
    interactive: {
      initial: { scale: 1 },
      whileHover: { scale: 1.02, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
      whileFocus: { scale: 1.02 }
    }
  };

  // Elevation styles
  const elevationStyles = {
    none: '',
    sm: 'shadow-sm hover:shadow',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl'
  };

  // Base styles
  const baseStyles = `
    bg-white dark:bg-gray-800 
    rounded-xl
    transition-all duration-200
    ${elevationStyles[elevation]}
    ${className}
  `;

  return (
    <motion.div
      className={baseStyles}
      variants={variants[variant]}
      initial={variant !== 'default' ? 'initial' : undefined}
      whileHover={variant !== 'default' ? 'whileHover' : undefined}
      whileTap={variant === 'interactive' ? 'whileTap' : undefined}
      whileFocus={variant === 'interactive' ? 'whileFocus' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}