import { getMatchingMusicTheme } from '@/config/sound';
import { create } from 'zustand';

export type TransitionSpeed = 'instant' | 'fast' | 'normal' | 'slow';

interface PreferencesState {
  isDarkTheme: boolean;
  animationsEnabled: boolean;
  isSoundEnabled: boolean; // Controls SFX
  isBGMEnabled: boolean; // Controls Background Music
  isHapticEnabled: boolean;
  volume: number;
  seasonalTheme:
    | 'auto'
    | 'default'
    | 'valentine'
    | 'holi'
    | 'onam'
    | 'halloween'
    | 'diwali'
    | 'christmas'
    | 'newYear'
    | 'pongal';
  musicTheme: 'auto' | 'default' | 'chill' | 'valentine' | 'halloween' | 'christmas';
  transitionSpeed: TransitionSpeed;
  hydrated: boolean;
}

interface PreferencesActions {
  toggleTheme: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  toggleBGM: () => void;
  toggleHaptic: () => void;
  setVolume: (volume: number) => void;
  setSeasonalTheme: (theme: PreferencesState['seasonalTheme']) => void;
  setMusicTheme: (theme: PreferencesState['musicTheme']) => void;
  setTransitionSpeed: (speed: TransitionSpeed) => void;
  init: () => void;
  cleanup: () => void;
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

// Module-level variable to store cleanup function (avoids global namespace pollution)
let themeCleanup: (() => void) | null = null;

export const usePreferencesStore = create<PreferencesState & PreferencesActions>((set) => ({
  isDarkTheme: false,
  animationsEnabled: true,
  isSoundEnabled: true,
  isBGMEnabled: true,
  isHapticEnabled: true,
  volume: 0.7,
  seasonalTheme: 'auto',
  musicTheme: 'auto',
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
  toggleBGM: () =>
    set((s) => {
      const value = !s.isBGMEnabled;
      safeLocalStorage.setItem('bgm', String(value));
      return { isBGMEnabled: value };
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
    set((state) => {
      safeLocalStorage.setItem('seasonalTheme', theme);
      // Auto-sync music theme when seasonal theme changes (if music theme is set to 'auto')
      if (state.musicTheme === 'auto' || theme !== 'auto') {
        const matchingMusicTheme = getMatchingMusicTheme(theme);
        safeLocalStorage.setItem('musicTheme', matchingMusicTheme);
        return { seasonalTheme: theme, musicTheme: matchingMusicTheme };
      }
      return { seasonalTheme: theme };
    }),
  setMusicTheme: (theme: PreferencesState['musicTheme']) =>
    set(() => {
      safeLocalStorage.setItem('musicTheme', theme);
      return { musicTheme: theme };
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
    const storedBGM = safeLocalStorage.getItem('bgm');
    const storedHaptic = safeLocalStorage.getItem('haptic');
    const storedVolume = safeLocalStorage.getItem('volume');
    const storedSeasonalTheme = safeLocalStorage.getItem('seasonalTheme');
    const storedMusicTheme = safeLocalStorage.getItem('musicTheme');
    const storedTransitionSpeed = safeLocalStorage.getItem('transitionSpeed');

    // Determine the actual theme that should be applied
    let isDarkTheme: boolean;

    if (storedTheme) {
      // If user has explicitly set a preference, use it
      isDarkTheme = storedTheme === 'dark';
    } else {
      // Check if inline script already set dark mode (system preference or first visit)
      // This syncs the store with what the inline script determined
      const hasInlineScriptSetDark = document.documentElement.classList.contains('dark');

      // If inline script didn't set dark mode, check system preference directly
      // This handles the case where inline script failed or wasn't run
      // Use short-circuit evaluation to avoid unnecessary matchMedia call
      isDarkTheme = hasInlineScriptSetDark || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Sync DOM with determined theme state
    // This ensures consistency even if inline script ran or failed
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    set({
      isDarkTheme,
      animationsEnabled: storedAnimations !== 'false',
      isSoundEnabled: storedSound !== 'false',
      isBGMEnabled: storedBGM !== 'false',
      isHapticEnabled: storedHaptic !== 'false',
      volume: storedVolume ? parseFloat(storedVolume) : 0.7,
      seasonalTheme: (storedSeasonalTheme as PreferencesState['seasonalTheme']) || 'auto',
      musicTheme: (storedMusicTheme as PreferencesState['musicTheme']) || 'auto',
      transitionSpeed: (storedTransitionSpeed as TransitionSpeed) || 'normal',
      hydrated: true,
    });

    // Listen for system preference changes (only if user hasn't set explicit preference)
    if (!storedTheme && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update if user still hasn't set an explicit preference
        const currentStoredTheme = safeLocalStorage.getItem('theme');
        if (!currentStoredTheme) {
          const newIsDark = e.matches;
          set({ isDarkTheme: newIsDark });

          if (newIsDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
          }
        }
      };

      // Helper to add/remove listener
      // Modern browsers (Chrome 76+, Firefox 67+, Safari 12.1+) support addEventListener
      const addListener = () => {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
      };

      const removeListener = () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };

      // Add listener
      addListener();

      // Store cleanup function reference (module-level to avoid global namespace pollution)
      themeCleanup = removeListener;
    }
  },
  cleanup: () => {
    // Clean up system preference listener (idempotent - safe to call multiple times)
    if (themeCleanup) {
      themeCleanup();
      themeCleanup = null;
    }
  },
}));
