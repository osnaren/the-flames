import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useCallback } from 'react';

interface NameTilesProps {
  name1: string;
  name2: string;
  commonLetters: string[];
  shouldAnimate: boolean;
}

/**
 * Component for displaying name comparison with highlighted common letters
 */
export function NameTiles({ name1, name2, commonLetters, shouldAnimate }: NameTilesProps) {
  // Memoized letter renderer to prevent unnecessary re-renders
  const renderLetter = useCallback(
    (letter: string, isCommon: boolean, index: number) => (
      <motion.span
        key={`${letter}-${index}`}
        className={`mx-0.5 inline-block rounded px-2 py-1 ${
          isCommon
            ? 'bg-error-container/50 text-on-error-container dark:bg-error-container/30 dark:text-on-error-container/80 line-through'
            : 'bg-primary-container/60 text-on-primary-container dark:bg-primary-container/30 dark:text-on-primary-container/90'
        }`}
        initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: shouldAnimate ? 0.3 + index * 0.05 : 0,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        {letter}
      </motion.span>
    ),
    [shouldAnimate]
  );

  return (
    <motion.div
      className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4"
      initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: shouldAnimate ? 0.1 : 0 }}
    >
      <div className="flex-1 text-center">
        <motion.p
          className="text-on-surface-variant dark:text-on-surface-variant mb-3 text-sm font-medium"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldAnimate ? 0.2 : 0 }}
        >
          {name1}
        </motion.p>
        <div className="flex min-h-[2.5rem] flex-wrap justify-center">
          {[...name1.toLowerCase()].map((letter, i) => renderLetter(letter, commonLetters.includes(letter), i))}
        </div>
      </div>

      <div className="mx-2 flex justify-center">
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
          <Flame className="text-primary dark:text-primary h-10 w-10 animate-pulse" role="presentation" />
        </motion.div>
      </div>

      <div className="flex-1 text-center">
        <motion.p
          className="text-on-surface-variant dark:text-on-surface-variant mb-3 text-sm font-medium"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldAnimate ? 0.2 : 0 }}
        >
          {name2}
        </motion.p>
        <div className="flex min-h-[2.5rem] flex-wrap justify-center">
          {[...name2.toLowerCase()].map((letter, i) => renderLetter(letter, commonLetters.includes(letter), i))}
        </div>
      </div>
    </motion.div>
  );
}

export default NameTiles;
