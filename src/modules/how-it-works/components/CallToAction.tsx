'use client';

import Button from '@/components/ui/Button';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
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
            className="bg-primary/10 absolute top-0 left-1/4 h-32 w-32 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="bg-secondary/10 absolute right-1/4 bottom-0 h-40 w-40 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </>
      )}

      {/* Main CTA Container */}
      <motion.div
        className="bg-surface-container-high/80 relative overflow-hidden rounded-3xl p-8 shadow-xl backdrop-blur-sm md:p-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Animated border gradient */}
        <motion.div
          className="from-primary via-secondary to-tertiary absolute inset-0 rounded-3xl bg-linear-to-r p-0.5"
          style={{ zIndex: -1 }}
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
          {/* Floating icons */}
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
                <Heart className="text-primary/30 h-6 w-6 fill-current" />
              </motion.div>
              <motion.div
                className="absolute top-8 right-12"
                animate={{
                  y: [10, -10, 10],
                  rotate: [0, -15, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="text-secondary/30 h-5 w-5" />
              </motion.div>
              <motion.div
                className="absolute bottom-8 left-1/4"
                animate={{
                  y: [-5, 5, -5],
                  x: [-5, 5, -5],
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              >
                <RiSparklingLine className="text-tertiary/30 h-6 w-6" />
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
              className="bg-primary/10 rounded-full p-4"
              animate={
                shouldAnimate
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(249, 115, 22, 0.4)',
                        '0 0 0 20px rgba(249, 115, 22, 0)',
                        '0 0 0 0 rgba(249, 115, 22, 0)',
                      ],
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
            Ready to Find Your{' '}
            <motion.span
              className="text-primary inline-block"
              animate={
                shouldAnimate
                  ? {
                      textShadow: [
                        '0 0 0px rgba(249, 115, 22, 0)',
                        '0 0 20px rgba(249, 115, 22, 0.6)',
                        '0 0 0px rgba(249, 115, 22, 0)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              Flame
            </motion.span>
            ?
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-on-surface-variant mx-auto mb-8 max-w-xl text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Now that you know how FLAMES works, it&apos;s time to discover what the stars have in store for you and your
            special someone! ✨
          </motion.p>

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
                  Play FLAMES Now
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

          {/* Additional info */}
          <motion.p
            className="text-on-surface-variant/60 mt-6 text-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            No sign-up required • Completely free • Works on all devices
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
}
