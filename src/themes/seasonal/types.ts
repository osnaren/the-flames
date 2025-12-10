export type SeasonalTheme =
  | 'default'
  | 'valentine'
  | 'halloween'
  | 'christmas'
  | 'newYear'
  | 'diwali'
  | 'holi'
  | 'onam'
  | 'pongal';

export interface ThemeColors {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  accent: string;
  accentContainer: string;
  background: string;
  backgroundGradient: string[];
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  border: string;
}

// Particle shapes for all seasonal themes
export type ParticleShape =
  | 'circle'
  | 'heart'
  | 'star'
  | 'snowflake'
  | 'pumpkin'
  | 'bat'
  | 'flame'
  // New Year
  | 'firework'
  | 'confetti'
  | 'champagne'
  // Diwali
  | 'diya'
  | 'rangoli'
  | 'sparkler'
  // Holi
  | 'colorSplash'
  | 'gulal'
  | 'waterBalloon'
  // Onam
  | 'flower'
  | 'banana'
  | 'umbrella'
  // Pongal
  | 'sugarcane'
  | 'pot'
  | 'kolam'
  // Emoji-based particles (rendered as text)
  | 'emoji';

// Mapping of themes to their emojis for emoji particles
export const THEME_EMOJIS: Record<SeasonalTheme, string[]> = {
  default: ['🔥', '✨', '💫'],
  valentine: ['❤️', '💕', '💗', '💖', '🌹'],
  halloween: ['🎃', '🦇', '👻', '🕷️', '💀'],
  christmas: ['❄️', '🎄', '⭐', '🎁', '🔔'],
  newYear: ['🎆', '🎇', '✨', '🥂', '🎉'],
  diwali: ['🪔', '✨', '🎆', '🌟', '🎇'],
  holi: ['🎨', '💜', '💙', '💚', '💛', '🧡', '❤️'],
  onam: ['🌸', '🌺', '🌼', '🪷', '🌻'],
  pongal: ['🍯', '🌾', '☀️', '🪴', '🎍'],
};

export interface ParticleConfig {
  enabled: boolean;
  count: number;
  colors: string[];
  shapes: ParticleShape[];
  size: {
    min: number;
    max: number;
  };
  speed: {
    min: number;
    max: number;
  };
  opacity: {
    min: number;
    max: number;
  };
  direction: 'down' | 'up' | 'random' | 'swirl';
  animation: 'float' | 'fall' | 'sparkle' | 'pulse';
}

export interface BackgroundEffects {
  gradientAnimation: boolean;
  particleEffects: ParticleConfig;
  overlayPattern?: string;
  overlayOpacity?: number;
  glowEffects: boolean;
  pulsing: boolean;
}

export interface SoundTheme {
  background?: string;
  interactions: {
    click: string;
    hover: string;
    success: string;
    error: string;
  };
  gameEvents: {
    letterStrike: string;
    flamesCount: string;
    resultReveal: string;
    badgeUnlock: string;
  };
}

export interface SeasonalThemeConfig {
  id: SeasonalTheme;
  name: string;
  description: string;
  emoji: string; // For carousel display
  region?: 'global' | 'india' | 'western'; // Cultural region
  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  colors: ThemeColors;
  darkModeColors?: Partial<ThemeColors>; // Override colors for dark mode
  backgroundEffects: BackgroundEffects;
  soundTheme: SoundTheme;
  customCSS?: string;
  assets: {
    logo?: string;
    background?: string;
    patterns?: string[];
    icons?: Record<string, string>;
  };
}

export interface ThemeTransition {
  duration: number;
  easing: string;
  stagger: number;
}

export interface SeasonalThemeState {
  currentTheme: SeasonalTheme;
  isTransitioning: boolean;
  availableThemes: SeasonalTheme[];
  detectedTheme: SeasonalTheme;
  manualOverride: SeasonalTheme | null;
}
