'use client';

import Card from '@/components/ui/Card';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';
import { useRef, useState } from 'react';
import { GiRollingBomb } from 'react-icons/gi';

interface Step2Props {
  name1: string;
  name2: string;
  commonLetters: string[];
}

/**
 * Enhanced Step 2 component showing the common letter striking process
 * with sophisticated animations and visual feedback
 */
export default function Step2CommonLetters({ name1, name2, commonLetters }: Step2Props) {
  const { shouldAnimate } = useAnimationPreferences();
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const isCommonLetter = (letter: string) => commonLetters.includes(letter.toUpperCase());

  // Enhanced letter rendering with strike animation
  const renderEnhancedLetters = (name: string, nameIndex: number) => {
    return name
      .toUpperCase()
      .split('')
      .map((letter, idx) => {
        const isCommon = isCommonLetter(letter);
        const delay = (nameIndex * 0.2 + idx * 0.1) * 0.5;
        const uniqueKey = `${nameIndex}-${idx}`;

        return (
          <motion.div
            key={uniqueKey}
            className="group relative"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              delay: isInView ? delay : 0,
              ease: 'easeOut',
            }}
            onMouseEnter={() => setHoveredLetter(uniqueKey)}
            onMouseLeave={() => setHoveredLetter(null)}
          >
            <motion.span
              className={`relative inline-flex min-w-[2rem] cursor-pointer items-center justify-center rounded-lg px-2 py-2 text-xl font-bold shadow-sm transition-all duration-300 md:min-w-[2.5rem] md:px-3 md:py-3 md:text-2xl
                ${
                  isCommon
                    ? 'bg-error-container/30 text-error border-error/20 line-through decoration-4'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-outline/10'
                } border`}
              animate={
                isCommon && shouldAnimate
                  ? {
                      x: [0, -2, 2, 0],
                      opacity: [1, 0.6, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.8,
                delay: delay + 0.5,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {letter}

              {/* Strike effect for common letters */}
              {isCommon && (
                <motion.div
                  className="from-error/80 via-error to-error/80 absolute inset-y-1/2 left-0 h-0.5 bg-linear-to-r"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '100%' } : {}}
                  transition={{
                    duration: 0.4,
                    delay: delay + 0.7,
                    ease: 'easeOut',
                  }}
                />
              )}

              {/* Sparkle effect on common letters */}
              {isCommon && shouldAnimate && hoveredLetter === uniqueKey && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: [0, 180, 360] }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap className="text-error h-3 w-3" />
                </motion.div>
              )}
            </motion.span>

            {/* Tooltip on hover */}
            {hoveredLetter === uniqueKey && (
              <motion.div
                className="bg-surface-container text-on-surface absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs shadow-lg"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isCommon ? 'Common letter - struck!' : 'Unique letter'}
              </motion.div>
            )}
          </motion.div>
        );
      });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative"
    >
      <Card className="group/card relative overflow-hidden p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Animated background gradient */}
        {shouldAnimate && (
          <motion.div
            className="from-error/5 to-warning/5 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          {/* Enhanced Header */}
          <motion.h2
            className="font-heading text-on-surface mb-8 flex items-center gap-3 text-2xl font-bold"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.span
              className="bg-primary-container/20 text-primary ring-primary/20 flex h-10 w-10 items-center justify-center rounded-full ring-2"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              2
            </motion.span>
            <span className="flex items-center gap-2">
              Strike Common Letters
              <motion.span
                animate={shouldAnimate ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <GiRollingBomb className="text-error inline h-6 w-6" />
              </motion.span>
            </span>
          </motion.h2>

          {/* Names with Striking Animation */}
          <div className="relative mb-8 space-y-8">
            {/* First Name */}
            <motion.div
              className="relative"
              initial={{ x: -30, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <Target className="text-primary h-4 w-4" />
                <span className="text-on-surface-variant text-sm font-medium">Name 1</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {renderEnhancedLetters(name1, 0)}
              </div>
            </motion.div>

            {/* Animated Divider */}
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="via-primary/30 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
              <motion.div
                animate={shouldAnimate ? { rotate: [0, 360] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="text-primary/50 h-4 w-4" />
              </motion.div>
              <div className="via-primary/30 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
            </motion.div>

            {/* Second Name */}
            <motion.div
              className="relative"
              initial={{ x: 30, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <Target className="text-secondary h-4 w-4" />
                <span className="text-on-surface-variant text-sm font-medium">Name 2</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {renderEnhancedLetters(name2, 1)}
              </div>
            </motion.div>
          </div>

          {/* Common Letters Summary */}
          <motion.div
            className="bg-error-container/10 border-error/10 mb-6 rounded-xl border p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="text-on-surface-variant text-sm font-medium">Common letters found:</span>
              <div className="flex gap-1">
                {commonLetters.map((letter, idx) => (
                  <motion.span
                    key={idx}
                    className="bg-error/20 text-error rounded-md px-2 py-0.5 text-sm font-bold"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      delay: 1 + idx * 0.1,
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Description */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="text-on-surface-variant text-lg leading-relaxed">
              We strike out matching letters from both names.
              <br className="hidden md:block" />
              <motion.span
                className="text-error font-semibold"
                animate={
                  shouldAnimate
                    ? {
                        textShadow: [
                          '0 0 0px rgba(239, 68, 68, 0)',
                          '0 0 10px rgba(239, 68, 68, 0.5)',
                          '0 0 0px rgba(239, 68, 68, 0)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Crossed-out letters
              </motion.span>{' '}
              represent the shared connection 💥
            </p>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
