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
        className={`mx-1 inline-block rounded px-2 py-1 ${
          isCommon
            ? 'bg-red-100 text-red-500 line-through dark:bg-red-950 dark:text-red-400'
            : 'bg-orange-100 dark:bg-orange-950 dark:text-orange-300'
        }`}
        initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldAnimate ? index * 0.1 : 0 }}
      >
        {letter}
      </motion.span>
    ),
    [shouldAnimate]
  );

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex-1 text-center">
        <motion.p
          className="mb-2 text-sm text-gray-700 dark:text-gray-300"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {name1}
        </motion.p>
        <div className="flex flex-wrap justify-center">
          {[...name1.toLowerCase()].map((letter, i) => renderLetter(letter, commonLetters.includes(letter), i))}
        </div>
      </div>

      <div className="mx-4 flex justify-center">
        <Flame className="h-8 w-8 animate-pulse text-orange-500 dark:text-orange-400" role="presentation" />
      </div>

      <div className="flex-1 text-center">
        <motion.p
          className="mb-2 text-sm text-gray-700 dark:text-gray-300"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {name2}
        </motion.p>
        <div className="flex flex-wrap justify-center">
          {[...name2.toLowerCase()].map((letter, i) => renderLetter(letter, commonLetters.includes(letter), i))}
        </div>
      </div>
    </div>
  );
}

export default NameTiles;
