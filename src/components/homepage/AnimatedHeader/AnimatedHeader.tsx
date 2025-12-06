import { GameStage } from '@features/flamesGame/flames.types';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { memo, useState } from 'react';

interface AnimatedHeaderProps {
  shouldAnimate: boolean;
  stage: GameStage;
}

// FLAMES letters without dots for cleaner design
const flamesLetters = [
  { char: 'F', emoji: '🤝', full: 'Friends', color: 'from-blue-500 to-cyan-500' },
  { char: 'L', emoji: '❤️', full: 'Love', color: 'from-pink-500 to-rose-500' },
  { char: 'A', emoji: '🥰', full: 'Affection', color: 'from-amber-500 to-orange-500' },
  { char: 'M', emoji: '💍', full: 'Marriage', color: 'from-emerald-500 to-green-500' },
  { char: 'E', emoji: '😤', full: 'Enemies', color: 'from-red-500 to-red-600' },
  { char: 'S', emoji: '👫', full: 'Siblings', color: 'from-purple-500 to-violet-500' },
];

const letterContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.8, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 12,
      duration: 0.6,
    },
  },
};

function AnimatedHeaderComponent({ shouldAnimate, stage }: AnimatedHeaderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isCompact = stage === 'processing' || stage === 'result';

  return (
    <motion.header
      className="relative mb-8 text-center md:mb-12"
      initial={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isCompact ? 0.85 : 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <h1 className="sr-only">FLAMES - Relationship Calculator</h1>

      {/* Main FLAMES Title */}
      <motion.div
        className="relative mb-4 flex items-center justify-center gap-1 md:gap-2"
        variants={letterContainerVariants}
        initial={shouldAnimate ? 'hidden' : 'visible'}
        animate="visible"
        style={{ perspective: '1000px' }}
      >
        {flamesLetters.map((item, index) => (
          <motion.div
            key={item.char}
            variants={letterVariants}
            className="group relative cursor-pointer"
            onHoverStart={() => shouldAnimate && setHoveredIndex(index)}
            onHoverEnd={() => shouldAnimate && setHoveredIndex(null)}
            whileHover={
              shouldAnimate
                ? {
                    scale: 1.15,
                    y: -8,
                    rotateY: 15,
                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                  }
                : {}
            }
          >
            {/* Letter with gradient */}
            <span
              className={`relative inline-block bg-linear-to-br ${item.color} bg-clip-text text-5xl font-black text-transparent drop-shadow-lg md:text-6xl lg:text-7xl xl:text-8xl`}
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {item.char}
            </span>

            {/* Glow effect on hover */}
            {shouldAnimate && hoveredIndex === index && (
              <motion.div
                className={`absolute inset-0 -z-10 bg-linear-to-br ${item.color} opacity-30 blur-xl`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
              />
            )}

            {/* Emoji tooltip on hover */}
            <AnimatePresence>
              {shouldAnimate && hoveredIndex === index && (
                <motion.div
                  className="pointer-events-none absolute -top-12 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center md:-top-16"
                  initial={{ opacity: 0, y: 8, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.5, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <span className="text-3xl md:text-4xl">{item.emoji}</span>
                  <span className="mt-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {item.full}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="font-heading text-on-surface-variant mx-auto max-w-md text-lg font-medium md:text-xl lg:text-2xl"
        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
        animate={{ opacity: isCompact ? 0.7 : 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="inline-block">Discover your relationship destiny</span>
        <motion.span
          className="ml-2 inline-block"
          animate={
            shouldAnimate && !isCompact
              ? {
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1.2, 1],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        >
          ✨
        </motion.span>
      </motion.p>

      {/* Floating decorative elements */}
      {shouldAnimate && !isCompact && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-60"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            >
              {['💖', '💕', '✨', '💫', '💝'][i]}
            </motion.div>
          ))}
        </div>
      )}
    </motion.header>
  );
}

export const AnimatedHeader = memo(AnimatedHeaderComponent);

export default AnimatedHeader;
