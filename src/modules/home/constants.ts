/**
 * Home Module Constants
 */

// Stage timing configuration (in milliseconds)
export const STAGE_TIMINGS = {
  FORM_COLLAPSE: 800,
  COMMON_LETTERS_REVEAL: 1200,
  COMMON_LETTERS_STRIKE: 2000,
  FLAMES_ANIMATION_START: 500,
  FLAMES_ANIMATION_DURATION: 4000,
  RESULT_REVEAL_DELAY: 800,
} as const;

// FLAMES letters data for UI
export const FLAMES_LETTERS = [
  { char: 'F', emoji: '🤝', full: 'Friends', color: 'from-blue-500 to-cyan-500' },
  { char: 'L', emoji: '❤️', full: 'Love', color: 'from-pink-500 to-rose-500' },
  { char: 'A', emoji: '🥰', full: 'Affection', color: 'from-amber-500 to-orange-500' },
  { char: 'M', emoji: '💍', full: 'Marriage', color: 'from-emerald-500 to-green-500' },
  { char: 'E', emoji: '😤', full: 'Enemies', color: 'from-red-500 to-red-600' },
  { char: 'S', emoji: '👫', full: 'Siblings', color: 'from-purple-500 to-violet-500' },
] as const;

// FLAMES data with glow effects for processor
export const FLAMES_DATA = [
  { letter: 'F', full: 'Friends', emoji: '🤝', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59, 130, 246, 0.5)' },
  { letter: 'L', full: 'Love', emoji: '❤️', color: 'from-pink-500 to-rose-500', glow: 'rgba(236, 72, 153, 0.5)' },
  {
    letter: 'A',
    full: 'Affection',
    emoji: '🥰',
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.5)',
  },
  {
    letter: 'M',
    full: 'Marriage',
    emoji: '💍',
    color: 'from-emerald-500 to-green-500',
    glow: 'rgba(16, 185, 129, 0.5)',
  },
  { letter: 'E', full: 'Enemies', emoji: '😤', color: 'from-red-500 to-red-600', glow: 'rgba(239, 68, 68, 0.5)' },
  {
    letter: 'S',
    full: 'Siblings',
    emoji: '👫',
    color: 'from-purple-500 to-violet-500',
    glow: 'rgba(139, 92, 246, 0.5)',
  },
] as const;

// Animation timing for FlamesProcessor
export const PROCESSOR_TIMING = {
  NAMES_REVEAL: 600,
  STRIKE_DELAY: 400,
  STRIKE_DURATION: 800,
  COUNT_START: 300,
  COUNT_PER_LETTER: 200,
  RESULT_REVEAL: 500,
} as const;
