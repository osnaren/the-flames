import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

interface Step3Props {
  remainingLettersCount: number;
}

/**
 * Step 3 component showing the FLAMES counting simulation
 */
export default function Step3FlamesSimulation({ remainingLettersCount }: Step3Props) {
  const [flamesLetters, setFlamesLetters] = useState(['F', 'L', 'A', 'M', 'E', 'S']);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [eliminatedLetter, setEliminatedLetter] = useState<string | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [finalResult, setFinalResult] = useState<string | null>(null);

  // FLAMES counting animation
  const startFlamesSimulation = async () => {
    if (isCounting) return;
    // Handle invalid count
    if (remainingLettersCount <= 0) {
      setStepMessage('The count must be greater than 0 to start the simulation.');
      return;
    }
    setIsCounting(true);
    setFinalResult(null);
    setEliminatedLetter(null);
    setHighlightedIndex(null);
    // eslint-disable-next-line prefer-const
    let currentFlames = ['F', 'L', 'A', 'M', 'E', 'S'];
    setFlamesLetters(currentFlames);
    let currentIndex = -1; // Start before the first letter

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    setStepMessage(`Starting with FLAMES and count ${remainingLettersCount}...`);
    await delay(1500);

    while (currentFlames.length > 1) {
      const count = remainingLettersCount;
      // Ensure count is positive for modulo operation
      const positiveCount = Math.max(1, count);
      const steps = positiveCount % currentFlames.length;
      let targetIndex;

      // Adjust targetIndex if steps is 0 (meaning count is a multiple of currentFlames.length)
      // In this case, the last element should be removed.
      if (steps === 0) {
        targetIndex = currentFlames.length - 1;
      } else {
        // Normal calculation: steps is the offset from the *next* position relative to currentIndex
        targetIndex = (currentIndex + steps) % currentFlames.length;
      }

      setStepMessage(`Counting ${positiveCount} steps...`);

      // Animate the count highlight
      let animationIndex = currentIndex;
      for (let i = 1; i <= positiveCount; i++) {
        animationIndex = (animationIndex + 1) % currentFlames.length;
        setHighlightedIndex(animationIndex);
        await delay(150); // Faster highlight step
      }
      // Ensure the final highlighted index matches the target index before removal
      setHighlightedIndex(targetIndex);
      await delay(300); // Short pause on the letter to be removed

      const letterToRemove = currentFlames[targetIndex];
      setEliminatedLetter(letterToRemove);
      setStepMessage(`Removing ${letterToRemove}...`);
      await delay(1000); // Pause to show removed letter

      currentFlames.splice(targetIndex, 1);
      setFlamesLetters([...currentFlames]);
      setEliminatedLetter(null); // Clear eliminated state
      setHighlightedIndex(null); // Clear highlight

      // Adjust the starting point for the next round
      // The next count should start from the position *before* the removed item's original index.
      // Since splice modifies the array, if we removed at targetIndex, the next item is now
      // at targetIndex. Counting starts *before* that.
      currentIndex = targetIndex - 1;
      if (currentIndex < 0 && currentFlames.length > 0) {
        currentIndex = currentFlames.length - 1; // Wrap around if needed
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

  // Reset function
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      <Card className="p-8 shadow-lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading text-on-surface mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="bg-secondary-container/20 text-secondary flex h-8 w-8 items-center justify-center rounded-full">
              3
            </span>
            Count Through FLAMES
          </h2>
          <div className="mb-8 flex min-h-[80px] flex-wrap justify-center gap-3 md:gap-4">
            <AnimatePresence mode="wait">
              {flamesLetters.map((letter, i) => {
                const isHighlighted = highlightedIndex === i;
                const isEliminated = eliminatedLetter === letter;
                const isFinal = finalResult === letter;

                return (
                  <motion.div
                    key={`flames-${letter}-${i}`} // Ensure key is unique even if letters repeat (though not in FLAMES)
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: isEliminated ? 0.3 : 1,
                      scale: isHighlighted ? 1.15 : isFinal ? 1.1 : 1,
                      filter: isHighlighted ? 'brightness(1.2)' : 'brightness(1)',
                      // Add a subtle bounce for the final result
                      ...(isFinal && { y: [0, -5, 0], transition: { duration: 0.4, ease: 'easeInOut' } }),
                    }}
                    transition={{ duration: 0.2, ease: 'circOut' }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                    className={`relative flex h-12 w-12 items-center justify-center rounded-lg font-mono text-xl font-bold shadow-md md:h-14 md:w-14 ${
                      isFinal
                        ? 'from-secondary to-primary-container text-on-secondary ring-outline/20 bg-gradient-to-br ring-2'
                        : isHighlighted
                          ? 'bg-primary-container text-on-primary-container ring-primary/20 ring-2'
                          : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {letter}
                    {isEliminated && (
                      <motion.div className="absolute inset-0 flex items-center justify-center">
                        <motion.svg
                          className="text-error h-10 w-10 opacity-80"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </motion.svg>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="text-on-surface-variant mb-6 min-h-[2em] text-center">
            <AnimatePresence>
              <motion.p
                key={stepMessage || 'default'} // Use message as key for animation trigger
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {stepMessage ||
                  `Use the count (${remainingLettersCount > 0 ? remainingLettersCount : 'N/A'}) to eliminate letters one by one.`}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="primary"
              size="sm"
              onClick={startFlamesSimulation}
              icon={Flame}
              disabled={isCounting || remainingLettersCount <= 0}
              className="disabled:opacity-50"
              aria-label={finalResult ? 'Play FLAMES simulation again' : 'Start FLAMES simulation'}
            >
              {finalResult ? 'Play Again' : 'Start Simulation'}
            </Button>
            {/* Show Reset button only when simulation is running or has finished */}
            {(isCounting || finalResult) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={resetSimulation} // Call reset directly
                icon={RefreshCcw}
                aria-label="Reset FLAMES simulation"
              >
                Reset
              </Button>
            )}
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
