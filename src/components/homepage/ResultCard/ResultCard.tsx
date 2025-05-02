import { motion } from 'framer-motion';
import { Heart, BellRing as Ring, Star, Sword, Users, Wand2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import ShareActions from '@components/homepage/ShareActions';
import { FlamesResult } from '@features/flamesGame/flames.types';
import { resultMeanings } from '@features/flamesGame/flames.utils';
import { getResultVisuals } from '@features/flamesGame/resultVisuals';
import Button from '@ui/Button';
import ResultGlow from '@ui/ResultGlow';

interface ResultCardProps {
  name1: string;
  name2: string;
  result: FlamesResult;
  shouldAnimate: boolean;
  onReset: () => void;
  onShare: () => void;
  onCopyLink: () => void;
}

/**
 * Component for displaying the FLAMES result with enhanced animations and effects
 */
export function ResultCard({ name1, name2, result, shouldAnimate, onReset, onShare, onCopyLink }: ResultCardProps) {
  const resultActionsRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  // Track when animations have completed for additional effects
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setHasEntered(true);
      }, 1500); // Delay before triggering additional effects
      return () => clearTimeout(timer);
    } else {
      setHasEntered(true);
    }
  }, [shouldAnimate]);

  // Get styling for particles and effects - only use glowColor
  const { glowColor } = getResultVisuals(result);

  // For getting the appropriate icon based on result
  const getIconComponent = useCallback((letter: FlamesResult) => {
    if (!letter) return null;

    switch (letter) {
      case 'F':
        return Users;
      case 'L':
        return Heart;
      case 'A':
        return Star;
      case 'M':
        return Ring;
      case 'E':
        return Sword;
      case 'S':
        return Users;
      default:
        return null;
    }
  }, []);

  // Show manual mode notification
  const showManualMode = useCallback(() => {
    toast('Manual Mode coming soon!', {
      icon: '🔮',
    });
  }, []);

  const ResultIcon = result ? getIconComponent(result) : null;

  // Animation variants for staggered entrance with enhanced spring physics
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.15, // Faster stagger for better impact
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20, // More bounce for dramatic effect
        mass: 0.8,
      },
    },
  };

  // Enhanced icon animation
  const iconAnimation = {
    scale: [1, 1.1, 1],
    rotate: [0, 3, 0, -3, 0],
    filter: [
      'drop-shadow(0 0 2px rgba(var(--color-primary-rgb), 0.4))',
      'drop-shadow(0 0 8px rgba(var(--color-primary-rgb), 0.7))',
      'drop-shadow(0 0 2px rgba(var(--color-primary-rgb), 0.4))',
    ],
  };

  return (
    <motion.div
      className="bg-surface dark:bg-surface-container-high relative mt-12 overflow-hidden rounded-xl p-8 text-center shadow-xl"
      initial={shouldAnimate ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24,
        delay: shouldAnimate ? 0.3 : 0,
      }}
      aria-live="polite"
      role="region"
      aria-label="FLAMES result"
    >
      {/* Result-specific glow effect */}
      <ResultGlow result={result} isVisible={true} />

      {/* Floating particles for magical effect */}
      {hasEntered && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full opacity-70"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                opacity: [0, 0.7, 0],
                scale: [0.7, 1.2, 0.7],
              }}
              transition={{
                duration: 5 + Math.random() * 7,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
              style={{
                backgroundColor: glowColor || 'rgba(249, 115, 22, 0.4)',
                filter: 'blur(2px)',
              }}
            />
          ))}
        </div>
      )}

      <motion.div className="relative z-10" variants={containerVariants} initial="hidden" animate="visible">
        {/* Enhanced icon with animation and glow effects */}
        <motion.div className="relative mb-8" variants={itemVariants}>
          {ResultIcon && (
            <motion.div
              className="relative"
              animate={iconAnimation}
              transition={{
                duration: 6,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {/* Pulsing background for icon */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-full opacity-50"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: `radial-gradient(circle at center, ${glowColor || 'rgba(249, 115, 22, 0.6)'} 0%, transparent 70%)`,
                  filter: 'blur(8px)',
                }}
              />

              <ResultIcon
                className={`mx-auto h-20 w-20 md:h-24 md:w-24 ${result ? resultMeanings[result].color : ''}`}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Result title with enhanced text shadow */}
        <motion.h2
          className="text-on-surface dark:text-on-surface-variant mb-4 text-3xl font-bold"
          variants={itemVariants}
          style={{
            textShadow: hasEntered ? '0 0 8px rgba(var(--color-primary-rgb), 0.3)' : 'none',
          }}
        >
          {result ? resultMeanings[result].text : ''}
        </motion.h2>

        {/* Result description with highlighted names */}
        <motion.p className="text-on-surface-variant dark:text-on-surface-variant mb-6" variants={itemVariants}>
          <motion.span
            className="font-medium"
            animate={
              hasEntered
                ? {
                    color: [
                      'rgba(var(--color-primary-rgb), 1)',
                      'rgba(var(--color-on-surface-variant-rgb), 1)',
                      'rgba(var(--color-primary-rgb), 1)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {name1}
          </motion.span>{' '}
          and{' '}
          <motion.span
            className="font-medium"
            animate={
              hasEntered
                ? {
                    color: [
                      'rgba(var(--color-primary-rgb), 1)',
                      'rgba(var(--color-on-surface-variant-rgb), 1)',
                      'rgba(var(--color-primary-rgb), 1)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            {name2}
          </motion.span>{' '}
          are destined to be{' '}
          <span className="font-semibold">{result ? resultMeanings[result].text.toLowerCase() : ''}!</span>
        </motion.p>

        {/* Quote with enhanced styling */}
        <motion.div
          className="bg-surface-container text-on-surface-variant dark:bg-surface-container-low dark:text-on-surface-variant mb-8 rounded-lg p-4 text-sm italic"
          variants={itemVariants}
        >
          <motion.span
            initial={{ opacity: hasEntered ? 0 : 1 }}
            animate={hasEntered ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          >
            "
          </motion.span>
          {result ? resultMeanings[result].quote : ''}
          <motion.span
            initial={{ opacity: hasEntered ? 0 : 1 }}
            animate={hasEntered ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          >
            "
          </motion.span>
        </motion.div>

        {/* Action buttons with enhanced animations */}
        <motion.div className="grid gap-3" variants={itemVariants} ref={resultActionsRef}>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <Button onClick={onReset} variant="secondary" icon={X} fullWidth>
              Try Again
            </Button>

            <Button
              onClick={showManualMode}
              variant="purple"
              icon={Wand2}
              aria-label="Try the manual calculation mode"
              fullWidth
            >
              Manual Mode
            </Button>
          </div>

          {/* Using the ShareActions component */}
          <ShareActions onShare={onShare} onCopyLink={onCopyLink} result={result} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ResultCard;
