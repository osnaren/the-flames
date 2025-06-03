import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import ShareActions from '@components/homepage/ShareActions';
import ParticleBackground from '@components/ui/ParticleBackground';
import { FlamesResult } from '@features/flamesGame/flames.types';
import { getResultVisuals } from '@features/flamesGame/resultVisuals';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import Button from '@ui/Button';
import { Wand2, X } from 'lucide-react';

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
  const { shouldAnimate: userPreferredAnimations } = useAnimationPreferences();

  // Combine prop-based animation flag with user preferences
  const shouldUseAnimations = shouldAnimate && userPreferredAnimations;

  // Track when animations have completed for additional effects
  useEffect(() => {
    if (shouldUseAnimations) {
      const timer = setTimeout(() => {
        setHasEntered(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setHasEntered(true);
    }
  }, [shouldUseAnimations]);

  // Get all styling and content info for this result
  const visualConfig = useMemo(() => getResultVisuals(result), [result]);

  // Destructure commonly used properties for better readability
  const {
    color,
    onColor,
    glowColor,
    icon: ResultIcon,
    quote,
    accessibilityLabel,
    particleCount,
    endText,
  } = visualConfig;

  // Get the text representation of the result for CSS variable lookup
  const resultText = useMemo(() => {
    if (!result) return '';

    switch (result) {
      case 'F':
        return 'friendship';
      case 'L':
        return 'love';
      case 'A':
        return 'affection';
      case 'M':
        return 'marriage';
      case 'E':
        return 'enemy';
      case 'S':
        return 'siblings';
      default:
        return '';
    }
  }, [result]);

  // Function to handle transparency for CSS variables properly
  const withOpacity = useCallback((color: string, opacity: number) => {
    if (color.startsWith('var(--')) {
      return `color-mix(in srgb, ${color}, transparent ${100 - opacity}%)`;
    } else if (color.startsWith('rgba(')) {
      return color.replace(/[\d.]+\)$/, `${opacity / 100})`);
    } else {
      return `${color}${Math.round(opacity * 2.55)
        .toString(16)
        .padStart(2, '0')}`;
    }
  }, []);

  // Get the result text to display (Friendship, Love, etc.)
  const resultDisplayText = useMemo(() => {
    if (!result) return '';

    switch (result) {
      case 'F':
        return 'Friendship';
      case 'L':
        return 'Love';
      case 'A':
        return 'Affection';
      case 'M':
        return 'Marriage';
      case 'E':
        return 'Enemy';
      case 'S':
        return 'Siblings';
      default:
        return '';
    }
  }, [result]);

  // Show manual mode notification
  const showManualMode = useCallback(() => {
    toast('Manual Mode coming soon!', {
      icon: '🔮',
      duration: 3000,
    });
  }, []);

  // Animation variants - memoized to prevent recalculations
  const animations = useMemo(() => {
    const simplified = !shouldUseAnimations;

    return {
      containerVariants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            when: 'beforeChildren',
            staggerChildren: simplified ? 0 : 0.1,
            duration: 0.4,
            ease: 'easeOut',
          },
        },
      },

      itemVariants: {
        hidden: simplified ? { opacity: 0 } : { y: 15, opacity: 0, scale: 0.95 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: simplified ? 'tween' : 'spring',
            stiffness: 400,
            damping: 17,
            mass: 0.8,
            duration: simplified ? 0.3 : undefined,
          },
        },
      },

      iconAnimation: simplified
        ? {}
        : {
            scale: [1, 1.08, 1],
            rotate: [0, 2, 0, -2, 0],
            filter: [
              `drop-shadow(0 0 4px ${withOpacity(color, 50)})`,
              `drop-shadow(0 0 8px ${withOpacity(color, 70)})`,
              `drop-shadow(0 0 4px ${withOpacity(color, 50)})`,
            ],
          },
    };
  }, [shouldUseAnimations, color, withOpacity]);

  // Names highlighting animation
  const nameHighlightAnimation = useMemo(() => {
    if (!hasEntered || !shouldUseAnimations) return {};

    return {
      color: [color, 'var(--md-color-on-surface-variant)', color],
    };
  }, [hasEntered, shouldUseAnimations, color]);

  // Create background gradient style
  const cardGradientStyle = useMemo(() => {
    if (!result) return {};

    return {
      background: `
        radial-gradient(circle at 50% 0%, ${withOpacity(color, 15)} 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, ${withOpacity(color, 20)} 0%, transparent 40%)
      `,
      boxShadow: shouldUseAnimations ? `0 0 30px -5px ${withOpacity(color, 30)}` : undefined,
    };
  }, [result, color, shouldUseAnimations, withOpacity]);

  return (
    <motion.div
      className="bg-surface relative mt-8 overflow-hidden rounded-xl p-5 text-center shadow-xl md:mt-12 md:p-8"
      initial={shouldUseAnimations ? { opacity: 0, y: 20, scale: 0.97 } : { opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24,
        delay: shouldUseAnimations ? 0.2 : 0,
      }}
      aria-live="polite"
      role="region"
      aria-label={accessibilityLabel}
      style={{
        ...cardGradientStyle,
        willChange: shouldUseAnimations ? 'transform, opacity' : undefined,
      }}
    >
      {/* Enhanced subtle glow effect */}
      {hasEntered && (
        <div
          className="absolute inset-0 -z-10 overflow-hidden rounded-xl opacity-80"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${withOpacity(color, 15)} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Floating particles using the new ParticleBackground component */}
      {hasEntered && shouldUseAnimations && (
        <ParticleBackground color={glowColor} particleCount={Math.floor(particleCount / 12)} enabled={true} />
      )}

      <motion.div className="relative z-10" variants={animations.containerVariants} initial="hidden" animate="visible">
        {/* Enhanced icon with animation and glow effects */}
        <motion.div className="relative mb-6 md:mb-8" variants={animations.itemVariants}>
          {ResultIcon && (
            <motion.div
              className="relative"
              animate={animations.iconAnimation}
              transition={{
                duration: 6,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {/* Improved pulsing background for icon with larger radius */}
              {shouldUseAnimations && (
                <motion.div
                  className="absolute -inset-4 -z-10 rounded-full opacity-50"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
                    filter: 'blur(12px)',
                  }}
                />
              )}

              <ResultIcon
                className="mx-auto h-16 w-16 md:h-24 md:w-24"
                style={{
                  color: color,
                  filter: shouldUseAnimations ? `drop-shadow(0 0 8px ${withOpacity(glowColor, 60)})` : undefined,
                }}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Result title with enhanced text shadow and result-specific colors */}
        <motion.h2
          className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl"
          variants={animations.itemVariants}
          style={{
            color: `var(--md-color-on-${resultText}-container)`,
            textShadow: hasEntered && shouldUseAnimations ? `0 0 12px ${withOpacity(color, 40)}` : 'none',
          }}
        >
          {resultDisplayText}
        </motion.h2>

        {/* Result description with highlighted names */}
        <motion.p className="text-on-surface-variant mb-5 md:mb-6" variants={animations.itemVariants}>
          <motion.span
            className="font-medium"
            animate={nameHighlightAnimation}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {name1}
          </motion.span>{' '}
          and{' '}
          <motion.span
            className="font-medium"
            animate={nameHighlightAnimation}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            {name2}
          </motion.span>{' '}
          are destined to be{' '}
          <span className="font-semibold" style={{ color: onColor }}>
            {endText || resultDisplayText.toLowerCase()}!
          </span>
        </motion.p>

        {/* Quote with enhanced styling and subtle background */}
        <motion.div
          className="bg-surface-container text-on-surface-variant mb-6 rounded-lg p-3 text-sm italic md:mb-8 md:p-4"
          variants={animations.itemVariants}
          style={{
            boxShadow: `0 0 10px rgba(0,0,0,0.04)`,
            border: `1px solid ${withOpacity(color, 20)}`,
          }}
        >
          <motion.span
            initial={{ opacity: hasEntered ? 0 : 1 }}
            animate={hasEntered && shouldUseAnimations ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            style={{ color: color }}
          >
            "
          </motion.span>
          {quote}
          <motion.span
            initial={{ opacity: hasEntered ? 0 : 1 }}
            animate={hasEntered && shouldUseAnimations ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            style={{ color: color }}
          >
            "
          </motion.span>
        </motion.div>

        {/* Action buttons with enhanced animations */}
        <motion.div className="grid gap-2 md:gap-3" variants={animations.itemVariants} ref={resultActionsRef}>
          <div className="mb-2 grid grid-cols-2 gap-2 md:mb-3 md:gap-3">
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
