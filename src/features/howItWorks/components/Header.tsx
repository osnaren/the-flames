import Button from '@components/ui/Button';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Flame, Zap } from 'lucide-react';
import { GiSparkyBomb } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced Header component for How It Works page
 * Includes navigation back button and animated page title with floating elements
 */
export default function Header() {
  const navigate = useNavigate();
  const { shouldAnimate } = useAnimationPreferences();
  const { scrollY } = useScroll();

  // Parallax effect for floating elements
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -30]);

  const goBack = () => {
    navigate('/');
  };

  return (
    <>
      {/* Enhanced Back Button */}
      <motion.div
        className="mb-6 flex items-center"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={goBack}
            icon={ArrowLeft}
            className="group transition-all duration-300 hover:shadow-md"
          >
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">Back to Game</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Title Section */}
      <motion.div
        className="relative mb-20 overflow-hidden text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        {/* Background decorative elements */}
        {shouldAnimate && (
          <>
            <motion.div
              className="bg-primary/30 absolute top-0 left-1/4 h-2 w-2 rounded-full blur-sm"
              style={{ y: y1 }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="bg-secondary/40 absolute top-10 right-1/3 h-1.5 w-1.5 rounded-full blur-sm"
              style={{ y: y2 }}
              animate={{
                opacity: [0.2, 0.7, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </>
        )}

        {/* Main Flame Icon with Enhanced Animation */}
        <motion.div
          className="relative mb-6 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.4,
          }}
        >
          <motion.div
            className="relative"
            animate={
              shouldAnimate
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
          >
            <Flame className="text-primary h-20 w-20 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />

            {/* Floating sparkles around the flame */}
            {shouldAnimate && (
              <>
                <motion.div
                  className="absolute top-0 -right-2"
                  animate={{
                    y: [-3, 3, -3],
                    rotate: [0, 180, 360],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <GiSparkyBomb className="text-tertiary h-4 w-4" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-3"
                  animate={{
                    y: [2, -2, 2],
                    rotate: [0, -180, -360],
                    opacity: [0.4, 0.9, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <Zap className="text-secondary h-3 w-3" />
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Enhanced Title with Staggered Animation */}
        <motion.h1
          className="font-heading text-on-background mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          How Does{' '}
          <motion.span
            className="text-primary-container relative inline-block"
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            FLAMES
            {/* Subtle glow effect */}
            {shouldAnimate && (
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
                FLAMES
              </motion.span>
            )}
          </motion.span>{' '}
          Ignite?
        </motion.h1>

        {/* Enhanced Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        >
          <p className="text-on-surface-variant mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
            Discover the{' '}
            <motion.span
              className="text-secondary font-semibold"
              animate={
                shouldAnimate
                  ? {
                      color: ['hsl(var(--secondary))', 'hsl(var(--primary))', 'hsl(var(--secondary))'],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              sparks behind
            </motion.span>{' '}
            the classic childhood game, one step at a time.
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
        >
          <div className="via-outline/30 h-px w-24 bg-gradient-to-r from-transparent to-transparent" />
        </motion.div>
      </motion.div>
    </>
  );
}
