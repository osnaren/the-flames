import { useGameIntegration } from '@/hooks/useGameIntegration';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { LetterTileProps } from '../types';

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export default function LetterTile({
  letter,
  index,
  nameIndex,
  isCrossed = false,
  onToggle,
  className = '',
}: LetterTileProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const { sound } = useGameIntegration();
  const { hapticFeedback } = useHapticFeedback();

  const handleClick = () => {
    if (onToggle) {
      // Trigger haptic feedback first for immediate response
      hapticFeedback.letterStrike();
      onToggle();

      // Create particle effect when crossing out
      if (!isCrossed) {
        // Play sound effect for letter strike
        sound.playSound('letterStrike', { volume: 0.5 });

        const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: 50 + (Math.random() - 0.5) * 40,
          y: 50 + (Math.random() - 0.5) * 40,
          targetX: (Math.random() - 0.5) * 40,
          targetY: (Math.random() - 0.5) * 40,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1200);
      }
    }
  };

  const handleHoverStart = () => {
    setIsHovered(true);
    // Play subtle hover sound
    sound.playSound('hover', { volume: 0.2 });
  };

  const getTileStyle = () => {
    return {
      base: `bg-surface-container/50 border border-outline/30 text-on-surface hover:bg-surface-container/70`,
      crossed: `bg-error-container border-error text-on-error-container`,
      hover: 'hover:shadow-lg hover:shadow-primary/20',
    };
  };

  const styles = getTileStyle();

  // Check if the letter is a valid alphabetic character
  const isAlpha = /^[a-zA-Z]$/.test(letter);

  // Static gradient classes based on nameIndex
  const gradientClass =
    nameIndex === 1
      ? 'from-primary-container to-primary-container/70'
      : 'from-tertiary-container to-tertiary-container/70';

  if (!isAlpha) {
    return (
      <div
        className={cn(
          'text-on-surface/50 bg-surface-container/20 border-outline/10 flex h-14 w-14 items-center justify-center rounded-xl border text-lg font-bold',
          className
        )}
      >
        {letter}
      </div>
    );
  }

  return (
    <motion.div className="relative">
      {/* Particle Effects - Fixed positioning */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="bg-error pointer-events-none absolute h-2 w-2 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 8px rgba(var(--color-error-rgb), 0.8)',
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 0,
                x: particle.targetX,
                y: particle.targetY,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                ease: 'easeOut',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handleClick}
        onHoverStart={handleHoverStart}
        onHoverEnd={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className={cn(
          'group relative h-14 min-h-11 w-14 min-w-11 rounded-xl text-lg font-bold',
          'touch-manipulation transition-all duration-300',
          isCrossed ? styles.crossed : styles.base,
          styles.hover,
          className,
          'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none'
        )}
        whileHover={{ scale: 1.15, y: -6, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: index * 0.08,
          type: 'tween',
          stiffness: 300,
          damping: 20,
        }}
        disabled={!onToggle}
        aria-label={`${isCrossed ? 'Uncross' : 'Cross out'} letter ${letter}`}
      >
        {/* Background gradient effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-20',
            !isCrossed && gradientClass
          )}
        />

        {/* Letter content */}
        <motion.span
          className="relative z-10"
          animate={
            isCrossed
              ? {
                  scale: [1, 0.8, 1],
                  opacity: [1, 0.6, 0.7],
                }
              : {
                  scale: isHovered ? 1.1 : 1,
                }
          }
          transition={{ duration: 0.2 }}
        >
          {letter.toUpperCase()}
        </motion.span>

        {/* Cross-out effect with enhanced animations */}
        {isCrossed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
            }}
          >
            {/* Bolder cross-out lines with animated prominent glow */}
            <motion.div
              className="bg-error h-2 w-full origin-center rotate-45 transform"
              initial={{ width: 0 }}
              animate={{ width: '110%' }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                boxShadow: '0 0 12px rgba(239, 68, 68, 1.0)',
                filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))',
              }}
            />
            <motion.div
              className="bg-error absolute h-2 w-full origin-center -rotate-45 transform"
              initial={{ width: 0 }}
              animate={{ width: '110%' }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{
                boxShadow: '0 0 12px rgba(239, 68, 68, 1.0)',
                filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))',
              }}
            />

            {/* Pulsing background overlay for more visual emphasis */}
            <motion.div
              className="bg-error/30 absolute inset-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0.2],
                scale: [0.8, 1.05, 1],
              }}
              transition={{
                duration: 1,
                delay: 0.1,
                ease: 'easeOut',
                opacity: {
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 1.5,
                },
              }}
            />

            {/* Extra glow effect */}
            <motion.div
              className="bg-error/10 absolute inset-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ filter: 'blur(4px)' }}
            />
          </motion.div>
        )}

        {/* Floating effect indicator */}
        {isHovered && !isCrossed && (
          <motion.div
            className="bg-primary absolute -top-2 -right-2 h-3 w-3 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              y: [-5, -10, -5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Step indicator badge */}
        <div
          className={`bg-surface-container text-on-surface-variant absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold`}
        >
          {nameIndex}
        </div>
      </motion.button>
    </motion.div>
  );
}
