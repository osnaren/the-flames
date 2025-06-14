export type SeasonalTheme = 'valentine' | 'halloween' | 'christmas' | 'default';

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

export interface ParticleConfig {
  enabled: boolean;
  count: number;
  colors: string[];
  shapes: ('circle' | 'heart' | 'star' | 'snowflake' | 'pumpkin' | 'bat')[];
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
  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  colors: ThemeColors;
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
