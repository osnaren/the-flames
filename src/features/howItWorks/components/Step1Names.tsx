import Card from '@components/ui/Card';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Step1Props {
  name1: string;
  name2: string;
}

// Enhanced Name Connector Component
const NameConnector = ({ shouldAnimate }: { shouldAnimate: boolean }) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    if (shouldAnimate) {
      const particleArray = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 0.2,
      }));
      setParticles(particleArray);
    }
  }, [shouldAnimate]);

  return (
    <div className="relative flex h-24 w-16 items-center justify-center md:h-16 md:w-32">
      {/* Enhanced Background Glow */}
      <motion.div
        className="from-primary/10 via-primary-container/30 to-secondary/10 absolute inset-0 rounded-full bg-gradient-to-r blur-lg"
        animate={
          shouldAnimate
            ? {
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }
            : {}
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main Connection Line */}
      <div className="relative h-full w-1 md:h-1 md:w-full">
        {/* Base Line */}
        <div className="from-primary/60 via-primary-container to-secondary/60 absolute inset-0 rounded-full bg-gradient-to-b md:bg-gradient-to-r" />

        {/* Animated Energy Flow */}
        <motion.div
          className="via-primary absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-transparent md:bg-gradient-to-r"
          animate={
            shouldAnimate
              ? {
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Heart Beat Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={
          shouldAnimate
            ? {
                scale: [1, 1.3, 1],
                rotate: [0, 5, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Heart className="fill-primary text-primary h-4 w-4 drop-shadow-sm" />
      </motion.div>

      {/* Floating Particles */}
      <AnimatePresence>
        {shouldAnimate &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="bg-primary/80 absolute h-1 w-1 rounded-full"
              initial={{
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10,
                opacity: 0,
              }}
              animate={{
                x: Math.random() * 40 - 20,
                y: Math.random() * 40 - 20,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
      </AnimatePresence>

      {/* Energy Sparkles */}
      {shouldAnimate && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-2 left-2"
            animate={{
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5,
            }}
          >
            <Sparkles className="text-secondary h-2 w-2" />
          </motion.div>
          <motion.div
            className="absolute right-2 bottom-2"
            animate={{
              opacity: [0, 1, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          >
            <Zap className="text-tertiary h-2 w-2" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced Step 1 component showing the input names with sophisticated connection animation
 */
export default function Step1Names({ name1, name2 }: Step1Props) {
  const { shouldAnimate } = useAnimationPreferences();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative"
    >
      <Card className="overflow-hidden p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
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
              1
            </motion.span>
            Enter Two Names
          </motion.h2>

          {/* Names Display with Enhanced Layout */}
          <div
            className="relative mb-8 flex flex-col items-center justify-center gap-8 md:flex-row"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* First Name */}
            <motion.div
              className="group relative"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="bg-surface-container-highest/90 text-on-surface relative rounded-xl p-6 text-2xl font-medium shadow-lg backdrop-blur-sm"
                animate={
                  isHovered && shouldAnimate
                    ? {
                        boxShadow: [
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {name1}
                {/* Subtle glow effect */}
                <div className="from-primary/10 absolute inset-0 rounded-xl bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>

              {/* Floating accent */}
              {shouldAnimate && (
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    y: [-2, 2, -2],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="text-primary/60 h-4 w-4" />
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Name Connector */}
            <NameConnector shouldAnimate={shouldAnimate} />

            {/* Second Name */}
            <motion.div
              className="group relative"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="bg-surface-container-highest/90 text-on-surface relative rounded-xl p-6 text-2xl font-medium shadow-lg backdrop-blur-sm"
                animate={
                  isHovered && shouldAnimate
                    ? {
                        boxShadow: [
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                {name2}
                {/* Subtle glow effect */}
                <div className="from-secondary/10 absolute inset-0 rounded-xl bg-gradient-to-l to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>

              {/* Floating accent */}
              {shouldAnimate && (
                <motion.div
                  className="absolute -top-2 -left-2"
                  animate={{
                    y: [2, -2, 2],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                >
                  <Heart className="text-secondary/60 h-4 w-4 fill-current" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Enhanced Description */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-on-surface-variant text-lg leading-relaxed">
              We start with two names, ready to{' '}
              <motion.span
                className="text-primary font-semibold"
                animate={
                  shouldAnimate
                    ? {
                        textShadow: [
                          '0 0 0px rgba(249, 115, 22, 0)',
                          '0 0 10px rgba(249, 115, 22, 0.5)',
                          '0 0 0px rgba(249, 115, 22, 0)',
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
                uncover the spark
              </motion.span>
              ✨
            </p>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
