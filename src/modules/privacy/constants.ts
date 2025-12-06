/**
 * Privacy & Terms constants
 */

export const FLAMES_DATA = [
  { letter: 'F', meaning: 'Friends', color: 'from-blue-500 to-blue-600' },
  { letter: 'L', meaning: 'Love', color: 'from-pink-500 to-rose-600' },
  { letter: 'A', meaning: 'Affection', color: 'from-purple-500 to-violet-600' },
  { letter: 'M', meaning: 'Marriage', color: 'from-orange-500 to-amber-600' },
  { letter: 'E', meaning: 'Enemy', color: 'from-red-500 to-red-600' },
  { letter: 'S', meaning: 'Siblings', color: 'from-gray-500 to-slate-600' },
];

export const SECTION_COLORS = {
  collect: 'from-blue-500 to-cyan-500',
  dontCollect: 'from-green-500 to-emerald-500',
  usage: 'from-yellow-500 to-orange-500',
  cookies: 'from-amber-500 to-yellow-500',
  security: 'from-purple-500 to-violet-500',
  thirdParty: 'from-teal-500 to-cyan-500',
  whatIs: 'from-pink-500 to-rose-500',
  conduct: 'from-indigo-500 to-blue-500',
  ip: 'from-violet-500 to-purple-500',
  sharing: 'from-rose-500 to-pink-500',
  age: 'from-emerald-500 to-green-500',
  disclaimer: 'from-red-500 to-rose-500',
} as const;
