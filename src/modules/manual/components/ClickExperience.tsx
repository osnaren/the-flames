'use client';

import Button from '@/components/ui/Button';
import { calculateFlamesResult } from '@modules/home/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RotateCcw, Share, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { ClickExperienceProps } from '../types';
import FlamesLetters from './FlamesLetters';
import LetterTile from './LetterTile';

export default function ClickExperience({
  name1,
  name2,
  onBack,
  onShare,
  onSave,
  onResultChange,
  isSharing = false,
  isSaving = false,
}: ClickExperienceProps) {
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

  // Get user's current result from FLAMES letters
  const userResult = useMemo(() => {
    const flamesOrder = ['F', 'L', 'A', 'M', 'E', 'S'];
    const remainingLetters = flamesOrder.filter((letter) => !flamesCrossedLetters.has(letter));
    return remainingLetters.length === 1 ? remainingLetters[0] : null;
  }, [flamesCrossedLetters]);

  // Calculate remaining count of valid letters (excluding spaces/symbols)
  const remainingCount = useMemo(() => {
    const isAlpha = (char: string) => /^[a-zA-Z]$/.test(char);
    const totalValid = name1.split('').filter(isAlpha).length + name2.split('').filter(isAlpha).length;
    return totalValid - crossedLetters.size;
  }, [name1, name2, crossedLetters]);

  // Inform the parent component about the result change
  useEffect(() => {
    onResultChange(userResult);
  }, [userResult, onResultChange]);

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-on-surface)_1px,transparent_0)] bg-size-[20px_20px] opacity-5" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center justify-between gap-3 md:flex-row"
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
              onClick={onShare}
              disabled={isSharing}
              className="text-on-surface hover:bg-surface-container/50 disabled:opacity-50"
            >
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={onSave}
              disabled={isSaving}
              className="text-on-surface hover:bg-surface-container/50 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
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
          <h1 className="text-on-surface mb-4 flex items-center justify-center gap-3 text-4xl font-bold md:text-5xl">
            {name1}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ❤️
            </motion.span>
            {name2}
          </h1>
          <p className="text-on-surface-variant text-lg">Click on matching letters to cross them out</p>
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

          {/* Remaining Count Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="bg-secondary-container/20 border-secondary/20 flex flex-col items-center rounded-2xl border p-2 px-4 text-center backdrop-blur-md md:flex-row md:gap-8 md:text-left">
              <div className="from-secondary to-secondary-container text-on-secondary shadow-secondary/20 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br text-3xl font-bold shadow-lg">
                {remainingCount}
              </div>
              <div>
                <h3 className="text-on-surface text-lg font-bold">Remaining Letters</h3>
              </div>
            </div>
          </motion.div>

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
            <h3 className="text-on-surface mb-4 flex items-center gap-2 text-lg font-semibold">
              How to Play
              <Link
                href="/how-it-works"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Learn more about how FLAMES works"
              >
                <SquareArrowOutUpRight className="h-5 w-5" />
              </Link>
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-primary-container text-on-primary-container flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    1
                  </span>
                  <p className="text-on-surface-variant text-sm">
                    Click matching letters in both names to cross them out
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary-container text-on-primary-container flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    2
                  </span>
                  <p className="text-on-surface-variant text-sm">Count the remaining uncrossed letters</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-primary-container text-on-primary-container flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    3
                  </span>
                  <p className="text-on-surface-variant text-sm">Use that count to eliminate F.L.A.M.E.S letters</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary-container text-on-primary-container flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    4
                  </span>
                  <p className="text-on-surface-variant text-sm">The last remaining letter reveals your destiny!</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
