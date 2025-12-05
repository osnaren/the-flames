import { FlamesResultType } from '@/constants/flames';
import { FlamesResult, GlobalStats } from './types';

/**
 * Generates mock data for the GlobalCharts component
 */
export const generateMockData = (): GlobalStats => {
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

  // Generate recent matches
  const recentMatches = Array.from({ length: 10 }, () => {
    const result = [
      FlamesResultType.FRIEND,
      FlamesResultType.LOVE,
      FlamesResultType.AFFECTION,
      FlamesResultType.MARRIAGE,
      FlamesResultType.ENEMY,
      FlamesResultType.SIBLING,
    ][Math.floor(Math.random() * 6)] as FlamesResult;
    const countries = ['US', 'IN', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR'];
    return {
      result,
      country: countries[Math.floor(Math.random() * countries.length)],
      created_at: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    };
  });

  // Generate top countries
  const topCountries = [
    { country: 'IN', count: Math.floor(Math.random() * 5000) + 1000 },
    { country: 'US', count: Math.floor(Math.random() * 4000) + 800 },
    { country: 'GB', count: Math.floor(Math.random() * 3000) + 600 },
    { country: 'CA', count: Math.floor(Math.random() * 2000) + 400 },
    { country: 'AU', count: Math.floor(Math.random() * 1000) + 200 },
  ];

  return {
    totalMatches: Math.floor(Math.random() * 100000) + 50000,
    todayMatches: Math.floor(Math.random() * 5000) + 1000,
    resultStats,
    recentMatches,
    topCountries,
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

/**
 * Converts a country code to a flag emoji
 */
export const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌐';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

/**
 * Gets the full country name from a country code
 */
export const getCountryName = (countryCode: string): string => {
  if (!countryCode) return 'Global';
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(countryCode) || countryCode;
  } catch (_error) {
    return countryCode;
  }
};
