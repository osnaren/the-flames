/**
 * Result card asset configuration
 * Maps FLAMES results to their corresponding icon images
 */

import type { NonNullFlamesResult } from '../../types';

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

export const RESULT_GRADIENTS: Record<NonNullFlamesResult, { from: string; to: string; text: string }> = {
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

export const RESULT_DESCRIPTIONS: Record<NonNullFlamesResult, (name1?: string, name2?: string) => string> = {
  F: (name1, name2) => {
    const names = name1 && name2 ? `${name1} and ${name2}` : 'You two';
    return `${names} are destined to be great friends! Your connection is built on trust and mutual respect.`;
  },
  L: (name1, name2) => {
    const names = name1 && name2 ? `${name1} and ${name2}` : 'You two';
    return `${names} share a deep romantic love! Your hearts beat as one in a beautiful love story.`;
  },
  A: (name1, name2) => {
    const names = name1 && name2 ? `${name1} and ${name2}` : 'You two';
    return `${names} have a warm affection! There's a special fondness and care in your relationship.`;
  },
  M: (name1, name2) => {
    const names = name1 && name2 ? `${name1} and ${name2}` : 'You two';
    return `${names} are meant for marriage! Your souls are perfectly aligned for a lifetime together.`;
  },
  E: (name1, name2) => {
    const names = name1 && name2 ? `${name1} and ${name2}` : 'You two';
    return `${names} have some conflicts to resolve. But remember, enemies can become friends with understanding.`;
  },
  S: (name1, name2) => {
    const names = name1 && name2 ? `${name1} and ${name2}` : 'You two';
    return `${names} share a sibling-like bond! Your relationship is filled with care and family-like love.`;
  },
};

export const RESULT_QUOTES: Record<NonNullFlamesResult, string> = {
  F: 'Friendship is the only cement that will ever hold the world together.',
  L: 'Love is about how much you love each other every single day.',
  A: 'Affection is responsible for nine-tenths of our solid happiness.',
  M: 'A successful marriage requires falling in love many times, always with the same person.',
  E: 'The best way to destroy an enemy is to make them a friend.',
  S: 'Siblings teach us about fairness, cooperation, and unconditional love.',
};

// Animation stages for the result card
export const ANIMATION_STAGES = ['entry', 'icon', 'names', 'title', 'description', 'quote'] as const;
export const ANIMATION_DELAYS = [100, 250, 400, 550, 700, 850];
