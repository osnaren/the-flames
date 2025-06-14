import { create } from 'zustand';

interface PreferencesState {
  isDarkTheme: boolean;
  animationsEnabled: boolean;
  isSoundEnabled: boolean;
  isHapticEnabled: boolean;
  volume: number;
  seasonalTheme: 'auto' | 'valentine' | 'halloween' | 'christmas' | 'default';
}

interface PreferencesActions {
  toggleTheme: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  setVolume: (volume: number) => void;
  setSeasonalTheme: (theme: PreferencesState['seasonalTheme']) => void;
  init: () => void;
}

export const usePreferencesStore = create<PreferencesState & PreferencesActions>((set) => ({
  isDarkTheme: false,
  animationsEnabled: true,
  isSoundEnabled: true,
  isHapticEnabled: true,
  volume: 0.7,
  seasonalTheme: 'auto',
  toggleTheme: () =>
    set((s) => {
      const newTheme = !s.isDarkTheme;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      if (newTheme) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      return { isDarkTheme: newTheme };
    }),
  toggleAnimations: () =>
    set((s) => {
      const value = !s.animationsEnabled;
      localStorage.setItem('animations', String(value));
      return { animationsEnabled: value };
    }),
  toggleSound: () =>
    set((s) => {
      const value = !s.isSoundEnabled;
      localStorage.setItem('sound', String(value));
      return { isSoundEnabled: value };
    }),
  toggleHaptic: () =>
    set((s) => {
      const value = !s.isHapticEnabled;
      localStorage.setItem('haptic', String(value));
      return { isHapticEnabled: value };
    }),
  setVolume: (volume: number) =>
    set(() => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      localStorage.setItem('volume', String(clampedVolume));
      return { volume: clampedVolume };
    }),
  setSeasonalTheme: (theme: PreferencesState['seasonalTheme']) =>
    set(() => {
      localStorage.setItem('seasonalTheme', theme);
      return { seasonalTheme: theme };
    }),
  init: () => {
    const storedTheme = localStorage.getItem('theme');
    const storedAnimations = localStorage.getItem('animations');
    const storedSound = localStorage.getItem('sound');
    const storedHaptic = localStorage.getItem('haptic');
    const storedVolume = localStorage.getItem('volume');
    const storedSeasonalTheme = localStorage.getItem('seasonalTheme');

    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    set({
      isDarkTheme: storedTheme === 'dark',
      animationsEnabled: storedAnimations !== 'false',
      isSoundEnabled: storedSound !== 'false',
      isHapticEnabled: storedHaptic !== 'false',
      volume: storedVolume ? parseFloat(storedVolume) : 0.7,
      seasonalTheme: (storedSeasonalTheme as PreferencesState['seasonalTheme']) || 'auto',
    });
  },
}));
