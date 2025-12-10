/**
 * Result card asset configuration
 * Maps FLAMES results to their corresponding icon images, descriptions, and quotes
 *
 * @description
 * This file contains all the configurable content for the result card display.
 * To add more variety:
 * - Add new entries to RESULT_DESCRIPTIONS_POOL for descriptions
 * - Add new entries to RESULT_QUOTES_POOL for quotes
 *
 * The system will randomly select one item from each pool when displaying results.
 */

import type { NonNullFlamesResult } from '../../types';

// ============================================================================
// TYPES
// ============================================================================

export interface ResultGradient {
  from: string;
  to: string;
  text: string;
}

export type DescriptionTemplate = (name1?: string, name2?: string) => string;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts a string to Title Case
 * @example toTitleCase('john doe') => 'John Doe'
 */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats names for display in descriptions
 * Ensures proper title case formatting
 */
function formatNames(name1?: string, name2?: string): string {
  if (name1 && name2) {
    return `${toTitleCase(name1)} and ${toTitleCase(name2)}`;
  }
  return 'You two';
}

// ============================================================================
// STATIC ASSETS
// ============================================================================

export const RESULT_ICONS: Record<NonNullFlamesResult, string> = {
  F: '/assets/game/friends.png',
  L: '/assets/game/love.png',
  A: '/assets/game/affection.png',
  M: '/assets/game/marriage.png',
  E: '/assets/game/enemy.png',
  S: '/assets/game/siblings.png',
};

export const RESULT_LABELS: Record<NonNullFlamesResult, string> = {
  F: 'Friendship',
  L: 'Love',
  A: 'Affection',
  M: 'Marriage',
  E: 'Enemy',
  S: 'Siblings',
};

export const RESULT_GRADIENTS: Record<NonNullFlamesResult, ResultGradient> = {
  F: {
    from: 'from-blue-500',
    to: 'to-indigo-600',
    text: 'bg-linear-to-r from-blue-500 to-indigo-600',
  },
  L: {
    from: 'from-pink-500',
    to: 'to-rose-600',
    text: 'bg-linear-to-r from-pink-500 to-rose-600',
  },
  A: {
    from: 'from-amber-500',
    to: 'to-orange-600',
    text: 'bg-linear-to-r from-amber-500 to-orange-600',
  },
  M: {
    from: 'from-purple-500',
    to: 'to-violet-600',
    text: 'bg-linear-to-r from-purple-500 to-violet-600',
  },
  E: {
    from: 'from-red-500',
    to: 'to-red-700',
    text: 'bg-linear-to-r from-red-500 to-red-700',
  },
  S: {
    from: 'from-emerald-500',
    to: 'to-green-600',
    text: 'bg-linear-to-r from-emerald-500 to-green-600',
  },
};

// ============================================================================
// DESCRIPTION TEMPLATES POOL
// Add more descriptions here - they will be randomly selected
// ============================================================================

export const RESULT_DESCRIPTIONS_POOL: Record<NonNullFlamesResult, DescriptionTemplate[]> = {
  F: [
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} are destined to be great friends! Your connection is built on trust and mutual respect.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} have found a friendship that will stand the test of time. Cherish this beautiful bond!`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `A rare and precious friendship awaits ${names}. You'll be there for each other through thick and thin.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} share a bond that goes beyond ordinary friendship. Your souls understand each other perfectly.`;
    },
  ],
  L: [
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} share a deep romantic love! Your hearts beat as one in a beautiful love story.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `True love is written in the stars for ${names}! This is a connection that transcends the ordinary.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} are experiencing what poets dream of writing about. Your love story is one for the ages!`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `The universe has conspired to bring ${names} together. Embrace this magical love!`;
    },
  ],
  A: [
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} have a warm affection! There's a special fondness and care in your relationship.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `A gentle, caring affection blooms between ${names}. This tender bond is truly special.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} share a beautiful affection that warms the heart. Your care for each other is evident to all.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `Sweet affection defines ${names}'s relationship. This gentle love is the foundation of something beautiful.`;
    },
  ],
  M: [
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} are meant for marriage! Your souls are perfectly aligned for a lifetime together.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `Wedding bells are ringing for ${names}! A beautiful future together awaits you both.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} are destined to walk down the aisle together. Your bond is built for a lifetime of happiness!`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `Forever starts now for ${names}! The stars have aligned for your eternal union.`;
    },
  ],
  E: [
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} have some conflicts to resolve. But remember, enemies can become friends with understanding.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `There's tension between ${names}, but this rivalry could spark something unexpected!`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} may clash, but the greatest friendships often start with a little friction. Give it time!`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `Every hero needs a rival! ${names} push each other to be better. That's pretty special in its own way.`;
    },
  ],
  S: [
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} share a sibling-like bond! Your relationship is filled with care and family-like love.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} have found family in each other! This sibling-like bond is precious and everlasting.`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `A beautiful sibling connection exists between ${names}. You'll always have each other's backs!`;
    },
    (name1, name2) => {
      const names = formatNames(name1, name2);
      return `${names} share the unconditional love of siblings. Through teasing and caring, your bond is unbreakable.`;
    },
  ],
};

// ============================================================================
// QUOTES POOL
// Add more quotes here - they will be randomly selected
// ============================================================================

