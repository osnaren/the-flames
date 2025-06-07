import { useEffect } from 'react';
import { usePreferencesStore } from '../store/usePreferencesStore';

interface Preferences {
  isDarkTheme: boolean;
  animationsEnabled: boolean;
  isSoundEnabled: boolean;
}

interface PreferenceActions {
  toggleTheme: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
}

/**
 * Custom hook for managing user preferences with localStorage persistence
 */
export function usePreferences(): [Preferences, PreferenceActions] {
  const { isDarkTheme, animationsEnabled, isSoundEnabled, toggleTheme, toggleAnimations, toggleSound, init } =
    usePreferencesStore();

  // Load preferences from localStorage on mount
  useEffect(() => {
    init();
  }, [init]);

  return [
    { isDarkTheme, animationsEnabled, isSoundEnabled },
    { toggleTheme, toggleAnimations, toggleSound },
  ];
}
