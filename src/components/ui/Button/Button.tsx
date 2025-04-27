import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { cn } from 'src/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'blue' | 'green' | 'purple' | 'red';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion.button as any; // Cast to any to bypass type issue

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      className = '',
      disabled,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Style maps for different variants and sizes
    const variantStyles = {
      primary: cn(
        'bg-primary-container text-on-primary-container',
        'hover:opacity-95',
        'shadow-lg shadow-primary-container/30',
        'hover:shadow-xl hover:shadow-primary-container/40',
        'relative overflow-hidden',
        'after:absolute after:inset-0 after:opacity-0 after:rounded-lg',
        'after:bg-gradient-to-r after:from-primary/20 after:to-primary/10',
        'hover:after:opacity-100 after:transition-opacity after:duration-300'
      ),
      secondary: cn(
        'bg-secondary-container text-on-secondary-container',
        'hover:opacity-95',
        'shadow-md shadow-secondary-container/30',
        'hover:shadow-lg hover:shadow-secondary-container/40',
        'relative overflow-hidden',
        'after:absolute after:inset-0 after:opacity-0 after:rounded-lg',
        'after:bg-gradient-to-r after:from-secondary/20 after:to-secondary/10',
        'hover:after:opacity-100 after:transition-opacity after:duration-300'
      ),
      outline: cn(
        'bg-transparent border-2 border-outline text-on-surface',
        'hover:bg-surface-container-lowest/70',
        'hover:border-primary hover:text-primary',
        'transition-colors duration-200'
      ),
      ghost: cn(
        'bg-transparent text-on-surface-variant',
        'hover:bg-surface-container-lowest/80',
        'hover:text-on-surface',
        'transition-colors duration-200'
      ),
      blue: cn(
        'bg-tertiary-container text-on-tertiary-container',
        'hover:opacity-95',
        'shadow-md shadow-tertiary-container/30',
        'hover:shadow-lg hover:shadow-tertiary-container/40',
        'relative overflow-hidden',
        'after:absolute after:inset-0 after:opacity-0 after:rounded-lg',
        'after:bg-gradient-to-r after:from-tertiary/20 after:to-tertiary/10',
        'hover:after:opacity-100 after:transition-opacity after:duration-300'
      ),
      green: cn(
        'bg-green-50 text-green-700 hover:bg-green-100',
        'dark:bg-green-900/80 dark:text-green-200 dark:hover:bg-green-800',
        'shadow-md shadow-green-200/40 dark:shadow-green-900/40',
        'hover:shadow-lg hover:shadow-green-300/40 dark:hover:shadow-green-800/50',
        'relative overflow-hidden',
        'after:absolute after:inset-0 after:opacity-0 after:rounded-lg',
        'after:bg-gradient-to-r after:from-green-100/20 after:to-green-200/20',
        'hover:after:opacity-100 after:transition-opacity after:duration-300'
      ),
      purple: cn(
        'bg-tertiary-container text-on-tertiary-container',
        'hover:opacity-95',
        'shadow-md shadow-tertiary-container/30',
        'hover:shadow-lg hover:shadow-tertiary-container/40',
        'relative overflow-hidden',
        'after:absolute after:inset-0 after:opacity-0 after:rounded-lg',
        'after:bg-gradient-to-r after:from-tertiary/20 after:to-tertiary/10',
        'hover:after:opacity-100 after:transition-opacity after:duration-300'
      ),
      red: cn(
        'bg-error-container text-on-error-container',
        'hover:opacity-95',
        'shadow-md shadow-error-container/30',
        'hover:shadow-lg hover:shadow-error-container/40',
        'relative overflow-hidden',
        'after:absolute after:inset-0 after:opacity-0 after:rounded-lg',
        'after:bg-gradient-to-r after:from-error/20 after:to-error/10',
        'hover:after:opacity-100 after:transition-opacity after:duration-300'
      ),
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3',
      lg: 'px-6 py-3.5 text-lg',
    };

    const baseStyles = cn(
      'rounded-lg font-medium transition-all duration-200 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-surface',
      'focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary',
      'focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:after:opacity-0',
      'active:scale-[0.96]',
      'flex items-center justify-center gap-2',
      disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
      fullWidth ? 'w-full' : '',
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    // Enhanced hover/tap animations based on variant
    const hoverScale = variant === 'primary' || variant === 'secondary' ? 1.03 : 1.02;
    const tapScale = variant === 'ghost' ? 0.97 : 0.96;

    return (
      <MotionButton // Use the casted component
        ref={ref}
        type={type}
        className={baseStyles}
        disabled={disabled || isLoading}
        onClick={onClick}
        whileHover={!disabled && !isLoading ? { scale: hoverScale } : {}}
        whileTap={!disabled && !isLoading ? { scale: tapScale } : {}}
        whileFocus={!disabled && !isLoading ? { scale: 1.01 } : {}}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 -ml-1 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {Icon && iconPosition === 'left' && !isLoading && (
          <Icon
            className={`h-5 w-5 flex-shrink-0 ${disabled || isLoading ? '' : 'group-hover:animate-pulse'}`}
            aria-hidden="true"
          />
        )}
        <span className="relative z-10">{children}</span>
        {Icon && iconPosition === 'right' && (
          <Icon
            className={`h-5 w-5 flex-shrink-0 ${disabled || isLoading ? '' : 'group-hover:animate-pulse'}`}
            aria-hidden="true"
          />
        )}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
