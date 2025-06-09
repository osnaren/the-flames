import { FlamesResult, GlobalStats } from './types';

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
  const popularNames = Array.from({ length: 10 }, (_, i) => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    return {
      name: randomName,
      count: Math.floor(Math.random() * 1000) + 100,
      trend: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : -Math.floor(Math.random() * 15),
    };
  }).sort((a, b) => b.count - a.count);

  // Generate result statistics
  const resultStats = [
    { result: 'F', count: Math.floor(Math.random() * 5000) + 1000, trend: Math.floor(Math.random() * 20) - 10 },
    { result: 'L', count: Math.floor(Math.random() * 5000) + 1000, trend: Math.floor(Math.random() * 20) - 10 },
    { result: 'A', count: Math.floor(Math.random() * 5000) + 1000, trend: Math.floor(Math.random() * 20) - 10 },
    { result: 'M', count: Math.floor(Math.random() * 5000) + 1000, trend: Math.floor(Math.random() * 20) - 10 },
    { result: 'E', count: Math.floor(Math.random() * 5000) + 1000, trend: Math.floor(Math.random() * 20) - 10 },
    { result: 'S', count: Math.floor(Math.random() * 5000) + 1000, trend: Math.floor(Math.random() * 20) - 10 },
  ].sort((a, b) => b.count - a.count);

  // Generate popular pairs
  const popularPairs = Array.from({ length: 6 }, () => {
    const name1 = names[Math.floor(Math.random() * names.length)];
    const name2 = names[Math.floor(Math.random() * names.length)];
    const result = ['F', 'L', 'A', 'M', 'E', 'S'][Math.floor(Math.random() * 6)] as FlamesResult;
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
  };
};

/**
 * Returns a random tagline based on the top result
 */
export const getRandomTagline = (topResult: FlamesResult): string => {
  const taglines = {
    F: ['👯 Friendship is trending today!', "🤝 Everyone's finding their bestie!", '👋 High-fives all around!'],
    L: ['💖 Love is in the air!', '💘 Cupid is working overtime today!', '💕 Romance is trending hard!'],
    A: [
      '✨ Affection is sparkling today!',
      '🌟 Stars are aligning for sweet connections!',
      '💫 Affectionate vibes are peaking!',
    ],
    M: [
      '💍 Wedding bells are ringing worldwide!',
      '👰 Time to buy wedding gifts!',
      '🎂 Marriage proposals spiking today!',
    ],
    E: ["😬 It's a rough day for relationships...", '🔥 Enemies are being made today!', '⚔️ Rivalry is trending hard!'],
    S: ['👪 Family vibes are strong today!', '👯‍♂️ Sibling energy is peaking!', '🧬 DNA connections trending up!'],
  };

  const options = taglines[topResult];
  return options[Math.floor(Math.random() * options.length)];
};
