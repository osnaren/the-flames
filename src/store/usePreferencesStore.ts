import { create } from 'zustand';

export type TransitionSpeed = 'instant' | 'fast' | 'normal' | 'slow';

interface PreferencesState {
  isDarkTheme: boolean;
  animationsEnabled: boolean;
  isSoundEnabled: boolean;
  isHapticEnabled: boolean;
  volume: number;
  seasonalTheme: 'auto' | 'valentine' | 'halloween' | 'christmas' | 'default';
  transitionSpeed: TransitionSpeed;
  hydrated: boolean;
}

interface PreferencesActions {
  toggleTheme: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  setVolume: (volume: number) => void;
  setSeasonalTheme: (theme: PreferencesState['seasonalTheme']) => void;
  setTransitionSpeed: (speed: TransitionSpeed) => void;
  init: () => void;
}

// Transition duration mapping (in seconds)
export const TRANSITION_DURATIONS: Record<TransitionSpeed, number> = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.75,
};

// Helper to safely access localStorage (SSR-safe)
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors (e.g., quota exceeded, private browsing)
    }
  },
};

export const usePreferencesStore = create<PreferencesState & PreferencesActions>((set) => ({
  isDarkTheme: false,
  animationsEnabled: true,
  isSoundEnabled: true,
  isHapticEnabled: true,
  volume: 0.7,
  seasonalTheme: 'auto',
  transitionSpeed: 'slow',
  hydrated: false,
  toggleTheme: () =>
    set((s) => {
      const newTheme = !s.isDarkTheme;
      safeLocalStorage.setItem('theme', newTheme ? 'dark' : 'light');
      if (typeof document !== 'undefined') {
        if (newTheme) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
      return { isDarkTheme: newTheme };
    }),
  toggleAnimations: () =>
    set((s) => {
      const value = !s.animationsEnabled;
      safeLocalStorage.setItem('animations', String(value));
      return { animationsEnabled: value };
    }),
  toggleSound: () =>
    set((s) => {
      const value = !s.isSoundEnabled;
      safeLocalStorage.setItem('sound', String(value));
      return { isSoundEnabled: value };
    }),
  toggleHaptic: () =>
    set((s) => {
      const value = !s.isHapticEnabled;
      safeLocalStorage.setItem('haptic', String(value));
      return { isHapticEnabled: value };
    }),
  setVolume: (volume: number) =>
    set(() => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      safeLocalStorage.setItem('volume', String(clampedVolume));
      return { volume: clampedVolume };
    }),
  setSeasonalTheme: (theme: PreferencesState['seasonalTheme']) =>
    set(() => {
      safeLocalStorage.setItem('seasonalTheme', theme);
      return { seasonalTheme: theme };
    }),
  setTransitionSpeed: (speed: TransitionSpeed) =>
    set(() => {
      safeLocalStorage.setItem('transitionSpeed', speed);
      return { transitionSpeed: speed };
    }),
  init: () => {
    // Guard against SSR
    if (typeof window === 'undefined') return;

    const storedTheme = safeLocalStorage.getItem('theme');
    const storedAnimations = safeLocalStorage.getItem('animations');
    const storedSound = safeLocalStorage.getItem('sound');
    const storedHaptic = safeLocalStorage.getItem('haptic');
    const storedVolume = safeLocalStorage.getItem('volume');
    const storedSeasonalTheme = safeLocalStorage.getItem('seasonalTheme');
    const storedTransitionSpeed = safeLocalStorage.getItem('transitionSpeed');

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
      transitionSpeed: (storedTransitionSpeed as TransitionSpeed) || 'normal',
      hydrated: true,
    });
  },
}));
