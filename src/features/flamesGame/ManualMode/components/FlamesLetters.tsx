import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FlamesLettersProps } from '../types';

const FLAMES_LETTERS = [
  { letter: 'F', meaning: 'Friends', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { letter: 'L', meaning: 'Love', color: 'text-red-500', bgColor: 'bg-red-100' },
  { letter: 'A', meaning: 'Affection', color: 'text-pink-500', bgColor: 'bg-pink-100' },
  { letter: 'M', meaning: 'Marriage', color: 'text-purple-500', bgColor: 'bg-purple-100' },
  { letter: 'E', meaning: 'Enemies', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { letter: 'S', meaning: 'Siblings', color: 'text-green-500', bgColor: 'bg-green-100' },
];

export default function FlamesLetters({ mode, className = '' }: FlamesLettersProps) {
  const [crossedLetters, setCrossedLetters] = useState<Set<string>>(new Set());

  const handleLetterClick = (letter: string) => {
    setCrossedLetters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(letter)) {
        newSet.delete(letter);
      } else {
        newSet.add(letter);
      }
      return newSet;
    });
  };

  const getFlamesCardStyle = () => {
    if (mode === 'chalkboard') {
      return {
        container: 'bg-white/10 border border-white/20',
        title: 'text-white',
        subtitle: 'text-gray-300',
      };
    } else {
      return {
        container: 'bg-white/80 border border-gray-200',
        title: 'text-gray-800',
        subtitle: 'text-gray-600',
      };
    }
  };

  const getLetterStyle = (letter: string, colorClass: string, bgColorClass: string) => {
    const isCrossed = crossedLetters.has(letter);

    if (mode === 'chalkboard') {
      return {
        base: `bg-slate-700/50 border border-white/30 text-white hover:bg-slate-600/50`,
        crossed: `bg-red-900/50 border-red-400/50 text-red-300`,
        meaning: 'text-gray-300',
      };
    } else {
      return {
        base: `${bgColorClass} border border-gray-300 ${colorClass} hover:opacity-80`,
        crossed: `bg-red-100 border-red-300 text-red-600`,
        meaning: 'text-gray-600',
      };
    }
  };

  const styles = getFlamesCardStyle();

  return (
    <div className={`rounded-xl p-6 ${styles.container} ${className}`}>
      <div className="mb-6 text-center">
        <h3 className={`mb-2 text-2xl font-bold ${styles.title}`}>F.L.A.M.E.S</h3>
        <p className={`text-sm ${styles.subtitle}`}>Click letters to cross them out as you count</p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
        {FLAMES_LETTERS.map((flame, index) => {
          const isCrossed = crossedLetters.has(flame.letter);
          const letterStyles = getLetterStyle(flame.letter, flame.color, flame.bgColor);

          return (
            <motion.button
              key={flame.letter}
              onClick={() => handleLetterClick(flame.letter)}
              className={`relative rounded-lg p-4 text-center font-bold transition-all duration-200 ${isCrossed ? letterStyles.crossed : letterStyles.base} `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-1 text-2xl">{flame.letter}</div>
              <div className={`text-xs ${letterStyles.meaning}`}>{flame.meaning}</div>

              {/* Cross-out effect */}
              {isCrossed && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`h-1 w-full origin-center rotate-45 transform ${
                      mode === 'chalkboard' ? 'bg-red-400' : 'bg-red-500'
                    }`}
                  />
                  <div
                    className={`absolute h-1 w-full origin-center -rotate-45 transform ${
                      mode === 'chalkboard' ? 'bg-red-400' : 'bg-red-500'
                    }`}
                  />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className={`text-xs ${styles.subtitle}`}>
          💡 Count the remaining letters after crossing out common ones, then use this count to eliminate letters in
          F.L.A.M.E.S
        </p>
      </div>

      {/* Result hint */}
      {crossedLetters.size > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
          <div
            className={`inline-block rounded-full px-4 py-2 text-sm ${
              mode === 'chalkboard' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {crossedLetters.size} letter(s) crossed out
          </div>
        </motion.div>
      )}
    </div>
  );
}
