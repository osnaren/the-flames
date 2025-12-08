'use client';

import { useEffect } from 'react';
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
    init,
  } = usePreferencesStore();

  // Load preferences from localStorage on mount
  useEffect(() => {
    init();
    
    // Capture cleanup function reference during setup to avoid stale reference
    const { cleanup } = usePreferencesStore.getState();
    
    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [init]);

  return [
    { isDarkTheme, animationsEnabled, isSoundEnabled, transitionSpeed, hydrated },
    { toggleTheme, toggleAnimations, toggleSound, setTransitionSpeed },
  ];
}
