import { motion } from 'framer-motion';
import { useState } from 'react';
import type { LetterTileProps } from '../types';

export default function LetterTile({ letter, index, nameIndex, mode, className = '' }: LetterTileProps) {
  const [isCrossed, setIsCrossed] = useState(false);

  const handleClick = () => {
    setIsCrossed(!isCrossed);
  };

  const getTileStyle = () => {
    if (mode === 'chalkboard') {
      return {
        base: `bg-slate-700/50 border border-white/30 text-white hover:bg-slate-600/50`,
        crossed: `bg-red-900/50 border-red-400/50 text-red-300`,
      };
    } else {
      return {
        base: `bg-white border border-gray-300 text-gray-800 hover:bg-gray-50`,
        crossed: `bg-red-100 border-red-300 text-red-600`,
      };
    }
  };

  const styles = getTileStyle();

  return (
    <motion.button
      onClick={handleClick}
      className={`relative h-12 w-12 rounded-lg text-lg font-bold transition-all duration-200 ${isCrossed ? styles.crossed : styles.base} ${className} `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {letter.toUpperCase()}

      {/* Cross-out effect */}
      {isCrossed && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`h-0.5 w-full origin-center rotate-45 transform ${
              mode === 'chalkboard' ? 'bg-red-400' : 'bg-red-500'
            }`}
          />
          <div
            className={`absolute h-0.5 w-full origin-center -rotate-45 transform ${
              mode === 'chalkboard' ? 'bg-red-400' : 'bg-red-500'
            }`}
          />
        </motion.div>
      )}

      {/* Hover effect overlay */}
      <div
        className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
          mode === 'chalkboard' ? 'bg-white/0 hover:bg-white/10' : 'bg-black/0 hover:bg-black/5'
        }`}
      />
    </motion.button>
  );
}
