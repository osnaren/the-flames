/**
 * FLAMES Game Utilities
 */
import { FLAMES_ORDER } from '@/constants/flames';
import { z } from 'zod';
import type { FlamesResult } from './types';

/**
 * Schema for validating names in the FLAMES game
 * Allows letters (including Unicode), spaces, hyphens, apostrophes, and dots
 * The FLAMES calculation itself only uses alphabetic letters
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be 50 characters or less')
  .regex(/^[\p{L}\s'.'-]+$/u, 'Only letters, spaces, hyphens, apostrophes, and dots are allowed')
  .transform((s) => s.trim())
  .refine((s) => s.length > 0, 'Name cannot be empty after trimming')
  .refine((s) => /[\p{L}]/u.test(s), 'Name must contain at least one letter');

/**
 * Type for a character with its position
 */
interface CharWithIndex {
  char: string;
  index: number;
}

/**
 * Type for matched letter results
 */
interface MatchedLettersResult {
  matched1: Set<number>;
  matched2: Set<number>;
  common?: Set<string>;
}

/**
 * Normalize a name string for consistent FLAMES calculations
 * - Lowercases
 * - Removes all non-letter characters (spaces, hyphens, apostrophes, dots, etc.)
 * Only alphabetic characters (including Unicode letters) are used in the FLAMES counting algorithm
 */
const sanitizeName = (name: string): string => [...name.toLowerCase()].filter((char) => /\p{L}/u.test(char)).join('');

/**
 * Find matches between two names and track matched positions
 * @param name1 First name
 * @param name2 Second name
 * @param trackCommonLetters Whether to track common letters in a set
 * @returns Object with matched positions and optionally common letters
 */
const findMatches = (name1: string, name2: string, trackCommonLetters: boolean = false): MatchedLettersResult => {
  const n1 = sanitizeName(name1);
  const n2 = sanitizeName(name2);

  // Create arrays of characters with their positions
  const chars1: CharWithIndex[] = [...n1].map((char, index) => ({ char, index }));
  const chars2: CharWithIndex[] = [...n2].map((char, index) => ({ char, index }));

  // Track which positions have been matched
  const matched1 = new Set<number>();
  const matched2 = new Set<number>();
  const common = trackCommonLetters ? new Set<string>() : undefined;

  // Find matches one at a time
  for (const { char: char1, index: i1 } of chars1) {
    if (matched1.has(i1)) continue;

    // Look for an unmatched occurrence of this letter in name2
    const match2 = chars2.find(({ char: char2, index: i2 }) => char1 === char2 && !matched2.has(i2));

    if (match2) {
      matched1.add(i1);
      matched2.add(match2.index);
      if (common) {
        common.add(char1);
      }
    }
  }

  return { matched1, matched2, common };
};

/**
 * Calculates the common letters between two names
 * @param name1 First name
 * @param name2 Second name
 * @returns Array of common letters
 */
export const findCommonLetters = (name1: string, name2: string): string[] => {
  const n1 = sanitizeName(name1);
  const n2 = sanitizeName(name2);
  const { common } = findMatches(n1, n2, true);
  return Array.from(common || []);
};

/**
 * Calculate the FLAMES result based on two names
 * @param name1 First name
 * @param name2 Second name
 * @returns The resulting FLAMES letter
 */
export const calculateFlamesResult = (name1: string, name2: string): FlamesResult => {
  const n1 = sanitizeName(name1);
  const n2 = sanitizeName(name2);

  const { matched1 } = findMatches(n1, n2);

  // Calculate the result using the FLAMES algorithm
  // Total letters minus pairs of matched letters
  const remainingCount = n1.length + n2.length - matched1.size * 2;
  const flames: FlamesResult[] = [...FLAMES_ORDER];
  let currentIndex = 0;

  while (flames.length > 1) {
    currentIndex = (currentIndex + remainingCount - 1) % flames.length;
    flames.splice(currentIndex, 1);
  }

  return flames[0] ? flames[0] : null;
};
