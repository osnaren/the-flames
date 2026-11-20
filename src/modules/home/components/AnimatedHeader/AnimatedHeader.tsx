import { useGameIntegration } from '@/hooks/useGameIntegration';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState, type CSSProperties } from 'react';
import { FLAMES_LETTERS } from '../../constants';
import type { GameStage } from '../../types';

interface AnimatedHeaderProps {
  shouldAnimate: boolean;
  stage: GameStage;
}

const FLOATERS = [
  { emoji: '💖', left: '2%', top: '6%', duration: 4.2, delay: 0 },
  { emoji: '✨', left: '91%', top: '2%', duration: 3.6, delay: -1.2 },
  { emoji: '💕', left: '94%', top: '44%', duration: 4.8, delay: -2.1 },
  { emoji: '💫', left: '0%', top: '50%', duration: 5.2, delay: -0.6 },
  { emoji: '💝', left: '86%', top: '22%', duration: 4.4, delay: -3 },
] as const;

/**
 * The FLAMES wordmark.
 *
 * Entrance and idle motion are CSS keyframes on transform/opacity, so they start
 * with the very first paint (before hydration) and run on the compositor. The
 * letters are never transparent, which keeps them out of the LCP critical path.
 */
function AnimatedHeaderComponent({ shouldAnimate, stage }: AnimatedHeaderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { sound } = useGameIntegration();
  const isCompact = stage === 'processing' || stage === 'result';

  return (
    <div
      role="group"
      aria-label="FLAMES title"
      className="font-handwriting relative mb-6 origin-top text-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:mb-10"
      style={{ transform: isCompact ? 'scale(0.85)' : undefined }}
    >
      {/* Main FLAMES Title */}
      <div className="relative mb-3 flex items-center justify-center gap-1 md:mb-4 md:gap-2">
        {FLAMES_LETTERS.map((item, index) => (
          <div
            key={item.char}
            className="motion-letter-pop relative"
            style={{ '--letter-delay': `${0.08 + index * 0.07}s` } as CSSProperties}
          >
            <motion.div
              className="relative cursor-default select-none"
              onHoverStart={() => {
                if (!shouldAnimate) return;
                sound.playSound('hover');
                setHoveredIndex(index);
              }}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={shouldAnimate ? { scale: 1.15, y: -8, rotate: index % 2 ? 4 : -4 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <span
                className={`relative inline-block bg-linear-to-br ${item.color} bg-clip-text text-5xl font-black text-transparent drop-shadow-lg md:text-6xl lg:text-7xl xl:text-8xl`}
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {item.char}
              </span>

              {/* Emoji tooltip on hover (pointer devices only) */}
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
                    <span className="mt-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-white">
                      {item.full}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      <h1 className="font-heading text-on-surface mb-2 text-xl font-bold md:text-2xl">
        FLAMES Calculator — Play the Name Game
      </h1>

      {/* Subtitle */}
      <p
        className="font-heading text-on-surface-variant mx-auto max-w-md text-lg font-medium transition-opacity duration-500 md:text-xl lg:text-2xl"
        style={{ opacity: isCompact ? 0.7 : 1 }}
      >
        <span className="inline-block">Discover your relationship destiny</span>
        <span className={`ml-2 inline-block ${shouldAnimate && !isCompact ? 'motion-wiggle' : ''}`} aria-hidden="true">
          ✨
        </span>
      </p>

      {/* Floating decorative elements */}
      {shouldAnimate && !isCompact && (
        <div
          className="motion-rise pointer-events-none absolute -inset-x-2 inset-y-0 overflow-hidden"
          style={{ '--rise-distance': '0px' } as CSSProperties}
          aria-hidden="true"
        >
          {FLOATERS.map((floater) => (
            <span
              key={floater.emoji}
              className="motion-float absolute text-xl opacity-60 md:text-2xl"
              style={
                {
                  left: floater.left,
                  top: floater.top,
                  '--float-duration': `${floater.duration}s`,
                  '--float-delay': `${floater.delay}s`,
                  '--float-distance': '-14px',
                } as CSSProperties
              }
            >
              {floater.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export const AnimatedHeader = memo(AnimatedHeaderComponent);

export default AnimatedHeader;
