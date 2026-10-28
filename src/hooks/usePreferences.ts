'use client';

import { TransitionSpeed, usePreferencesStore } from '../store/usePreferencesStore';

interface Preferences {
  isDarkTheme: boolean;
  animationsEnabled: boolean;
  isSoundEnabled: boolean;
  transitionSpeed: TransitionSpeed;
  hydrated: boolean;
}

interface PreferenceActions {
  toggleTheme: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  setTransitionSpeed: (speed: TransitionSpeed) => void;
}

/**
 * Custom hook for managing user preferences with localStorage persistence
 */
export function usePreferences(): [Preferences, PreferenceActions] {
  const {
    isDarkTheme,
    animationsEnabled,
    isSoundEnabled,
    transitionSpeed,
    hydrated,
    toggleTheme,
    toggleAnimations,
    toggleSound,
    setTransitionSpeed,
  } = usePreferencesStore();

  // PreferencesInitializer owns hydration and the system-theme listener.
  // Consumers must not reload global state or tear down that listener.

  return [
    { isDarkTheme, animationsEnabled, isSoundEnabled, transitionSpeed, hydrated },
    { toggleTheme, toggleAnimations, toggleSound, setTransitionSpeed },
  ];
}
