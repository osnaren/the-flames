import { useState, useEffect } from 'react';

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
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedAnimations = localStorage.getItem('animations');
    const storedSound = localStorage.getItem('sound');

    if (storedTheme) setIsDarkTheme(storedTheme === 'dark');
    if (storedAnimations) setAnimationsEnabled(storedAnimations === 'true');
    if (storedSound) setIsSoundEnabled(storedSound === 'true');

    // Initialize dark mode if needed
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle theme and update DOM and localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle animations and update localStorage
  const toggleAnimations = () => {
    const newAnimations = !animationsEnabled;
    setAnimationsEnabled(newAnimations);
    localStorage.setItem('animations', String(newAnimations));
  };

  // Toggle sound and update localStorage
  const toggleSound = () => {
    const newSound = !isSoundEnabled;
    setIsSoundEnabled(newSound);
    localStorage.setItem('sound', String(newSound));
  };

  return [
    { isDarkTheme, animationsEnabled, isSoundEnabled },
    { toggleTheme, toggleAnimations, toggleSound }
  ];
}