import { FlamesResult } from './flames.types';
import { z } from 'zod';

/**
 * Schema for validating names in the FLAMES game
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed')
  .transform(s => s.trim());

/**
 * Definitions for what each FLAMES result means
 */
export const resultMeanings = {
  F: { 
    text: 'Friendship', 
    icon: 'Users', 
    color: 'text-blue-500',
    quote: 'Best friends are the siblings we choose! 🤝'
  },
  L: { 
    text: 'Love', 
    icon: 'Heart', 
    color: 'text-red-500',
    quote: 'When two hearts beat as one! 💘'
  },
  A: { 
    text: 'Affection', 
    icon: 'Star', 
    color: 'text-yellow-500',
    quote: 'The spark that keeps the flame alive! ✨'
  },
  M: { 
    text: 'Marriage', 
    icon: 'Ring', 
    color: 'text-purple-500',
    quote: 'Destined for a lifetime together! 💍'
  },
  E: { 
    text: 'Enemy', 
    icon: 'Sword', 
    color: 'text-orange-500',
    quote: 'That escalated quickly... 😅'
  },
  S: { 
    text: 'Siblings', 
    icon: 'Users', 
    color: 'text-green-500',
    quote: 'Family vibes only! 👪'
  },
};

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
 * Find matches between two names and track matched positions
 * @param name1 First name
 * @param name2 Second name
 * @param trackCommonLetters Whether to track common letters in a set
 * @returns Object with matched positions and optionally common letters
 */
const findMatches = (name1: string, name2: string, trackCommonLetters: boolean = false): MatchedLettersResult => {
  const n1 = name1.toLowerCase().replace(/\s/g, '');
  const n2 = name2.toLowerCase().replace(/\s/g, '');

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
    const match2 = chars2.find(({ char: char2, index: i2 }) => 
      char1 === char2 && !matched2.has(i2)
    );

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
  const { common } = findMatches(name1, name2, true);
  return Array.from(common || []);
};

/**
 * Calculate the FLAMES result based on two names
 * @param name1 First name
 * @param name2 Second name
 * @returns The resulting FLAMES letter
 */
export const calculateFlamesResult = (name1: string, name2: string): FlamesResult => {
  const n1 = name1.toLowerCase().replace(/\s/g, '');
  const n2 = name2.toLowerCase().replace(/\s/g, '');
  
  const { matched1 } = findMatches(name1, name2);
  
  // Calculate the result using the FLAMES algorithm
  const remainingCount = n1.length + n2.length - (matched1.size * 2);
  const flames: FlamesResult[] = ['F', 'L', 'A', 'M', 'E', 'S'];
  let currentIndex = 0;
  
  while (flames.length > 1) {
    currentIndex = (currentIndex + remainingCount - 1) % flames.length;
    flames.splice(currentIndex, 1);
  }
  
  return flames[0];
};