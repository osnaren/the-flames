import { motion } from 'framer-motion';

interface LetterGridProps {
  name1: string;
  name2: string;
  crossedLetters: string[];
  onLetterClick: (letter: string, nameIndex: number, position: number) => void;
  isChalkboard?: boolean;
}

interface LetterPosition {
  letter: string;
  position: number;
  isCrossed: boolean;
}

export default function LetterGrid({
  name1,
  name2,
  crossedLetters,
  onLetterClick,
  isChalkboard = false,
}: LetterGridProps) {
  const renderLetter = (letter: string, position: number, nameIndex: number) => {
    const key = `${nameIndex}-${position}-${letter}`;
    const isCrossed = crossedLetters.includes(`${nameIndex}-${position}-${letter.toLowerCase()}`);

    return (
      <motion.button
        key={key}
        className={`font-handwriting relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-xl transition-all duration-200 ${
          isCrossed
            ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => onLetterClick(letter.toLowerCase(), nameIndex, position)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {letter}
        {isCrossed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-0.5 w-full origin-center rotate-45 transform bg-red-500 dark:bg-red-400" />
          </motion.div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">Name 1:</div>
        <div className="flex flex-wrap gap-2">
          {[...name1.toLowerCase()].map((letter, position) => renderLetter(letter, position, 1))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">Name 2:</div>
        <div className="flex flex-wrap gap-2">
          {[...name2.toLowerCase()].map((letter, position) => renderLetter(letter, position, 2))}
        </div>
      </div>
    </div>
  );
}
