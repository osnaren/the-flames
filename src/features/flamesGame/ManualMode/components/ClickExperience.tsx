import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share, SquareArrowOutUpRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Button from '../../../../components/ui/Button';
import { calculateFlamesResult } from '../../flames.utils';
import type { ClickExperienceProps } from '../types';
import FlamesLetters from './FlamesLetters';
import LetterTile from './LetterTile';

export default function ClickExperience({ name1, name2, onBack, onShare }: ClickExperienceProps) {
  const [crossedLetters, setCrossedLetters] = useState<Set<string>>(new Set());
  const [flamesCrossedLetters, setFlamesCrossedLetters] = useState<Set<string>>(new Set());

  // Calculate the correct FLAMES result for validation
  const correctResult = useMemo(() => {
    return calculateFlamesResult(name1, name2);
  }, [name1, name2]);

  // Generate letter tiles for both names
  const name1Letters = name1
    .toUpperCase()
    .split('')
    .map((letter, index) => ({
      letter,
      id: `name1-${index}`,
      nameIndex: 1 as const,
    }));

  const name2Letters = name2
    .toUpperCase()
    .split('')
    .map((letter, index) => ({
      letter,
      id: `name2-${index}`,
      nameIndex: 2 as const,
    }));

  const toggleLetter = useCallback((letterId: string) => {
    setCrossedLetters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(letterId)) {
        newSet.delete(letterId);
      } else {
        newSet.add(letterId);
      }
      return newSet;
    });
  }, []);

  const toggleFlamesLetter = useCallback((letter: string) => {
    setFlamesCrossedLetters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(letter)) {
        newSet.delete(letter);
      } else {
        newSet.add(letter);
      }
      return newSet;
    });
  }, []);

  const handleReset = useCallback(() => {
    setCrossedLetters(new Set());
    setFlamesCrossedLetters(new Set());
    toast.success('Reset completed!');
  }, []);

  const handleShare = useCallback(async () => {
    try {
      // Create a summary of the current state
      const imageData = `data:text/plain;base64,${btoa(
        `FLAMES Result: ${name1} ❤️ ${name2}\nCorrect Answer: ${correctResult}\nUser Progress: ${flamesCrossedLetters.size}/6 FLAMES letters crossed`
      )}`;

      onShare(imageData);
      toast.success('Shared successfully!');
    } catch (error) {
      toast.error('Failed to share');
      console.error('Share error:', error);
    }
  }, [name1, name2, correctResult, flamesCrossedLetters.size, onShare]);

  // Get user's current result from FLAMES letters
  const userResult = useMemo(() => {
    const flamesOrder = ['F', 'L', 'A', 'M', 'E', 'S'];
    const remainingLetters = flamesOrder.filter((letter) => !flamesCrossedLetters.has(letter));
    return remainingLetters.length === 1 ? remainingLetters[0] : null;
  }, [flamesCrossedLetters]);

  // Determine if user has reached the correct result
  const isCorrectResult = userResult === correctResult;

  // Show final result effect
  useEffect(() => {
    if (userResult && isCorrectResult) {
      toast.success(`Congratulations! The result is ${correctResult}! 🎉`);
    } else if (userResult && !isCorrectResult) {
      toast.error(`Not quite right. Try again! The correct answer is ${correctResult}.`);
    }
  }, [userResult, isCorrectResult, correctResult]);

  return (
    <div className="bg-background min-h-screen p-4">
      {/* Background Pattern */}
      <div className="bg-[radial-gradient(circle_at_1px_1px,theme(colors.on-surface)_1px,transparent_0)] absolute inset-0 bg-[length:20px_20px] opacity-5" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={onBack}
            className="text-on-surface hover:bg-surface-container/50"
          >
            Back to Input
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
              className="text-on-surface hover:bg-surface-container/50"
            >
              Reset
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Share}
              onClick={handleShare}
              className="text-on-surface hover:bg-surface-container/50"
            >
              Share
            </Button>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-on-surface mb-4 text-4xl font-bold md:text-5xl">
            {name1} ❤️ {name2}
          </h1>
          <p className="text-on-surface-variant text-lg">Click letters to cross them out and solve the FLAMES puzzle</p>
        </motion.div>

        {/* Manual Calculation Steps */}
        <div className="space-y-12">
          {/* Step 1: First Name */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-outline/20 bg-surface/80 rounded-2xl border p-8 shadow-lg backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center">
              <div className="bg-primary-container text-on-primary-container mr-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                1
              </div>
              <h2 className="text-on-surface text-2xl font-bold">First Name: {name1.toUpperCase()}</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {name1Letters.map((letterData, index) => (
                <LetterTile
                  key={letterData.id}
                  letter={letterData.letter}
                  index={index}
                  nameIndex={letterData.nameIndex}
                  isCrossed={crossedLetters.has(letterData.id)}
                  onToggle={() => toggleLetter(letterData.id)}
                />
              ))}
            </div>
          </motion.section>

          {/* Step 2: Second Name */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-outline/20 bg-surface/80 rounded-2xl border p-8 shadow-lg backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center">
              <div className="bg-tertiary-container text-on-tertiary-container mr-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                2
              </div>
              <h2 className="text-on-surface text-2xl font-bold">Second Name: {name2.toUpperCase()}</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {name2Letters.map((letterData, index) => (
                <LetterTile
                  key={letterData.id}
                  letter={letterData.letter}
                  index={index}
                  nameIndex={letterData.nameIndex}
                  isCrossed={crossedLetters.has(letterData.id)}
                  onToggle={() => toggleLetter(letterData.id)}
                />
              ))}
            </div>
          </motion.section>

          {/* Step 3: FLAMES Letters */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-outline/20 bg-surface/80 rounded-2xl border p-8 shadow-lg backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center">
              <div className="bg-secondary-container text-on-secondary-container mr-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                3
              </div>
              <h2 className="text-on-surface text-2xl font-bold">F.L.A.M.E.S Letters</h2>
            </div>

            <FlamesLetters
              crossedLetters={flamesCrossedLetters}
              onLetterToggle={toggleFlamesLetter}
              userResult={userResult}
              correctResult={correctResult}
            />
          </motion.section>

          {/* Instructions */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="border-primary-container/20 bg-primary-container/10 rounded-2xl border p-6 backdrop-blur-xl"
          >
            <h3 className="text-on-surface mb-4 flex gap-1 text-lg font-semibold">
              How to Play
              <Link to="/how-it-works">
                <SquareArrowOutUpRight className="text-on-surface-variant w-4 cursor-pointer" />
              </Link>
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-on-surface-variant space-y-2 text-sm">
                <p>
                  <strong>Step 1:</strong> Cross out matching letters between the two names
                </p>
                <p>
                  <strong>Step 2:</strong> Count the remaining letters
                </p>
              </div>
              <div className="text-on-surface-variant space-y-2 text-sm">
                <p>
                  <strong>Step 3:</strong> Use that count to eliminate F.L.A.M.E.S letters
                </p>
                <p>
                  <strong>Step 4:</strong> The last remaining letter is your result!
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
