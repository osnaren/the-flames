import type { ParticleConfig, SeasonalThemeConfig, ThemeColors } from '../types';

interface ThemeSeed {
  id: SeasonalThemeConfig['id'];
  name: string;
  description: string;
  emoji: string;
  region: SeasonalThemeConfig['region'];
  dateRange: SeasonalThemeConfig['dateRange'];
  palette: { primary: string; secondary: string; accent: string; background: string; text: string };
  dark: { primary: string; secondary: string; accent: string; background: string; surface: string };
  particles: Partial<ParticleConfig> & Pick<ParticleConfig, 'colors' | 'shapes'>;
}

/** Builds a full theme config from a compact palette so new themes stay consistent. */
function createTheme(seed: ThemeSeed): SeasonalThemeConfig {
  const { palette, dark } = seed;
  const colors: ThemeColors = {
    primary: palette.primary,
    primaryContainer: `${palette.primary}1f`,
    secondary: palette.secondary,
    secondaryContainer: `${palette.secondary}1f`,
    accent: palette.accent,
    accentContainer: `${palette.accent}1f`,
    background: palette.background,
    backgroundGradient: [
      `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 50%, ${palette.accent} 100%)`,
      `linear-gradient(45deg, ${palette.background} 0%, #ffffff 100%)`,
    ],
    surface: '#FFFFFF',
    surfaceVariant: palette.background,
    text: palette.text,
    textSecondary: `${palette.text}b3`,
    border: palette.primary,
  };

  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    emoji: seed.emoji,
    region: seed.region,
    dateRange: seed.dateRange,
    colors,
    darkModeColors: {
      primary: dark.primary,
      secondary: dark.secondary,
      accent: dark.accent,
      background: dark.background,
      surface: dark.surface,
      border: dark.primary,
    },
    backgroundEffects: {
      gradientAnimation: true,
      particleEffects: {
        enabled: true,
        count: 36,
        size: { min: 6, max: 16 },
        speed: { min: 0.3, max: 1.2 },
        opacity: { min: 0.45, max: 0.9 },
        direction: 'down',
        animation: 'float',
        ...seed.particles,
      },
      glowEffects: true,
      pulsing: false,
    },
  };
}

export const lunarNewYearTheme = createTheme({
  id: 'lunarNewYear',
  name: 'Lunar New Year',
  description: 'Red lanterns, gold coins and blossoms for the Spring Festival',
  emoji: '🏮',
  region: 'global',
  dateRange: { start: { month: 1, day: 28 }, end: { month: 2, day: 12 } },
  palette: { primary: '#D7263D', secondary: '#F4B400', accent: '#FF6F61', background: '#FFF6F0', text: '#3B0A0A' },
  dark: { primary: '#FF5A6E', secondary: '#FFD54F', accent: '#FF8A80', background: '#1A0707', surface: '#2A0E0E' },
  particles: {
    colors: ['#D7263D', '#F4B400', '#FFD54F', '#FF6F61'],
    shapes: ['emoji', 'circle', 'star'],
    direction: 'down',
    animation: 'float',
  },
});

export const eidTheme = createTheme({
  id: 'eid',
  name: 'Eid',
  description: 'Crescent moons, glowing lanterns and starry evenings',
  emoji: '🌙',
  region: 'global',
  dateRange: { start: { month: 3, day: 25 }, end: { month: 4, day: 2 } },
  palette: { primary: '#0F766E', secondary: '#C9A227', accent: '#6D28D9', background: '#F3FBF8', text: '#06302C' },
  dark: { primary: '#2DD4BF', secondary: '#FCD34D', accent: '#A78BFA', background: '#03120F', surface: '#0B231F' },
  particles: {
    colors: ['#FCD34D', '#FDE68A', '#2DD4BF', '#FFFFFF'],
    shapes: ['star', 'emoji', 'circle'],
    direction: 'random',
    animation: 'sparkle',
    size: { min: 3, max: 12 },
  },
});

