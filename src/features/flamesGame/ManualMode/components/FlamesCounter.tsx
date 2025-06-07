import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FlamesResult } from '../../flames.types';
import { getResultData } from '../../resultData';

interface FlamesCounterProps {
  remainingLetters: number;
  onResult: (result: FlamesResult) => void;
}

export default function FlamesCounter({ remainingLetters, onResult }: FlamesCounterProps) {
  const [flames, setFlames] = useState(['F', 'L', 'A', 'M', 'E', 'S']);
  const [currentCount, setCurrentCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleLetterClick = (letter: string, index: number) => {
    if (isAnimating || flames.length === 1) return;

    setIsAnimating(true);
    let count = currentCount;
    let step = currentStep;

    const interval = setInterval(() => {
      count = (count + 1) % flames.length;
      setCurrentCount(count);

      if (count === index) {
        clearInterval(interval);
        setIsAnimating(false);
        setCurrentCount(0);
        setCurrentStep(step + 1);

        // Remove the letter
        setFlames((prev) => prev.filter((_, i) => i !== index));

        // If only one letter remains, it's the result
        if (flames.length === 2) {
          const result = flames.filter((_, i) => i !== index)[0] as FlamesResult;
          onResult(result);
        }
      }
    }, 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Strike out FLAMES</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">{remainingLetters} letters remaining</div>
      </div>

      <div className="flex justify-center gap-4">
        <AnimatePresence>
          {flames.map((letter, index) => {
            const isCurrentLetter = isAnimating && index === currentCount;

            return (
              <motion.button
                key={`${letter}-${index}`}
                className={`font-handwriting relative flex h-12 w-12 items-center justify-center rounded-lg text-xl ${
                  isAnimating && index === currentCount
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleLetterClick(letter, index)}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                {letter}
                {isCurrentLetter && (
                  <motion.div
                    className="absolute -top-6 text-sm font-medium text-orange-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {`${currentStep}.${currentCount + 1}`}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {flames.length === 1 && (
        <motion.div className="mt-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-2xl font-semibold text-gray-800 dark:text-white">
            {getResultData(flames[0] as FlamesResult).text}
          </div>
          <div className="mt-2 text-gray-600 dark:text-gray-400">{getResultData(flames[0] as FlamesResult).quote}</div>
        </motion.div>
      )}
    </div>
  );
}
