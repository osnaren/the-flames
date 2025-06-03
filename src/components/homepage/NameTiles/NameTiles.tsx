import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface NameTilesProps {
  name1: string;
  name2: string;
  commonLetters: string[];
  shouldAnimate: boolean;
}

/**
 * Displays two names, highlighting common letters and animating their appearance.
 * Common letters undergo a secondary animation to a "processed" state.
 */
export function NameTiles({ name1, name2, commonLetters, shouldAnimate }: NameTilesProps) {
  const [revealProcessedEffect, setRevealProcessedEffect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (shouldAnimate) {
      // Delay for the "processed" effect, allowing initial letter animations to complete.
      timer = setTimeout(() => {
        setRevealProcessedEffect(true);
      }, 1500); // Adjusted delay
    } else {
      setRevealProcessedEffect(false); // Reset if not animating
    }
    return () => clearTimeout(timer);
  }, [shouldAnimate]);

  // Memoized letter renderer with distinct "initial" and "processed" states for common letters.
  const renderLetter = useCallback(
    (letter: string, isCommon: boolean, index: number, nameIdentifier: string) => {
      const commonLetterIndex = commonLetters.indexOf(letter);

      const letterVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: shouldAnimate ? 0.3 + index * 0.05 : 0,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          },
        },
        processed: {
          // State for common letters after the initial highlight
          opacity: 0.65,
          scale: 0.95,
          transition: {
            delay: 0.1 + (commonLetterIndex !== -1 ? commonLetterIndex * 0.12 : 0),
            duration: 0.4,
            ease: 'easeOut',
          },
        },
      };

      let currentAnimationState = 'visible';
      if (isCommon && revealProcessedEffect) {
        currentAnimationState = 'processed';
      }

      // Base classes + conditional classes for background/text color.
      // CSS transitions handle the color change.
      let tileClasses = `
        mx-0.5 inline-block rounded px-2 py-1 relative min-w-[32px]
        transition-colors duration-300 ease-out text-center
      `;
      if (isCommon) {
        tileClasses += revealProcessedEffect
          ? ' bg-surface-variant text-on-surface-variant' // Muted style for processed common letters
          : ' bg-error-container text-on-error-container'; // Highlighted style
      } else {
        tileClasses += ' bg-primary-container text-on-primary-container';
      }

      return (
        <motion.div
          key={`${nameIdentifier}-${letter}-${index}`} // Unique key using nameIdentifier
          className={tileClasses}
          variants={letterVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate={currentAnimationState}
        >
          {letter}
        </motion.div>
      );
    },
    [shouldAnimate, revealProcessedEffect, commonLetters]
  );

  return (
    <motion.div
      className="flex flex-col md:flex-row md:items-center md:justify-between"
      initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: shouldAnimate ? 0.1 : 0 }}
    >
      <div className="flex-1 text-center">
        <motion.p
          className="text-on-surface-variant mb-3 text-sm font-medium"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldAnimate ? 0.2 : 0 }}
        >
          {name1}
        </motion.p>
        <div className="flex min-h-[2.5rem] flex-wrap justify-center">
          {[...name1.toLowerCase()].map((letter, i) =>
            renderLetter(letter, commonLetters.includes(letter), i, 'name1')
          )}
        </div>
      </div>

      <div className="mx-2 flex justify-center py-4 md:py-0">
        <motion.div
          initial={shouldAnimate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: shouldAnimate ? 0.5 : 0,
          }}
        >
          <Flame className="text-primary h-10 w-10 animate-pulse" role="presentation" />
        </motion.div>
      </div>

      <div className="flex-1 text-center">
        <motion.p
          className="text-on-surface-variant mb-3 text-sm font-medium"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldAnimate ? 0.2 : 0 }}
        >
          {name2}
        </motion.p>
        <div className="flex min-h-[2.5rem] flex-wrap justify-center">
          {[...name2.toLowerCase()].map((letter, i) =>
            renderLetter(letter, commonLetters.includes(letter), i, 'name2')
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default NameTiles;
