import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Flame, Play, RefreshCcw, Sparkles, Target, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

interface Step3Props {
  remainingLettersCount: number;
}

// Enhanced FLAMES letter component
const FlamesLetter = ({
  letter,
  index,
  isHighlighted,
  isEliminated,
  isFinal,
  shouldAnimate,
}: {
  letter: string;
  index: number;
  isHighlighted: boolean;
  isEliminated: boolean;
  isFinal: boolean;
  shouldAnimate: boolean;
}) => {
  return (
    <motion.div
      key={`flames-${letter}-${index}`}
      layout
      initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
      animate={{
        opacity: isEliminated ? 0.3 : 1,
        scale: isHighlighted ? 1.2 : isFinal ? 1.15 : 1,
        filter: isHighlighted ? 'brightness(1.3) saturate(1.2)' : 'brightness(1)',
        rotateY: 0,
        // Enhanced final result animation
        ...(isFinal && {
          y: [0, -8, 0],
          boxShadow: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '0 20px 25px -5px rgba(249, 115, 22, 0.5)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          ],
          transition: {
            duration: 0.6,
            ease: 'easeInOut',
            repeat: isFinal ? Infinity : 0,
            repeatType: 'reverse',
          },
        }),
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }} // Adjusted for smoother spring physics
      exit={{ opacity: 0, scale: 0.5, rotateY: 90, transition: { duration: 0.4 } }}
      className={`group relative flex h-14 w-14 items-center justify-center rounded-xl font-mono text-xl font-bold shadow-lg transition-all duration-300 md:h-16 md:w-16 ${
        isFinal
          ? 'from-secondary via-primary-container to-tertiary text-on-secondary ring-primary/40 bg-gradient-to-br shadow-2xl ring-4'
          : isHighlighted
            ? 'bg-primary-container text-on-primary-container ring-primary/30 shadow-xl ring-4'
            : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-outline/20 border'
      }`}
      style={{ transformStyle: 'preserve-3d' }}
      whileHover={
        !isEliminated
          ? {
              scale: 1.1,
              rotateY: shouldAnimate ? 15 : 0,
              z: 10,
            }
          : {}
      }
    >
      {letter}

      {/* Elimination X mark with enhanced animation */}
      {isEliminated && (
        <motion.div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 300 }}
            className="relative"
          >
            <motion.svg
              className="text-error h-12 w-12 opacity-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                shouldAnimate
                  ? {
                      rotate: [0, 5, -5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: 2,
              }}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </motion.svg>

            {/* Strike effect particles */}
            {shouldAnimate && (
              <AnimatePresence>
                {Array.from({ length: 4 }).map((_, i) => (
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
                      x: (Math.random() - 0.5) * 40,
                      y: (Math.random() - 0.5) * 40,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1,
                      delay: Math.random() * 0.2,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Highlighting glow effect */}
      {isHighlighted && shouldAnimate && (
        <motion.div
          className="bg-primary/20 absolute inset-0 rounded-xl blur-sm"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Final result crown effect */}
      {isFinal && shouldAnimate && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Sparkles className="text-tertiary h-4 w-4" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Enhanced Step 3 component showing the FLAMES counting simulation with sophisticated animations
 */
export default function Step3FlamesSimulation({ remainingLettersCount }: Step3Props) {
  const { shouldAnimate } = useAnimationPreferences();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [flamesLetters, setFlamesLetters] = useState(['F', 'L', 'A', 'M', 'E', 'S']);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [eliminatedLetter, setEliminatedLetter] = useState<string | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [finalResult, setFinalResult] = useState<string | null>(null);

  // FLAMES counting animation (keeping existing logic)
  const startFlamesSimulation = async () => {
    if (isCounting) return;
    if (remainingLettersCount <= 0) {
      setStepMessage('The count must be greater than 0 to start the simulation.');
      return;
    }
    setIsCounting(true);
    setFinalResult(null);
    setEliminatedLetter(null);
    setHighlightedIndex(null);
    const currentFlames = ['F', 'L', 'A', 'M', 'E', 'S'];
    setFlamesLetters(currentFlames);
    let currentIndex = -1;

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    setStepMessage(`Starting with FLAMES and count ${remainingLettersCount}...`);
    await delay(1500);

    while (currentFlames.length > 1) {
      const count = remainingLettersCount;
      const positiveCount = Math.max(1, count);
      const steps = positiveCount % currentFlames.length;
      let targetIndex;

      if (steps === 0) {
        targetIndex = currentFlames.length - 1;
      } else {
        targetIndex = (currentIndex + steps) % currentFlames.length;
      }

      setStepMessage(`Counting ${positiveCount} steps...`);

      let animationIndex = currentIndex;
      for (let i = 1; i <= positiveCount; i++) {
        animationIndex = (animationIndex + 1) % currentFlames.length;
        setHighlightedIndex(animationIndex);
        await delay(200);
      }
      setHighlightedIndex(targetIndex);
      await delay(400);

      const letterToRemove = currentFlames[targetIndex];
      setEliminatedLetter(letterToRemove);
      setStepMessage(`Removing ${letterToRemove}...`);
      await delay(1200);

      currentFlames.splice(targetIndex, 1);
      setFlamesLetters([...currentFlames]);
      setEliminatedLetter(null);
      setHighlightedIndex(null);

      currentIndex = targetIndex - 1;
      if (currentIndex < 0 && currentFlames.length > 0) {
        currentIndex = currentFlames.length - 1;
      }

      if (currentFlames.length > 1) {
        setStepMessage(`Letters remaining: ${currentFlames.join(', ')}. Counting again...`);
        await delay(1500);
      }
    }

    setFinalResult(currentFlames[0]);
    setStepMessage(`The final result is ${currentFlames[0]}!`);
    setIsCounting(false);
  };

  const resetSimulation = () => {
    setIsCounting(false);
    setFinalResult(null);
    setEliminatedLetter(null);
    setHighlightedIndex(null);
    setFlamesLetters(['F', 'L', 'A', 'M', 'E', 'S']);
    setStepMessage('');
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative"
    >
      <Card className="relative overflow-hidden p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Background decorative elements */}
        {shouldAnimate && (
          <>
            <motion.div
              className="absolute top-6 right-8 opacity-5"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Target className="text-secondary h-14 w-14" />
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-6 opacity-5"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Zap className="text-primary h-12 w-12" />
            </motion.div>
          </>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          {/* Enhanced Header */}
          <motion.h2
            className="font-heading text-on-surface mb-8 flex items-center gap-3 text-2xl font-bold md:text-3xl"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span
              className="bg-secondary-container/20 text-secondary ring-secondary/20 flex h-10 w-10 items-center justify-center rounded-full ring-2 md:h-12 md:w-12"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              3
            </motion.span>
            Count Through FLAMES
            {shouldAnimate && (
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Flame className="text-secondary/60 h-5 w-5" />
              </motion.div>
            )}
          </motion.h2>

          {/* Enhanced FLAMES Letters Display */}
          <motion.div
            className="mb-10 flex min-h-[100px] flex-wrap justify-center gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {flamesLetters.map((letter, i) => (
                <FlamesLetter
                  key={`${letter}-${i}`}
                  letter={letter}
                  index={i}
                  isHighlighted={highlightedIndex === i}
                  isEliminated={eliminatedLetter === letter}
                  isFinal={finalResult === letter}
                  shouldAnimate={shouldAnimate}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Step Message */}
          <motion.div
            className="text-on-surface-variant mb-8 min-h-[3em] text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={stepMessage || 'default'}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-surface-container/50 border-outline/10 rounded-lg border p-4"
              >
                <motion.p
                  className="text-lg leading-relaxed"
                  animate={
                    isCounting && shouldAnimate
                      ? {
                          color: [
                            'hsl(var(--on-surface-variant))',
                            'hsl(var(--primary))',
                            'hsl(var(--on-surface-variant))',
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {stepMessage ||
                    `Use the count (${remainingLettersCount > 0 ? remainingLettersCount : 'N/A'}) to eliminate letters one by one.`}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Control Buttons */}
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Button
                variant="primary"
                size="md"
                onClick={startFlamesSimulation}
                icon={finalResult ? Play : Flame}
                disabled={isCounting || remainingLettersCount <= 0}
                className={`group relative overflow-hidden px-6 py-3 font-semibold shadow-lg transition-all duration-300 ${
                  isCounting || remainingLettersCount <= 0 ? 'cursor-not-allowed opacity-50' : 'hover:shadow-xl'
                }`}
                aria-label={finalResult ? 'Play FLAMES simulation again' : 'Start FLAMES simulation'}
              >
                {/* Button glow effect */}
                {shouldAnimate && !isCounting && remainingLettersCount > 0 && (
                  <motion.div
                    className="from-primary/20 via-primary-container/30 to-secondary/20 absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}

                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">
                  {finalResult ? 'Play Again' : 'Start Simulation'}
                </span>
              </Button>
            </motion.div>

            {/* Enhanced Reset Button */}
            <AnimatePresence>
              {(isCounting || finalResult) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={resetSimulation}
                    icon={RefreshCcw}
                    className="group px-6 py-3 font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
                    aria-label="Reset FLAMES simulation"
                  >
                    <span className="transition-transform duration-200 group-hover:-translate-x-0.5">Reset</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
