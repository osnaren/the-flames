import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

interface NavItemProps {
  icon?: LucideIcon;
  label: string;
  to?: string;
  isActive?: boolean;
  onClick?: () => void;
  mobileOnly?: boolean;
  className?: string;
}

const bgMotionSpanVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 0, scale: 0.8 },
  hover: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
};

function NavItem({
  icon: Icon,
  label,
  to,
  isActive = false,
  onClick,
  mobileOnly = false,
  className = '',
}: NavItemProps) {
  const { shouldAnimate } = useAnimationPreferences();

  const content = (
    <>
      {Icon && (
        <motion.div
          className="relative overflow-hidden"
          whileHover={
            shouldAnimate
              ? {
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: {
                    rotate: { duration: 0.4, ease: 'easeInOut' },
                    scale: { duration: 0.2, ease: 'easeOut' },
                  },
                }
              : {}
          }
        >
          <Icon className="mr-2 h-4 w-4 transition-colors duration-200" />

          {isActive && shouldAnimate && (
            <motion.div
              className="bg-primary/30 absolute inset-0 rounded-full blur-sm"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>
      )}

      <motion.span
        className="relative"
        whileHover={
          shouldAnimate
            ? {
                y: -1,
                transition: { type: 'spring', stiffness: 400, damping: 25 },
              }
            : {}
        }
      >
        {label}

        {isActive && (
          <motion.div
            className="from-primary to-secondary absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </motion.span>
    </>
  );

  const baseClasses = `
    flex items-center px-4 py-2.5 text-sm font-medium rounded-xl
    group relative overflow-hidden
    transition-all duration-300 ease-out
    ${
      isActive
        ? 'text-primary bg-primary-container/25 shadow-sm ring-1 ring-primary/20'
        : 'text-on-surface-variant hover:text-on-surface'
    }
    ${mobileOnly ? 'md:hidden' : ''}
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-surface
    ${className}
  `;

  const motionVariants = {
    hover: {
      scale: shouldAnimate ? 1.02 : 1,
      y: shouldAnimate ? -1 : 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: shouldAnimate ? 0.98 : 1,
      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 30,
      },
    },
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const BackgroundElement = () => (
    <>
      {!isActive && (
        <motion.span
          className="from-secondary/15 via-primary/10 to-tertiary/15 absolute inset-0 rounded-xl bg-gradient-to-r"
          variants={bgMotionSpanVariants}
        />
      )}

      {isActive && shouldAnimate && (
        <motion.span
          className="from-primary/5 via-primary-container/30 to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-r"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <motion.span
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={
          shouldAnimate
            ? {
                scale: 1.5,
                opacity: [0, 0.3, 0],
                transition: { duration: 0.4 },
              }
            : {}
        }
        style={{
          background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.3) 0%, transparent 70%)',
        }}
      />
    </>
  );

  if (to) {
    return (
      <motion.div variants={motionVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap">
        <MotionLink to={to} className={baseClasses} aria-current={isActive ? 'page' : undefined}>
          <BackgroundElement />
          <span className="relative z-10 flex items-center">{content}</span>
        </MotionLink>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      variants={motionVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      aria-pressed={isActive}
    >
      <BackgroundElement />
      <span className="relative z-10 flex items-center">{content}</span>
    </motion.button>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(NavItem);
