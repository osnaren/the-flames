import { FlamesResult, GlobalStats } from './types';
import { FlamesResultType } from '@/constants/flames';

/**
 * Generates mock data for the GlobalCharts component
 */
export const generateMockData = (): GlobalStats => {
  // Popular names with realistic names from different cultures
  const names = [
    'Olivia',
    'Emma',
    'Ava',
    'Sophia',
    'Isabella',
    'Liam',
    'Noah',
    'Oliver',
    'Elijah',
    'William',
    'Aarav',
    'Arjun',
    'Reyansh',
    'Aanya',
    'Anaya',
    'Santiago',
    'Mateo',
    'Sofía',
    'Valentina',
    'Luna',
    'Mohammed',
    'Amir',
    'Yusuf',
    'Zahra',
    'Fatima',
  ];

  // Generate random popular names
  const popularNames = Array.from({ length: 10 }, (_, _i) => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    return {
      name: randomName,
      count: Math.floor(Math.random() * 1000) + 100,
      trend: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : -Math.floor(Math.random() * 15),
    };
  }).sort((a, b) => b.count - a.count);

  // Generate result statistics
  const resultStats = [
    {
      result: FlamesResultType.FRIEND as FlamesResult,
      count: Math.floor(Math.random() * 5000) + 1000,
      trend: Math.floor(Math.random() * 20) - 10,
    },
    {
      result: FlamesResultType.LOVE as FlamesResult,
      count: Math.floor(Math.random() * 5000) + 1000,
      trend: Math.floor(Math.random() * 20) - 10,
    },
    {
      result: FlamesResultType.AFFECTION as FlamesResult,
      count: Math.floor(Math.random() * 5000) + 1000,
      trend: Math.floor(Math.random() * 20) - 10,
    },
    {
      result: FlamesResultType.MARRIAGE as FlamesResult,
      count: Math.floor(Math.random() * 5000) + 1000,
      trend: Math.floor(Math.random() * 20) - 10,
    },
    {
      result: FlamesResultType.ENEMY as FlamesResult,
      count: Math.floor(Math.random() * 5000) + 1000,
      trend: Math.floor(Math.random() * 20) - 10,
    },
    {
      result: FlamesResultType.SIBLING as FlamesResult,
      count: Math.floor(Math.random() * 5000) + 1000,
      trend: Math.floor(Math.random() * 20) - 10,
    },
  ].sort((a, b) => b.count - a.count);

  // Generate popular pairs
  const popularPairs = Array.from({ length: 6 }, () => {
    const name1 = names[Math.floor(Math.random() * names.length)];
    const name2 = names[Math.floor(Math.random() * names.length)];
    const result = [
      FlamesResultType.FRIEND,
      FlamesResultType.LOVE,
      FlamesResultType.AFFECTION,
      FlamesResultType.MARRIAGE,
      FlamesResultType.ENEMY,
      FlamesResultType.SIBLING,
    ][Math.floor(Math.random() * 6)] as FlamesResult;
    return {
      name1,
      name2,
      result,
      count: Math.floor(Math.random() * 500) + 50,
    };
  }).sort((a, b) => b.count - a.count);

  return {
    totalMatches: Math.floor(Math.random() * 100000) + 50000,
    todayMatches: Math.floor(Math.random() * 5000) + 1000,
    popularNames,
    resultStats,
    popularPairs,
    regionalStats: null,
  };
};

/**
 * Returns a random tagline based on the top result
 */
export const getRandomTagline = (topResult: FlamesResult): string => {
  const taglines = {
    [FlamesResultType.FRIEND]: [
      '👯 Friendship is trending today!',
      "🤝 Everyone's finding their bestie!",
      '👋 High-fives all around!',
    ],
    [FlamesResultType.LOVE]: [
      '💖 Love is in the air!',
      '💘 Cupid is working overtime today!',
      '💕 Romance is trending hard!',
    ],
    [FlamesResultType.AFFECTION]: [
      '✨ Affection is sparkling today!',
      '🌟 Stars are aligning for sweet connections!',
      '💫 Affectionate vibes are peaking!',
    ],
    [FlamesResultType.MARRIAGE]: [
      '💍 Wedding bells are ringing worldwide!',
      '👰 Time to buy wedding gifts!',
      '🎂 Marriage proposals spiking today!',
    ],
    [FlamesResultType.ENEMY]: [
      "😬 It's a rough day for relationships...",
      '🔥 Enemies are being made today!',
      '⚔️ Rivalry is trending hard!',
    ],
    [FlamesResultType.SIBLING]: [
      '👪 Family vibes are strong today!',
      '👯‍♂️ Sibling energy is peaking!',
      '🧬 DNA connections trending up!',
    ],
  };

  const options = taglines[topResult];
  return options[Math.floor(Math.random() * options.length)];
};
