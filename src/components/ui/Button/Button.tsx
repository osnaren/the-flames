import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'red';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Reusable animated button component with enhanced keyboard navigation and loading states
 */
export default function Button({
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
}: ButtonProps) {
  // Style maps for different variants and sizes
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-orange-500 to-red-500 text-white 
      hover:from-orange-600 hover:to-red-600 
      dark:from-orange-600 dark:to-red-600 
      dark:hover:from-orange-700 dark:hover:to-red-700
      shadow-lg shadow-orange-500/20 dark:shadow-orange-900/30
      hover:shadow-xl hover:shadow-orange-500/30 dark:hover:shadow-orange-900/40
    `,
    secondary: `
      bg-gray-100 text-gray-700 hover:bg-gray-200 
      dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
      shadow-md shadow-gray-200/50 dark:shadow-gray-900/50
    `,
    outline: `
      bg-transparent border-2 border-gray-300 text-gray-700 
      hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 
      dark:hover:bg-gray-800 hover:border-orange-500 
      dark:hover:border-orange-400
    `,
    ghost: `
      bg-transparent text-gray-600 hover:bg-gray-100 
      dark:text-gray-400 dark:hover:bg-gray-800
    `,
    blue: `
      bg-blue-100 text-blue-700 hover:bg-blue-200 
      dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800
      shadow-md shadow-blue-200/50 dark:shadow-blue-900/50
    `,
    green: `
      bg-green-100 text-green-700 hover:bg-green-200 
      dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800
      shadow-md shadow-green-200/50 dark:shadow-green-900/50
    `,
    purple: `
      bg-purple-100 text-purple-700 hover:bg-purple-200 
      dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800
      shadow-md shadow-purple-200/50 dark:shadow-purple-900/50
    `,
    red: `
      bg-red-100 text-red-700 hover:bg-red-200 
      dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800
      shadow-md shadow-red-200/50 dark:shadow-red-900/50
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-3 text-lg',
  };

  const baseStyles = `
    rounded-lg font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-900
    focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-400
    focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    active:scale-95
    flex items-center justify-center gap-2
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={baseStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      whileFocus={{ scale: 1.02 }}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {Icon && iconPosition === 'left' && !isLoading && (
        <Icon className="w-4 h-4" aria-hidden="true" />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4" aria-hidden="true" />
      )}
    </motion.button>
  );
}