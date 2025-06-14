import { GameStage } from '@features/flamesGame/flames.types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface AnimatedHeaderProps {
  shouldAnimate: boolean;
  stage: GameStage;
}

const flamesLetters = [
  { char: 'F', emoji: '🤝', full: 'Friends' },
  { char: '.', emoji: '' },
  { char: 'L', emoji: '❤️', full: 'Love' },
  { char: '.', emoji: '' },
  { char: 'A', emoji: '🥰', full: 'Affection' },
  { char: '.', emoji: '' },
  { char: 'M', emoji: '💍', full: 'Marriage' },
  { char: '.', emoji: '' },
  { char: 'E', emoji: '😠', full: 'Enemies' },
  { char: '.', emoji: '' },
  { char: 'S', emoji: '👫🏼', full: 'Siblings' },
];

const letterContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
};

export function AnimatedHeader({ shouldAnimate, stage }: AnimatedHeaderProps) {
  const [hoveredLetterIndex, setHoveredLetterIndex] = useState<number | null>(null);

  return (
    <motion.div
      className="mb-8 text-center"
      initial={shouldAnimate ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
      animate={{
        opacity: 1,
        y: stage === 'processing' ? -20 : 0,
        scale: stage === 'processing' ? 0.9 : 1,
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1 className="sr-only">FLAMES - Relationship Calculator</h1>

      <motion.div
        className="relative mb-6 flex items-center justify-center"
        variants={letterContainerVariants}
        initial={shouldAnimate && stage === 'input' ? 'hidden' : false}
        animate={shouldAnimate && stage === 'input' ? 'visible' : false}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          textShadow:
            shouldAnimate && stage === 'input'
              ? '0 0 20px rgba(var(--color-primary-rgb), 0.3), 0 0 40px rgba(var(--color-primary-rgb), 0.6), 0 0 20px rgba(var(--color-primary-rgb), 0.3)'
              : 'none',
        }}
      >
        {flamesLetters.map((item, index) => (
          <motion.div
            key={index}
            variants={letterVariants}
            className={`text-primary relative text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl ${
              item.char !== '.' ? 'cursor-pointer p-1 md:p-2' : ''
            }`}
            onHoverStart={() => item.char !== '.' && shouldAnimate && setHoveredLetterIndex(index)}
            onHoverEnd={() => item.char !== '.' && shouldAnimate && setHoveredLetterIndex(null)}
            whileHover={shouldAnimate && item.char !== '.' ? { scale: 1.1, y: -5 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {item.char}
            <AnimatePresence>
              {shouldAnimate && hoveredLetterIndex === index && item.emoji && (
                <motion.div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl md:text-4xl"
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.5, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  {item.emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        className="text-on-surface-variant text-xl font-medium md:text-2xl"
        animate={
          shouldAnimate && stage === 'input'
            ? {
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.02, 1],
              }
            : { opacity: 1 }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        Discover your relationship destiny ✨
      </motion.p>

      {shouldAnimate && stage === 'input' && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${30 + i * 20}%`,
                top: `${10 + i * 5}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2 + i,
                delay: i * 0.5,
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
}

export default AnimatedHeader;
