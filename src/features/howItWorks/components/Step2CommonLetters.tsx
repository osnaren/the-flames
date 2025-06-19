import Card from '@components/ui/Card';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GiRollingBomb } from 'react-icons/gi';

interface Step2Props {
  name1: string;
  name2: string;
  commonLetters: string[];
  remainingLettersCount: number;
}

// Enhanced letter component with particle effects
const AnimatedLetter = ({
  letter,
  index,
  isCommon,
  shouldAnimate,
}: {
  letter: string;
  index: number;
  isCommon: boolean;
  nameIndex: number;
  shouldAnimate: boolean;
}) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isCommon && shouldAnimate) {
      const timer = setTimeout(
        () => {
          setShowParticles(true);
        },
        index * 80 + 1000
      );
      return () => clearTimeout(timer);
    }
  }, [isCommon, shouldAnimate, index]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.08 + 0.4,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ scale: isCommon ? 1.05 : 1.1, y: -2 }}
    >
      <motion.span
        className={`relative inline-block rounded-lg px-4 py-2 text-lg font-medium transition-all duration-300 ${
          isCommon
            ? 'bg-error/10 text-error border-error/30 border-2 shadow-lg'
            : 'bg-surface-container-high text-on-surface border-outline/20 border shadow-md hover:shadow-lg'
        }`}
        animate={
          isCommon && shouldAnimate
            ? {
                boxShadow: [
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '0 10px 15px -3px rgba(239, 68, 68, 0.4)',
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      >
        {letter}

        {/* Enhanced Strike-through Effect */}
        {isCommon && (
          <>
            <motion.span
              className="bg-error absolute bottom-1/2 left-0 h-0.5 w-full origin-left rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: index * 0.08 + 0.7,
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
            {/* Secondary strike-through for emphasis */}
            {shouldAnimate && (
              <motion.span
                className="bg-error/60 absolute bottom-1/2 left-0 h-px w-full origin-left rounded-full blur-sm"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.08 + 0.9,
                  duration: 0.4,
                  ease: 'easeOut',
                }}
              />
            )}
          </>
        )}

        {/* Floating strike indicator */}
        {isCommon && shouldAnimate && (
          <motion.div
            className="absolute -top-2 -right-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 + 0.8, duration: 0.3 }}
          >
            <Target className="text-error h-3 w-3" />
          </motion.div>
        )}
      </motion.span>

      {/* Particle effects when letter is struck */}
      <AnimatePresence>
        {showParticles && isCommon && shouldAnimate && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-error absolute h-1 w-1 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 60,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: Math.random() * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Enhanced Step 2 component showing the common letters calculation with sophisticated animations
 */
export default function Step2CommonLetters({ name1, name2, commonLetters, remainingLettersCount }: Step2Props) {
  const { shouldAnimate } = useAnimationPreferences();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative"
    >
      <Card className="relative overflow-hidden p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Background decorative elements */}
        {shouldAnimate && (
          <>
            <motion.div
              className="absolute top-4 right-6 opacity-5"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Zap className="text-tertiary h-12 w-12" />
            </motion.div>
            <motion.div
              className="absolute bottom-6 left-4 opacity-5"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className="text-secondary h-10 w-10" />
            </motion.div>
          </>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          {/* Enhanced Header */}
          <motion.h2
            className="font-heading text-on-surface mb-8 flex items-center gap-3 text-2xl font-bold md:text-3xl"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span
              className="bg-tertiary-container/20 text-tertiary ring-tertiary/20 flex h-10 w-10 items-center justify-center rounded-full ring-2 md:h-12 md:w-12"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              2
            </motion.span>
            Strike Common Letters
            {shouldAnimate && (
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <GiRollingBomb className="text-tertiary/60 h-5 w-5" />
              </motion.div>
            )}
          </motion.h2>

          {/* Enhanced Names Grid */}
          <motion.div
            className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Name 1 */}
            <motion.div
              className="space-y-4"
              whileHover={{ scale: shouldAnimate ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="mb-3 flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-primary/60 h-3 w-3 rounded-full" />
                <p className="text-on-surface-variant text-sm font-semibold tracking-wide">
                  Name 1: <span className="text-on-surface font-bold">{name1}</span>
                </p>
              </motion.div>
              <div className="flex flex-wrap gap-3">
                {name1.split('').map((letter, i) => (
                  <AnimatedLetter
                    key={`n1-${i}`}
                    letter={letter}
                    index={i}
                    isCommon={commonLetters.includes(letter.toLowerCase())}
                    nameIndex={1}
                    shouldAnimate={shouldAnimate}
                  />
                ))}
              </div>
            </motion.div>

            {/* Name 2 */}
            <motion.div
              className="space-y-4"
              whileHover={{ scale: shouldAnimate ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="mb-3 flex items-center gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-secondary/60 h-3 w-3 rounded-full" />
                <p className="text-on-surface-variant text-sm font-semibold tracking-wide">
                  Name 2: <span className="text-on-surface font-bold">{name2}</span>
                </p>
              </motion.div>
              <div className="flex flex-wrap gap-3">
                {name2.split('').map((letter, i) => (
                  <AnimatedLetter
                    key={`n2-${i}`}
                    letter={letter}
                    index={i}
                    isCommon={commonLetters.includes(letter.toLowerCase())}
                    nameIndex={2}
                    shouldAnimate={shouldAnimate}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Summary */}
          <motion.div
            className="from-surface-container/50 to-surface-container-high/50 border-outline/10 rounded-xl border bg-gradient-to-r p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: shouldAnimate ? 1.02 : 1 }}
          >
            <motion.p
              className="text-on-surface-variant text-lg leading-relaxed"
              animate={
                shouldAnimate
                  ? {
                      textShadow: [
                        '0 0 0px rgba(0, 0, 0, 0)',
                        '0 0 8px rgba(249, 115, 22, 0.3)',
                        '0 0 0px rgba(0, 0, 0, 0)',
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              We strike out matching letters{' '}
              <motion.span className="text-error font-semibold" whileHover={{ scale: 1.1 }}>
                ({commonLetters.join(', ')})
              </motion.span>{' '}
              and see how many sparks are left:{' '}
              <motion.strong
                className="text-primary-container text-xl"
                animate={
                  shouldAnimate
                    ? {
                        scale: [1, 1.1, 1],
                        color: [
                          'hsl(var(--primary-container))',
                          'hsl(var(--secondary))',
                          'hsl(var(--primary-container))',
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
                {remainingLettersCount} letters
              </motion.strong>{' '}
              remain.
            </motion.p>

            {/* Visual separator with animation */}
            {shouldAnimate && (
              <motion.div
                className="mt-4 flex justify-center"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.div
                  className="via-primary/40 h-px w-32 bg-gradient-to-r from-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
