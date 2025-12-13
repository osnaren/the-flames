// Seasonal Themes Module
// Export types, hook, and configs from a single point

export type {
  BackgroundEffects,
  ParticleConfig,
  ParticleShape,
  SeasonalTheme,
  SeasonalThemeConfig,
  SeasonalThemeState,
  SoundTheme,
  ThemeColors,
  ThemeTransition,
} from './types';

export { useSeasonalTheme } from './useSeasonalTheme';

export {
  christmasTheme,
  defaultTheme,
  diwaliTheme,
  halloweenTheme,
  holiTheme,
  newYearTheme,
  onamTheme,
  pongalTheme,
  valentineTheme,
} from './configs';
