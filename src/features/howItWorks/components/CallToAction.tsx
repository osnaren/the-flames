import Button from '@components/ui/Button';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { RiSparklingLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

/**
 * Enhanced Call To Action component at the bottom of the How It Works page
 * Features sophisticated animations and visual effects
 */
export default function CallToAction() {
  const { shouldAnimate } = useAnimationPreferences();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden py-16 text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Background decorative elements */}
      {shouldAnimate && (
        <>
          <motion.div
            className="bg-primary/20 absolute top-4 left-1/4 h-2 w-2 rounded-full blur-sm"
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="bg-secondary/30 absolute top-8 right-1/3 h-1.5 w-1.5 rounded-full blur-sm"
            animate={{
              y: [8, -8, 8],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
          <motion.div
            className="bg-tertiary/25 absolute bottom-6 left-1/5 h-1 w-1 rounded-full blur-sm"
            animate={{
              y: [5, -5, 5],
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </>
      )}

      {/* Fire emoji with enhanced animation */}
      <motion.div
        className="mb-8 flex justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
      >
        <motion.div
          className="relative"
          animate={
            shouldAnimate
              ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-6xl drop-shadow-lg filter">🔥</span>

          {/* Floating elements around the fire */}
          {shouldAnimate && (
            <>
              <motion.div
                className="absolute -top-3 -right-2"
                animate={{
                  y: [-3, 3, -3],
                  rotate: [0, 180, 360],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="text-primary h-4 w-4" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-3"
                animate={{
                  y: [2, -2, 2],
                  rotate: [0, -180, -360],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <Heart className="text-secondary h-3 w-3 fill-current" />
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Enhanced Title */}
      <motion.h2
        className="font-heading text-on-surface mb-8 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        Ready to Find Your Own{' '}
        <motion.span
          className="text-primary-container relative inline-block"
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Spark
          {shouldAnimate && (
            <>
              <motion.span
                className="text-primary-container absolute inset-0"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(249, 115, 22, 0)',
                    '0 0 20px rgba(249, 115, 22, 0.6)',
                    '0 0 0px rgba(249, 115, 22, 0)',
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Spark
              </motion.span>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <RiSparklingLine className="text-tertiary h-4 w-4" />
              </motion.div>
            </>
          )}
        </motion.span>
        ?
      </motion.h2>

      {/* Enhanced Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.6,
        }}
      >
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="group relative overflow-hidden px-10 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {/* Button background glow effect */}
              {shouldAnimate && (
                <motion.div
                  className="from-primary/20 via-primary-container/30 to-secondary/20 absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              )}

              <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
                Play The Flames Now!
              </span>

              {/* Floating sparkles on hover */}
              {shouldAnimate && (
                <motion.div
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                  animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="text-primary-container h-3 w-3" />
                </motion.div>
              )}
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-on-surface-variant mt-6 text-base opacity-80 md:text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 0.8, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
      >
        Your destiny awaits – let the magic begin! ✨
      </motion.p>
    </motion.div>
  );
}
