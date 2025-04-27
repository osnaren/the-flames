import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import React from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'interactive';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * A motion-enhanced card component with variants and improved accessibility
 */
export default function Card({ children, className = '', variant = 'default', elevation = 'md', ...props }: CardProps) {
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
      whileFocus: { scale: 1.02 },
    },
  };

  // Elevation styles using theme color variables for consistent shadows
  const elevationStyles = {
    none: '',
    sm: 'shadow-sm hover:shadow border-outline/10',
    md: 'shadow-md hover:shadow-lg border-outline/5',
    lg: 'shadow-lg hover:shadow-xl border-outline/5',
  };

  // Base styles
  const baseStyles = `
    bg-gradient-to-br from-surface-container-lowest to-surface-container text-on-surface
    dark:bg-gradient-to-br dark:from-surface-container-lowest dark:to-surface-container dark:text-on-surface
    rounded-xl
    transition-all duration-var(--duration)
    backdrop-blur-xs
    ${variant === 'interactive' ? 'hover:shadow-primary/10' : ''}
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
