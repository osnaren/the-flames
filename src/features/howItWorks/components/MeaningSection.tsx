import Card from '@components/ui/Card';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { motion, useInView } from 'framer-motion';
import { BellRing, Handshake, Heart, Smile, Sparkles, Star, Sword } from 'lucide-react';
import { useRef } from 'react';
import { GiSparkles } from 'react-icons/gi';
import { SiCodemagic } from 'react-icons/si';

// Enhanced meaning cards with theme-aligned colors from design system
const meaningCards = [
  {
    letter: 'F',
    meaning: 'Friendship',
    oneLiner: 'Built different. Partners in crime.',
    icon: Handshake,
    emoji: '🤝',
    color: 'text-friendship',
    bgColor: 'bg-friendship-container/20',
    ringColor: 'ring-friendship/20',
    hoverColor: 'hover:bg-friendship-container/30',
    gradientFrom: 'from-friendship/20',
    gradientTo: 'to-friendship-container/40',
  },
  {
    letter: 'L',
    meaning: 'Love',
    oneLiner: 'Butterflies? More like fireworks.',
    icon: Heart,
    emoji: '❤️',
    color: 'text-love',
    bgColor: 'bg-love-container/20',
    ringColor: 'ring-love/20',
    hoverColor: 'hover:bg-love-container/30',
    gradientFrom: 'from-love/20',
    gradientTo: 'to-love-container/40',
  },
  {
    letter: 'A',
    meaning: 'Affection',
    oneLiner: 'Too sweet to handle. Proceed carefully.',
    icon: Star,
    emoji: '⭐',
    color: 'text-affection',
    bgColor: 'bg-affection-container/20',
    ringColor: 'ring-affection/20',
    hoverColor: 'hover:bg-affection-container/30',
    gradientFrom: 'from-affection/20',
    gradientTo: 'to-affection-container/40',
  },
  {
    letter: 'M',
    meaning: 'Marriage',
    oneLiner: 'From matches to milestones.',
    icon: BellRing,
    emoji: '💍',
    color: 'text-marriage',
    bgColor: 'bg-marriage-container/20',
    ringColor: 'ring-marriage/20',
    hoverColor: 'hover:bg-marriage-container/30',
    gradientFrom: 'from-marriage/20',
    gradientTo: 'to-marriage-container/40',
  },
  {
    letter: 'E',
    meaning: 'Enemy',
    oneLiner: 'Warning: drama ahead.',
    icon: Sword,
    emoji: '⚔️',
    color: 'text-enemy',
    bgColor: 'bg-enemy-container/20',
    ringColor: 'ring-enemy/20',
    hoverColor: 'hover:bg-enemy-container/30',
    gradientFrom: 'from-enemy/20',
    gradientTo: 'to-enemy-container/40',
  },
  {
    letter: 'S',
    meaning: 'Siblings',
    oneLiner: 'Like two peas in a pod. Forever bonded.',
    icon: Smile,
    emoji: '👫',
    color: 'text-siblings',
    bgColor: 'bg-siblings-container/20',
    ringColor: 'ring-siblings/20',
    hoverColor: 'hover:bg-siblings-container/30',
    gradientFrom: 'from-siblings/20',
    gradientTo: 'to-siblings-container/40',
  },
];

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

/**
 * Enhanced component to display the meaning of each FLAMES letter with sophisticated animations
 */
export default function MeaningSection() {
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
      <Card className="relative cursor-default overflow-hidden p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Background decorative elements */}
        {shouldAnimate && (
          <>
            <motion.div
              className="absolute top-4 right-4 opacity-10"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <GiSparkles className="text-primary h-16 w-16" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4 opacity-5"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Heart className="text-secondary h-20 w-20 fill-current" />
            </motion.div>
          </>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          {/* Enhanced Title */}
          <motion.h2
            className="font-heading text-on-surface mb-10 text-center text-3xl font-bold md:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What Each Letter{' '}
            <motion.span
              className="text-primary-container relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Means
              {shouldAnimate && (
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
                  <Sparkles className="text-tertiary h-3 w-3" />
                </motion.div>
              )}
            </motion.span>
          </motion.h2>

          {/* Enhanced Cards Grid */}
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {meaningCards.map(
              (
                {
                  letter,
                  meaning,
                  oneLiner,
                  icon: _IconComponent,
                  emoji,
                  color,
                  bgColor,
                  ringColor,
                  hoverColor,
                  gradientFrom,
                  gradientTo,
                },
                index
              ) => (
                <motion.div
                  key={letter}
                  variants={cardVariants}
                  className={`group border-outline/5 relative rounded-xl border p-6 shadow-md backdrop-blur-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${bgColor} ${hoverColor}`}
                  whileHover={{
                    scale: shouldAnimate ? 1.05 : 1,
                    rotateY: shouldAnimate ? 5 : 0,
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card background gradient on hover */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Card content */}
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-4">
                      {/* Enhanced Icon Container */}
                      <motion.div
                        className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${bgColor} ${color} ring-2 ${ringColor} transition-all duration-300 group-hover:ring-4`}
                        whileHover={{ rotate: shouldAnimate ? 360 : 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <span className="font-emoji relative z-10 text-2xl">{emoji}</span>

                        {/* Icon glow effect */}
                        {shouldAnimate && (
                          <motion.div
                            className={`absolute inset-0 rounded-full ${bgColor} opacity-0 blur-sm group-hover:opacity-50`}
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        )}
                      </motion.div>

                      {/* Text Content */}
                      <div className="flex-1">
                        <motion.div
                          className={`font-heading text-xl font-bold ${color} mb-1`}
                          whileHover={{ x: shouldAnimate ? 5 : 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {letter} - {meaning}
                        </motion.div>
                        <motion.div
                          className="text-on-surface-variant text-sm leading-relaxed font-medium"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {oneLiner}
                        </motion.div>
                      </div>
                    </div>

                    {/* Floating sparkle on hover */}
                    {shouldAnimate && (
                      <motion.div
                        className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-100"
                        animate={{
                          y: [-2, 2, -2],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <SiCodemagic className={`h-3 w-3 ${color}`} />
                      </motion.div>
                    )}
                  </div>

                  {/* Card number indicator */}
                  <motion.div
                    className="bg-surface-container/50 text-on-surface-variant absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                  >
                    {index + 1}
                  </motion.div>
                </motion.div>
              )
            )}
          </motion.div>

          {/* Enhanced Quote */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.p
              className="text-on-surface-variant mx-auto max-w-lg text-base leading-relaxed italic"
              whileHover={{ scale: shouldAnimate ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              "Remember scribbling this on the back of notebooks? <br />
              <motion.span
                className="text-primary font-semibold not-italic"
                animate={
                  shouldAnimate
                    ? {
                        textShadow: [
                          '0 0 0px rgba(249, 115, 22, 0)',
                          '0 0 8px rgba(249, 115, 22, 0.4)',
                          '0 0 0px rgba(249, 115, 22, 0)',
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
                Pure nostalgia!
              </motion.span>{' '}
              ✨"
            </motion.p>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
