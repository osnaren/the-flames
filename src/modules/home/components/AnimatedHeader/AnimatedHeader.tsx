import { useGameIntegration } from '@/hooks/useGameIntegration';
import type { SeasonalTheme } from '@/themes/seasonal/types';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState, type CSSProperties } from 'react';
import { FLAMES_LETTERS } from '../../constants';
import type { GameStage } from '../../types';

interface AnimatedHeaderProps {
  shouldAnimate: boolean;
  stage: GameStage;
}

/** Positions and timing for the five hero floaters; the emoji changes per season. */
const FLOATER_SLOTS = [
  { left: '2%', top: '6%', duration: 4.2, delay: 0 },
  { left: '91%', top: '2%', duration: 3.6, delay: -1.2 },
  { left: '94%', top: '44%', duration: 4.8, delay: -2.1 },
  { left: '0%', top: '50%', duration: 5.2, delay: -0.6 },
  { left: '86%', top: '22%', duration: 4.4, delay: -3 },
] as const;

const HERO_FLOATERS: Record<SeasonalTheme, readonly [string, string, string, string, string]> = {
  default: ['💖', '✨', '💕', '💫', '💝'],
  valentine: ['💘', '🌹', '💌', '💗', '🍫'],
  halloween: ['🎃', '🦇', '👻', '🕸️', '🍬'],
  christmas: ['🎄', '❄️', '🎁', '⛄', '🔔'],
  newYear: ['🎆', '🥂', '🎉', '🎇', '🕛'],
  diwali: ['🪔', '🎆', '✨', '🌼', '🎇'],
  holi: ['🎨', '💦', '🌈', '🟣', '🟡'],
  onam: ['🌼', '🛶', '🌺', '🍌', '🪷'],
  pongal: ['🌾', '☀️', '🍚', '🐄', '🪁'],
  lunarNewYear: ['🏮', '🧧', '🐉', '🍊', '🧨'],
  eid: ['🌙', '⭐', '🕌', '🏮', '✨'],
  rakhi: ['🪢', '🍬', '🌼', '🎁', '💛'],
  friendship: ['🤝', '🎈', '🫶', '🌻', '🍦'],
  spring: ['🌸', '🦋', '🌷', '🐝', '🌱'],
  monsoon: ['☔', '💧', '🌧️', '🐸', '⛵'],
  autumn: ['🍁', '🍂', '🌰', '🍄', '☕'],
};

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
  const { currentTheme } = useSeasonalTheme();
  const floaterEmojis = HERO_FLOATERS[currentTheme] ?? HERO_FLOATERS.default;
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
                    className="pointer-events-none absolute -top-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/75 py-1 pr-3 pl-1.5 whitespace-nowrap text-white shadow-lg md:-top-5 lg:-top-2"
                    initial={{ opacity: 0, y: 6, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.6, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  >
                    <span className="text-xl leading-none">{item.emoji}</span>
                    <span className="text-xs font-semibold">{item.full}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      <h1 className="font-heading text-on-surface mb-2 text-xl font-bold md:text-2xl">
        FLAMES Calculator — Play the FLAMES Game Online
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
          {FLOATER_SLOTS.map((floater, index) => (
            <span
              key={`${currentTheme}-${index}`}
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
              {floaterEmojis[index]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export const AnimatedHeader = memo(AnimatedHeaderComponent);

export default AnimatedHeader;