export const RESULT_QUOTES_POOL: Record<NonNullFlamesResult, string[]> = {
  F: [
    'Friendship is the only cement that will ever hold the world together.',
    'A friend is someone who knows all about you and still loves you.',
    'True friendship comes when the silence between two people is comfortable.',
    'Friends are the family you choose.',
    'In the cookie of life, friends are the chocolate chips.',
  ],
  L: [
    'Love is about how much you love each other every single day.',
    'The best thing to hold onto in life is each other.',
    'Love is not about how many days, months, or years you have been together. It is about how much you love each other every single day.',
    'To love and be loved is to feel the sun from both sides.',
    "Love is when the other person's happiness is more important than your own.",
  ],
  A: [
    'Affection is responsible for nine-tenths of our solid happiness.',
    'There is no charm equal to tenderness of heart.',
    'Affection is the broadest basis of a good life.',
    'The greatest thing you will ever learn is just to love and be loved in return.',
    'Tenderness and kindness are not signs of weakness but manifestations of strength.',
  ],
  M: [
    'A successful marriage requires falling in love many times, always with the same person.',
    'Happy marriages begin when we marry the ones we love, and they blossom when we love the ones we marry.',
    'Marriage is not about age; it is about finding the right person.',
    'A great marriage is not when the perfect couple comes together but when an imperfect couple learns to enjoy their differences.',
    'The secret of a happy marriage is finding the right person.',
  ],
  E: [
    'The best way to destroy an enemy is to make them a friend.',
    "An enemy is just a friend whose story you haven't heard.",
    'Keep your friends close, but your enemies closer.',
    'Never interrupt your enemy when they are making a mistake.',
    'The greatest glory is not in never falling, but in rising every time we fall.',
  ],
  S: [
    'Siblings teach us about fairness, cooperation, and unconditional love.',
    "Having a sibling is like having a best friend you can't get rid of.",
    'Siblings are the people we practice on, the people who teach us about fairness and cooperation.',
    'A sibling is both your mirror and your opposite.',
    'Brothers and sisters are as close as hands and feet.',
  ],
};

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// These use the first item from each pool
// ============================================================================

/** @deprecated Use RESULT_DESCRIPTIONS_POOL with getRandomDescription() instead */
export const RESULT_DESCRIPTIONS: Record<NonNullFlamesResult, DescriptionTemplate> = {
  F: RESULT_DESCRIPTIONS_POOL.F[0],
  L: RESULT_DESCRIPTIONS_POOL.L[0],
  A: RESULT_DESCRIPTIONS_POOL.A[0],
  M: RESULT_DESCRIPTIONS_POOL.M[0],
  E: RESULT_DESCRIPTIONS_POOL.E[0],
  S: RESULT_DESCRIPTIONS_POOL.S[0],
};

/** @deprecated Use RESULT_QUOTES_POOL with getRandomQuote() instead */
export const RESULT_QUOTES: Record<NonNullFlamesResult, string> = {
  F: RESULT_QUOTES_POOL.F[0],
  L: RESULT_QUOTES_POOL.L[0],
  A: RESULT_QUOTES_POOL.A[0],
  M: RESULT_QUOTES_POOL.M[0],
  E: RESULT_QUOTES_POOL.E[0],
  S: RESULT_QUOTES_POOL.S[0],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets a random item from an array
 * Uses a seeded approach based on names for consistency during a session
 */
function getRandomItem<T>(array: T[], seed?: string): T {
  if (seed) {
    // Create a simple hash from the seed for consistent randomization per name pair
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % array.length;
    return array[index];
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gets a random description for a FLAMES result
 * @param result - The FLAMES result letter
 * @param name1 - Optional first name for personalization
 * @param name2 - Optional second name for personalization
 * @param seed - Optional seed for consistent randomization (e.g., combined names)
 */
export function getRandomDescription(
  result: NonNullFlamesResult,
  name1?: string,
  name2?: string,
  seed?: string
): string {
  const templates = RESULT_DESCRIPTIONS_POOL[result];
  const template = getRandomItem(templates, seed);
  return template(name1, name2);
}

/**
 * Gets a random quote for a FLAMES result
 * @param result - The FLAMES result letter
 * @param seed - Optional seed for consistent randomization (e.g., combined names)
 */
export function getRandomQuote(result: NonNullFlamesResult, seed?: string): string {
  const quotes = RESULT_QUOTES_POOL[result];
  return getRandomItem(quotes, seed);
}

/**
 * Gets both a random description and quote for a FLAMES result
 * Uses the same seed for consistency
 */
export function getRandomResultContent(
  result: NonNullFlamesResult,
  name1?: string,
  name2?: string
): { description: string; quote: string } {
  // Create a seed from the names for consistent results per pair
  const seed = name1 && name2 ? `${name1.toLowerCase()}-${name2.toLowerCase()}-${result}` : undefined;

  return {
    description: getRandomDescription(result, name1, name2, seed),
    quote: getRandomQuote(result, seed),
  };
}

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

export const ANIMATION_STAGES = ['entry', 'icon', 'names', 'title', 'description', 'quote'] as const;
export const ANIMATION_DELAYS = [100, 250, 400, 550, 700, 850];
