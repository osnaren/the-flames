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
      const steps = count % currentFlames.length;
      let targetIndex = (currentIndex + steps) % currentFlames.length;

      // Adjust targetIndex if it lands on the same spot due to modulo
      if (steps === 0) {
        targetIndex = (currentIndex + currentFlames.length) % currentFlames.length;
      }

      setStepMessage(`Counting ${count} steps...`);

      // Animate the count highlight
      for (let i = 1; i <= count; i++) {
        const highlightIdx = (currentIndex + i) % currentFlames.length;
        setHighlightedIndex(highlightIdx);
        await delay(150); // Faster highlight step
      }

      const letterToRemove = currentFlames[targetIndex];
      setEliminatedLetter(letterToRemove);
      setStepMessage(`Removing ${letterToRemove}...`);
      await delay(1000); // Pause to show removed letter

      currentFlames.splice(targetIndex, 1);
      setFlamesLetters([...currentFlames]);
      setEliminatedLetter(null); // Clear eliminated state
      setHighlightedIndex(null); // Clear highlight

      // Adjust the starting point for the next round
      currentIndex = targetIndex - 1; // Start count from the position *before* the removed item
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
      <Card className="p-8 shadow-lg dark:shadow-yellow-900/20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300">
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
                    key={`flames-${letter}-${i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: isEliminated ? 0.3 : 1,
                      scale: isHighlighted ? 1.15 : isFinal ? 1.1 : 1,
                      filter: isHighlighted ? 'brightness(1.2)' : 'brightness(1)',
                    }}
                    transition={{ duration: 0.2, ease: 'circOut' }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                    className={`relative flex h-12 w-12 items-center justify-center rounded-lg font-mono text-xl font-bold shadow-md md:h-14 md:w-14 ${
                      isFinal
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white ring-2 ring-white dark:from-yellow-500 dark:to-orange-600'
                        : isHighlighted
                          ? 'bg-orange-400 text-white ring-2 ring-orange-200 dark:bg-orange-500'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {letter}
                    {isEliminated && (
                      <motion.div className="absolute inset-0 flex items-center justify-center">
                        <motion.svg
                          className="h-10 w-10 text-red-500 opacity-80"
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

          <div className="mb-6 min-h-[2em] text-center text-gray-600 dark:text-gray-300">
            <AnimatePresence mode="wait">
              <motion.p
                key={stepMessage || 'default'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {stepMessage || `Use the count (${remainingLettersCount}) to eliminate letters one by one.`}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="primary"
              size="sm"
              onClick={startFlamesSimulation}
              icon={Flame}
              disabled={isCounting}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {finalResult ? 'Play Simulation Again' : 'Start Simulation'}
            </Button>
            {(isCounting || finalResult) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={resetSimulation}
                icon={RefreshCcw}
                disabled={isCounting && !finalResult}
              >
                Reset
              </Button>
            )}
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            This continues until only one letter remains. That's your result!
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
