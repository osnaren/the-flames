import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

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
      primary: `
        bg-gradient-to-r from-orange-500 to-red-500 text-white 
        hover:from-orange-600 hover:to-red-600 
        dark:from-orange-600 dark:to-red-600 
        dark:hover:from-orange-500 dark:hover:to-red-500
        shadow-lg shadow-orange-500/30 dark:shadow-orange-900/40
        hover:shadow-xl hover:shadow-orange-500/40 dark:hover:shadow-orange-800/50
        after:absolute after:inset-0 after:opacity-0 after:rounded-lg 
        after:bg-gradient-to-r after:from-orange-400/30 after:to-red-400/30
        hover:after:opacity-100 after:transition-opacity after:duration-300
        after:-z-10 hover:z-10 relative
      `,
      secondary: `
        bg-white text-gray-700 hover:bg-gray-50 
        dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
        shadow-md shadow-gray-200/60 dark:shadow-gray-900/60
        hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-black/40
        relative overflow-hidden
        after:absolute after:inset-0 after:opacity-0 after:rounded-lg 
        after:bg-gradient-to-r after:from-gray-100/30 after:to-gray-200/30
        hover:after:opacity-100 after:transition-opacity after:duration-300
      `,
      outline: `
        bg-transparent border-2 border-gray-300 text-gray-700 
        hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 
        dark:hover:bg-gray-800
        hover:border-orange-400 dark:hover:border-orange-500
        hover:text-orange-600 dark:hover:text-orange-400
        transition-colors duration-300
      `,
      ghost: `
        bg-transparent text-gray-600 hover:bg-gray-100 
        dark:text-gray-400 dark:hover:bg-gray-800
        hover:text-gray-900 dark:hover:text-gray-100
        transition-colors duration-300
      `,
      blue: `
        bg-blue-50 text-blue-700 hover:bg-blue-100 
        dark:bg-blue-900/70 dark:text-blue-200 dark:hover:bg-blue-800
        shadow-md shadow-blue-200/40 dark:shadow-blue-900/40
        hover:shadow-lg hover:shadow-blue-300/40 dark:hover:shadow-blue-800/50
        relative overflow-hidden
        after:absolute after:inset-0 after:opacity-0 after:rounded-lg 
        after:bg-gradient-to-r after:from-blue-100/30 after:to-blue-200/30
        hover:after:opacity-100 after:transition-opacity after:duration-300
      `,
      green: `
        bg-green-50 text-green-700 hover:bg-green-100 
        dark:bg-green-900/70 dark:text-green-200 dark:hover:bg-green-800
        shadow-md shadow-green-200/40 dark:shadow-green-900/40
        hover:shadow-lg hover:shadow-green-300/40 dark:hover:shadow-green-800/50
        relative overflow-hidden
        after:absolute after:inset-0 after:opacity-0 after:rounded-lg 
        after:bg-gradient-to-r after:from-green-100/30 after:to-green-200/30
        hover:after:opacity-100 after:transition-opacity after:duration-300
      `,
      purple: `
        bg-purple-50 text-purple-700 hover:bg-purple-100 
        dark:bg-purple-900/70 dark:text-purple-200 dark:hover:bg-purple-800
        shadow-md shadow-purple-200/40 dark:shadow-purple-900/40
        hover:shadow-lg hover:shadow-purple-300/40 dark:hover:shadow-purple-800/50
        relative overflow-hidden
        after:absolute after:inset-0 after:opacity-0 after:rounded-lg 
        after:bg-gradient-to-r after:from-purple-100/30 after:to-purple-200/30
        hover:after:opacity-100 after:transition-opacity after:duration-300
      `,
      red: `
        bg-red-50 text-red-700 hover:bg-red-100 
        dark:bg-red-900/70 dark:text-red-200 dark:hover:bg-red-800
        shadow-md shadow-red-200/40 dark:shadow-red-900/40
        hover:shadow-lg hover:shadow-red-300/40 dark:hover:shadow-red-800/50
        relative overflow-hidden
        after:absolute after:inset-0 after:opacity-0 after:rounded-lg 
        after:bg-gradient-to-r after:from-red-100/30 after:to-red-200/30
        hover:after:opacity-100 after:transition-opacity after:duration-300
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3',
      lg: 'px-6 py-3.5 text-lg',
    };

    const baseStyles = `
      rounded-lg font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-900
      focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-400
      focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:after:opacity-0
      active:scale-[0.96]
      flex items-center justify-center gap-2
      ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${className}
    `;

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
