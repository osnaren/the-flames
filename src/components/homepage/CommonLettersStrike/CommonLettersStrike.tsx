import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface CommonLettersStrikeProps {
  name1: string;
  name2: string;
  commonLetters: string[];
  onComplete: () => void;
  isVisible: boolean;
}

interface LetterState {
  letter: string;
  isCommon: boolean;
  isStruck: boolean;
  position: { x: number; y: number };
}

/**
 * Component for elegantly striking off common letters between two names
 * Features smooth animations and visual feedback
 */
export function CommonLettersStrike({ name1, name2, commonLetters, onComplete, isVisible }: CommonLettersStrikeProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const [name1Letters, setName1Letters] = useState<LetterState[]>([]);
  const [name2Letters, setName2Letters] = useState<LetterState[]>([]);
  const [currentStrikeIndex, setCurrentStrikeIndex] = useState(0);
  const [isStriking, setIsStriking] = useState(false);

  // Initialize letter states
  useEffect(() => {
    if (!isVisible) return;

    const commonSet = new Set(commonLetters.map((l) => l.toLowerCase()));

    const letters1 = name1.split('').map((letter, index) => ({
      letter,
      isCommon: commonSet.has(letter.toLowerCase()),
      isStruck: false,
      position: { x: index * 40, y: 0 },
    }));

    const letters2 = name2.split('').map((letter, index) => ({
      letter,
      isCommon: commonSet.has(letter.toLowerCase()),
      isStruck: false,
      position: { x: index * 40, y: 0 },
    }));

    setName1Letters(letters1);
    setName2Letters(letters2);
    setCurrentStrikeIndex(0);
    setIsStriking(false);
  }, [name1, name2, commonLetters, isVisible]);

  // Start striking animation
  const startStriking = useCallback(() => {
    if (!shouldAnimate) {
      // Instantly mark all common letters as struck
      setName1Letters((prev) => prev.map((l) => ({ ...l, isStruck: l.isCommon })));
      setName2Letters((prev) => prev.map((l) => ({ ...l, isStruck: l.isCommon })));
      setTimeout(onComplete, 100);
      return;
    }

    setIsStriking(true);

    // Strike letters one by one
    const allCommonLetters = [...commonLetters];
    let strikeIndex = 0;

    const strikeNext = () => {
      if (strikeIndex >= allCommonLetters.length) {
        setTimeout(onComplete, 500);
        return;
      }

      const letterToStrike = allCommonLetters[strikeIndex].toLowerCase();

      // Strike in name1
      setName1Letters((prev) =>
        prev.map((l) => (l.letter.toLowerCase() === letterToStrike && !l.isStruck ? { ...l, isStruck: true } : l))
      );

      // Strike in name2
      setName2Letters((prev) =>
        prev.map((l) => (l.letter.toLowerCase() === letterToStrike && !l.isStruck ? { ...l, isStruck: true } : l))
      );

      setCurrentStrikeIndex(strikeIndex);
      strikeIndex++;

      setTimeout(strikeNext, 800);
    };

    setTimeout(strikeNext, 1000);
  }, [commonLetters, shouldAnimate, onComplete]);

  // Auto-start striking when component becomes visible
  useEffect(() => {
    if (isVisible && name1Letters.length > 0 && name2Letters.length > 0) {
      const timer = setTimeout(startStriking, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, name1Letters.length, name2Letters.length, startStriking]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="space-y-8 p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-on-surface dark:text-on-surface mb-2 text-xl font-bold">Striking Common Letters</h3>
        <p className="text-on-surface-variant dark:text-on-surface-variant text-sm">
          Removing matching letters from both names...
        </p>
      </motion.div>

      {/* Names display */}
      <div className="space-y-6">
        {/* Name 1 */}
        <NameDisplay name={name1} letters={name1Letters} label="First Name" shouldAnimate={shouldAnimate} />

        {/* Striking indicator */}
        <motion.div
          className="flex justify-center"
          animate={isStriking && shouldAnimate ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: isStriking ? Infinity : 0 }}
        >
          <div className="bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-medium">
            ⚡ Striking common letters...
          </div>
        </motion.div>

        {/* Name 2 */}
        <NameDisplay name={name2} letters={name2Letters} label="Second Name" shouldAnimate={shouldAnimate} />
      </div>

      {/* Progress indicator */}
      {commonLetters.length > 0 && (
        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="bg-surface-container dark:bg-surface-container-high rounded-lg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-on-surface dark:text-on-surface text-sm font-medium">Progress</span>
              <span className="text-on-surface-variant dark:text-on-surface-variant text-sm">
                {currentStrikeIndex} / {commonLetters.length}
              </span>
            </div>
            <div className="bg-outline/20 h-2 w-full rounded-full">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: `${(currentStrikeIndex / commonLetters.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Individual name display component
function NameDisplay({
  name,
  letters,
  label,
  shouldAnimate,
}: {
  name: string;
  letters: LetterState[];
  label: string;
  shouldAnimate: boolean;
}) {
  return (
    <div className="text-center">
      <h4 className="text-on-surface-variant dark:text-on-surface-variant mb-3 text-sm font-medium">{label}</h4>
      <div className="flex min-h-[60px] items-center justify-center space-x-2">
        <AnimatePresence>
          {letters.map((letterState, index) => (
            <motion.div
              key={`${letterState.letter}-${index}`}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${
                  letterState.isCommon
                    ? letterState.isStruck
                      ? 'bg-error/20 text-error border-error/50 border-2'
                      : 'bg-warning/20 text-warning border-warning/50 border-2'
                    : 'bg-surface-container dark:bg-surface-container-high text-on-surface dark:text-on-surface border-outline/20 border-2'
                } `}
                animate={
                  letterState.isStruck && shouldAnimate
                    ? {
                        scale: [1, 1.2, 0.9, 1],
                        rotate: [0, -10, 10, 0],
                      }
                    : letterState.isCommon && !letterState.isStruck
                      ? {
                          boxShadow: [
                            '0 0 0 0 rgba(var(--color-warning-rgb), 0)',
                            '0 0 0 8px rgba(var(--color-warning-rgb), 0.2)',
                            '0 0 0 0 rgba(var(--color-warning-rgb), 0)',
                          ],
                        }
                      : {}
                }
                transition={{
                  duration: letterState.isStruck ? 0.6 : 2,
                  repeat: letterState.isCommon && !letterState.isStruck ? Infinity : 0,
                }}
              >
                {letterState.letter.toUpperCase()}

                {/* Strike-through effect */}
                {letterState.isStruck && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="bg-error h-0.5 w-full rotate-45 transform" />
                    <div className="bg-error absolute h-0.5 w-full -rotate-45 transform" />
                  </motion.div>
                )}
              </motion.div>

              {/* Particle effect when struck */}
              {letterState.isStruck && shouldAnimate && (
                <AnimatePresence>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-error absolute h-1 w-1 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{
                        opacity: 0,
                        scale: 0,
                        x: (Math.random() - 0.5) * 60,
                        y: (Math.random() - 0.5) * 60,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: Math.random() * 0.2,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
