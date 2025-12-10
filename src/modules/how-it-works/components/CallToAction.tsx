'use client';

import Button from '@/components/ui/Button';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Heart, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { RiSparklingLine } from 'react-icons/ri';

/**
 * Enhanced Call to Action component encouraging users to try the FLAMES game
 * with engaging animations and visual appeal
 */
export default function CallToAction() {
  const { shouldAnimate } = useAnimationPreferences();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={containerRef}
      className="relative py-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorations */}
      {shouldAnimate && (
        <>
          <motion.div
            className="bg-primary-container/30 dark:bg-primary-container/20 absolute top-0 left-1/4 h-32 w-32 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="bg-secondary-container/30 dark:bg-secondary-container/20 absolute right-1/4 bottom-0 h-40 w-40 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </>
      )}

      {/* Main CTA Container */}
      <motion.div
        className="bg-surface-container-high/90 dark:bg-surface-container-high/80 border-outline-variant/20 relative overflow-hidden rounded-3xl border p-8 shadow-xl backdrop-blur-sm md:p-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Animated border gradient - improved visibility */}
        <motion.div
          className="from-primary-container via-secondary-container to-tertiary-container dark:from-primary dark:via-secondary dark:to-tertiary absolute inset-0 -z-10 rounded-3xl bg-linear-to-r opacity-30 dark:opacity-20"
          animate={
            shouldAnimate
              ? {
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }
              : {}
          }
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Content */}
        <div className="relative text-center">
          {/* Floating icons - improved colors for visibility */}
          {shouldAnimate && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-4 left-8"
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 15, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Heart className="text-love/40 dark:text-love/50 h-6 w-6 fill-current" />
              </motion.div>
              <motion.div
                className="absolute top-8 right-12"
                animate={{
                  y: [10, -10, 10],
                  rotate: [0, -15, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="text-secondary/40 dark:text-secondary/50 h-5 w-5" />
              </motion.div>
              <motion.div
                className="absolute bottom-8 left-1/4"
                animate={{
                  y: [-5, 5, -5],
                  x: [-5, 5, -5],
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              >
                <RiSparklingLine className="text-tertiary/40 dark:text-tertiary/50 h-6 w-6" />
              </motion.div>
              <motion.div
                className="absolute right-1/4 bottom-4"
                animate={{
                  y: [5, -5, 5],
                  rotate: [0, 10, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
              >
                <Wand2 className="text-marriage/40 dark:text-marriage/50 h-5 w-5" />
              </motion.div>
            </div>
          )}

          {/* Icon */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
          >
            <motion.div
              className="bg-primary-container/30 dark:bg-primary-container/40 border-primary/20 dark:border-primary/30 rounded-full border-2 p-4"
              animate={
                shouldAnimate
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              <RiSparklingLine className="text-primary h-12 w-12" />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="font-heading text-on-surface mb-4 text-3xl font-bold md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Alright, Enough Theory!{' '}
            <motion.span
              className="text-primary inline-block"
              animate={
                shouldAnimate
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥
            </motion.span>
          </motion.h2>

          {/* Description - funnier copy */}
          <motion.div
            className="text-on-surface-variant mx-auto mb-8 max-w-xl space-y-3 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>
              You&apos;ve learned the ancient secrets. You&apos;ve seen the magic unfold.{' '}
              <span className="text-on-surface font-medium">Now it&apos;s your turn</span> to discover what fate
              has written in the stars (or, you know, in some crossed-out letters).
            </p>
            <p className="text-on-surface-variant/80 text-base">
              Will it be <span className="text-love font-semibold">Love</span>? 💕{' '}
              <span className="text-marriage font-semibold">Marriage</span>? 💍 Or the dreaded{' '}
              <span className="text-enemy font-semibold">Enemies</span>? 😈
            </p>
            <p className="text-on-surface-variant/60 text-sm italic">
              (Spoiler: We&apos;re not responsible for any awkward conversations this may cause.)
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link href="/">
              <Button
                size="lg"
                className="group relative overflow-hidden px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Let&apos;s Find Out!
                  <motion.span
                    animate={
                      shouldAnimate
                        ? {
                            x: [0, 5, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </span>

                {/* Button hover effect */}
                <motion.div
                  className="bg-on-primary/10 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
          </motion.div>

          {/* Additional info - more playful */}
          <motion.div
            className="mt-6 space-y-1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <p className="text-on-surface-variant/70 text-sm">
              ✨ No sign-up required • 🆓 Completely free • 📱 Works everywhere
            </p>
            <p className="text-on-surface-variant/50 text-xs">
              (Your crush won&apos;t know you checked... unless you share the result 😉)
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
