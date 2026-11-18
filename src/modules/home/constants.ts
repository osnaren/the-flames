/**
 * Home Module Constants
 */

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
  NAMES_REVEAL: 940,
  STRIKE_DURATION: 460,
  COUNT_START: 390,
  COUNT_PER_LETTER: 165,
  FAST_COUNT: 135,
  ROUND_PAUSE: 220,
  RESULT_REVEAL: 420,
} as const;