export const rakhiTheme = createTheme({
  id: 'rakhi',
  name: 'Raksha Bandhan',
  description: 'Threads of love between siblings, marigolds and sweets',
  emoji: '🪢',
  region: 'india',
  dateRange: { start: { month: 8, day: 8 }, end: { month: 8, day: 18 } },
  palette: { primary: '#E11D74', secondary: '#F59E0B', accent: '#16A34A', background: '#FFF7F2', text: '#3D0C1E' },
  dark: { primary: '#F472B6', secondary: '#FBBF24', accent: '#4ADE80', background: '#170812', surface: '#26101D' },
  particles: {
    colors: ['#F59E0B', '#E11D74', '#FBBF24', '#F97316'],
    shapes: ['flower', 'emoji', 'circle'],
    direction: 'down',
    animation: 'float',
  },
});

export const friendshipTheme = createTheme({
  id: 'friendship',
  name: 'Friendship Day',
  description: 'Friendship bands, balloons and sunny good vibes',
  emoji: '🤝',
  region: 'global',
  dateRange: { start: { month: 8, day: 1 }, end: { month: 8, day: 7 } },
  palette: { primary: '#2563EB', secondary: '#F59E0B', accent: '#10B981', background: '#F5F9FF', text: '#0B1B3F' },
  dark: { primary: '#60A5FA', secondary: '#FCD34D', accent: '#34D399', background: '#060D1C', surface: '#0E1A33' },
  particles: {
    colors: ['#2563EB', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'],
    shapes: ['confetti', 'emoji', 'star'],
    direction: 'up',
    animation: 'float',
  },
});

export const springTheme = createTheme({
  id: 'spring',
  name: 'Spring Blossom',
  description: 'Cherry blossoms drifting on a soft spring breeze',
  emoji: '🌸',
  region: 'global',
  dateRange: { start: { month: 3, day: 25 }, end: { month: 4, day: 25 } },
  palette: { primary: '#EC4899', secondary: '#84CC16', accent: '#F9A8D4', background: '#FFF5F9', text: '#3F0D25' },
  dark: { primary: '#F9A8D4', secondary: '#A3E635', accent: '#FBCFE8', background: '#160810', surface: '#25111C' },
  particles: {
    colors: ['#F9A8D4', '#FBCFE8', '#F472B6', '#FFFFFF'],
    shapes: ['flower', 'emoji'],
    direction: 'swirl',
    animation: 'float',
    speed: { min: 0.4, max: 1.1 },
  },
});

export const monsoonTheme = createTheme({
  id: 'monsoon',
  name: 'Monsoon',
  description: 'Rain on the window, chai and paper boats',
  emoji: '🌧️',
  region: 'india',
  dateRange: { start: { month: 7, day: 1 }, end: { month: 7, day: 28 } },
  palette: { primary: '#0E7490', secondary: '#4F46E5', accent: '#22C55E', background: '#F1F8FA', text: '#062B36' },
  dark: { primary: '#22D3EE', secondary: '#818CF8', accent: '#4ADE80', background: '#03121A', surface: '#0A1F29' },
  particles: {
    colors: ['#67E8F9', '#A5F3FC', '#93C5FD', '#E0F2FE'],
    shapes: ['circle', 'emoji'],
    direction: 'down',
    animation: 'fall',
    size: { min: 2, max: 6 },
    speed: { min: 3, max: 6 },
    count: 60,
  },
});

export const autumnTheme = createTheme({
  id: 'autumn',
  name: 'Autumn',
  description: 'Falling maple leaves in amber, rust and gold',
  emoji: '🍂',
  region: 'global',
  dateRange: { start: { month: 10, day: 3 }, end: { month: 10, day: 22 } },
  palette: { primary: '#C2410C', secondary: '#B45309', accent: '#A16207', background: '#FFF8F1', text: '#3B1405' },
  dark: { primary: '#FB923C', secondary: '#FBBF24', accent: '#FDE047', background: '#140A04', surface: '#24140B' },
  particles: {
    colors: ['#C2410C', '#EA580C', '#D97706', '#CA8A04', '#9A3412'],
    shapes: ['emoji', 'flower'],
    direction: 'swirl',
    animation: 'fall',
    speed: { min: 0.5, max: 1.4 },
  },
});
