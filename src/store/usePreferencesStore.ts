import { create } from 'zustand';

interface PreferencesState {
  isDarkTheme: boolean;
  animationsEnabled: boolean;
  isSoundEnabled: boolean;
}

interface PreferencesActions {
  toggleTheme: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  init: () => void;
}

export const usePreferencesStore = create<PreferencesState & PreferencesActions>((set) => ({
  isDarkTheme: false,
  animationsEnabled: true,
  isSoundEnabled: true,
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
  init: () => {
    const storedTheme = localStorage.getItem('theme');
    const storedAnimations = localStorage.getItem('animations');
    const storedSound = localStorage.getItem('sound');

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
    });
  },
}));
