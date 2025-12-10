import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FlamesLettersProps } from '../types';

export default function FlamesLetters({
  crossedLetters = new Set(),
  onLetterToggle,
  className = '',
  userResult = null,
  correctResult = null,
}: FlamesLettersProps) {
  const [showResultCelebration, setShowResultCelebration] = useState(false);

  const flamesData = [
    { letter: 'F', meaning: 'Friends', icon: '🤝🏼', color: 'friendship' },
    { letter: 'L', meaning: 'Love', icon: '💕', color: 'love' },
    { letter: 'A', meaning: 'Affection', icon: '🥰', color: 'affection' },
    { letter: 'M', meaning: 'Marriage', icon: '💍', color: 'marriage' },
    { letter: 'E', meaning: 'Enemies', icon: '⚔️', color: 'enemy' },
    { letter: 'S', meaning: 'Siblings', icon: '👫🏼', color: 'siblings' },
  ];

  // Handle special celebration when user reaches the final result
  useEffect(() => {
    if (userResult) {
      setShowResultCelebration(true);
      const timer = setTimeout(() => setShowResultCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [userResult]);

  // Status tracking for each FLAMES letter
  const getLetterStatus = (letter: string) => {
    if (userResult === letter) return 'final-result';
    if (crossedLetters.has(letter)) return 'crossed-out';
    return 'active';
  };

  const getStatusColors = (letter: string, status: string) => {
    if (status === 'final-result') {
      return {
        container: 'bg-primary border-primary ring-4 ring-primary/30 shadow-2xl',
        text: 'text-on-primary',
        meaning: 'text-on-primary/90',
        icon: 'text-on-primary',
      };
    }

    if (status === 'crossed-out') {
      return {
        container: 'bg-error-container/50 border-outline opacity-50',
        text: 'text-on-error-container line-through',
        meaning: 'text-on-error-container/70 line-through',
        icon: 'text-on-error-container opacity-50',
      };
    }

    const flameData = flamesData.find((f) => f.letter === letter);
    if (flameData) {
      return {
        container: cn(
          `bg-${flameData.color}-container/30 border-${flameData.color}-container hover:bg-${flameData.color}-container/40`
        ),
        text: `text-on-${flameData.color}-container`,
        meaning: `text-on-${flameData.color}-container/80`,
        icon: `text-${flameData.color}`,
      };
    }

    return {
      container: 'bg-surface-container border-outline hover:bg-surface-container/80',
      text: 'text-on-surface',
      meaning: 'text-on-surface-variant',
      icon: 'text-on-surface',
    };
  };

  const resultValidation = useMemo(() => {
    if (!userResult || !correctResult) return null;

    const isCorrect = userResult === correctResult;
    return {
      isCorrect,
      message: isCorrect
        ? `🎉 Correct! You got it!`
        : `Not quite right. The correct answer is ${correctResult}. Check again!`,
      bgColor: isCorrect ? 'bg-primary-container/20' : 'bg-error-container/20',
      textColor: isCorrect ? 'text-primary' : 'text-error',
      borderColor: isCorrect ? 'border-primary-container' : 'border-error-container',
    };
  }, [userResult, correctResult]);

  return (
    <div className={`relative ${className}`} role="group" aria-label="FLAMES letter selection">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" role="list">
        {flamesData.map((flame, index) => {
          const status = getLetterStatus(flame.letter);
          const colors = getStatusColors(flame.letter, status);
          const isFinalResult = status === 'final-result';

          return (
            <motion.button
              key={flame.letter}
              onClick={() => onLetterToggle?.(flame.letter)}
              aria-label={`${flame.meaning} (${flame.letter}): ${status === 'crossed-out' ? 'Crossed out' : status === 'final-result' ? 'Final result' : 'Active - Click to cross out'}`}
              aria-pressed={status === 'crossed-out'}
              disabled={isFinalResult}
              className={cn(
                'relative overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-300',
                'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
                colors.container,
                isFinalResult ? 'z-10 scale-110' : 'hover:scale-105',
                onLetterToggle ? 'cursor-pointer' : 'cursor-default'
              )}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isFinalResult ? 1.1 : 1,
                rotate: isFinalResult && showResultCelebration ? [0, -5, 5, 0] : 0,
              }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 20,
                rotate: {
                  duration: 0.5,
                  repeat: showResultCelebration ? 3 : 0,
                },
              }}
              whileHover={onLetterToggle && !isFinalResult ? { scale: 1.05, y: -2 } : {}}
              whileTap={onLetterToggle && !isFinalResult ? { scale: 0.95 } : {}}
            >
              {isFinalResult && (
                <motion.div
                  className="from-primary/20 via-primary/30 to-primary/20 absolute inset-0 rounded-2xl bg-linear-to-r"
                  animate={{
                    opacity: showResultCelebration ? [0.3, 0.7, 0.3] : 0.3,
                  }}
                  transition={{
                    duration: 1,
                    repeat: showResultCelebration ? Infinity : 0,
                  }}
                />
              )}

              {isFinalResult && (
                <motion.div
                  className="absolute -top-2 -right-2 z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.2 }}
                >
                  <Crown className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </motion.div>
              )}

              <div className={cn('mb-2 text-3xl font-bold', colors.text)} aria-hidden="true">
                {flame.letter}
              </div>
              <div className={cn('mb-2 text-2xl', colors.icon)} aria-hidden="true" role="img">
                {flame.icon}
              </div>
              <div className={cn('text-sm font-medium', colors.meaning)}>{flame.meaning}</div>

              {status === 'crossed-out' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <div className="bg-error h-1 w-full rotate-45 rounded-full" />
                  <div className="bg-error absolute h-1 w-full -rotate-45 rounded-full" />
                </motion.div>
              )}

              {isFinalResult && showResultCelebration && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: `${15 + (i % 2) * 30}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {resultValidation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-xl border p-4 text-center ${resultValidation.bgColor} ${resultValidation.borderColor} ${resultValidation.textColor}`}
        >
          <p className="font-medium">{resultValidation.message}</p>
        </motion.div>
      )}

      <div className="mt-6 text-center">
        <div className="bg-surface-container/50 inline-flex items-center space-x-2 rounded-full px-4 py-2">
          <span className="text-on-surface-variant text-sm">Progress: {crossedLetters.size}/6 letters crossed</span>
          <div className="bg-surface-variant h-2 w-16 overflow-hidden rounded-full">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(crossedLetters.size / 6) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
