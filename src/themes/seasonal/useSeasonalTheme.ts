import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { christmasTheme } from './configs/christmas';
import { defaultTheme } from './configs/default';
import { halloweenTheme } from './configs/halloween';
import { valentineTheme } from './configs/valentine';
import { SeasonalTheme, SeasonalThemeConfig, SeasonalThemeState } from './types';

// All available themes
const THEME_CONFIGS: Record<SeasonalTheme, SeasonalThemeConfig> = {
  valentine: valentineTheme,
  halloween: halloweenTheme,
  christmas: christmasTheme,
  default: defaultTheme,
};

// Theme order for detection (checked in order)
const SEASONAL_THEMES: SeasonalTheme[] = ['valentine', 'halloween', 'christmas'];

export function useSeasonalTheme() {
  const { seasonalTheme: preferenceTheme, setSeasonalTheme } = usePreferencesStore();

  const [state, setState] = useState<SeasonalThemeState>({
    currentTheme: 'default',
    isTransitioning: false,
    availableThemes: ['default', 'valentine', 'halloween', 'christmas'],
    detectedTheme: 'default',
    manualOverride: null,
  });

  // Detect current seasonal theme based on date
  const detectCurrentTheme = useCallback((): SeasonalTheme => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const currentDay = now.getDate();

    for (const themeId of SEASONAL_THEMES) {
      const theme = THEME_CONFIGS[themeId];
      const { start, end } = theme.dateRange;

      // Check if current date falls within theme range
      if (
        (currentMonth === start.month && currentDay >= start.day) ||
        (currentMonth === end.month && currentDay <= end.day) ||
        (currentMonth > start.month && currentMonth < end.month) ||
        // Handle year wrapping (e.g., Christmas theme ending in January)
        (start.month > end.month && (currentMonth >= start.month || currentMonth <= end.month))
      ) {
        return themeId;
      }
    }

    return 'default';
  }, []);

  // Get current theme configuration
  const currentThemeConfig = useMemo(() => THEME_CONFIGS[state.currentTheme], [state.currentTheme]);

  // Apply theme to DOM
  const applyTheme = useCallback((theme: SeasonalThemeConfig) => {
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle gradient arrays
        value.forEach((gradient, index) => {
          root.style.setProperty(`--theme-${key}-${index}`, gradient);
        });
      } else {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Apply theme class to body
    document.body.className = document.body.className
      .replace(/\b\w+-theme\b/g, '') // Remove existing theme classes
      .trim();
    document.body.classList.add(`${theme.id}-theme`);

    // Inject custom CSS if provided
    if (theme.customCSS) {
      let styleElement = document.getElementById('seasonal-theme-styles');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'seasonal-theme-styles';
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = theme.customCSS;
    }

    // Set theme meta tag for browser chrome
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', theme.colors.primary);
  }, []);

  // Transition to new theme
  const transitionToTheme = useCallback(
    async (newTheme: SeasonalTheme) => {
      setState((prev) => ({ ...prev, isTransitioning: true }));

      try {
        // Add transition class
        document.body.classList.add('theme-transitioning');

        // Apply new theme after short delay
        setTimeout(() => {
          applyTheme(THEME_CONFIGS[newTheme]);
          setState((prev) => ({
            ...prev,
            currentTheme: newTheme,
            isTransitioning: false,
          }));

          // Remove transition class
          setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
          }, 300);
        }, 150);
      } catch (error) {
        console.error('Theme transition failed:', error);
        setState((prev) => ({ ...prev, isTransitioning: false }));
      }
    },
    [applyTheme]
  );

  // Set manual theme override
  const setManualTheme = useCallback(
    (theme: SeasonalTheme | null) => {
      setState((prev) => ({ ...prev, manualOverride: theme }));
      setSeasonalTheme(theme || 'auto');

      if (theme) {
        transitionToTheme(theme);
      } else {
        // Reset to detected theme
        const detectedTheme = detectCurrentTheme();
        transitionToTheme(detectedTheme);
      }
    },
    [transitionToTheme, detectCurrentTheme, setSeasonalTheme]
  );

  // Initialize theme on mount and update when preferences change
  useEffect(() => {
    const detectedTheme = detectCurrentTheme();
    setState((prev) => ({ ...prev, detectedTheme }));

    let targetTheme: SeasonalTheme;

    if (preferenceTheme === 'auto') {
      targetTheme = detectedTheme;
      setState((prev) => ({ ...prev, manualOverride: null }));
    } else {
      targetTheme = preferenceTheme;
      setState((prev) => ({ ...prev, manualOverride: preferenceTheme }));
    }

    // Apply theme if different from current
    if (targetTheme !== state.currentTheme) {
      transitionToTheme(targetTheme);
    } else {
      // Ensure theme is applied even if same (for initial load)
      applyTheme(THEME_CONFIGS[targetTheme]);
    }
  }, [preferenceTheme, detectCurrentTheme, transitionToTheme, applyTheme]);

  // Check for theme changes periodically (every hour)
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (preferenceTheme === 'auto') {
          const newDetectedTheme = detectCurrentTheme();
          if (newDetectedTheme !== state.detectedTheme) {
            setState((prev) => ({ ...prev, detectedTheme: newDetectedTheme }));
            transitionToTheme(newDetectedTheme);
          }
        }
      },
      60 * 60 * 1000
    ); // Check every hour

    return () => clearInterval(interval);
  }, [preferenceTheme, state.detectedTheme, detectCurrentTheme, transitionToTheme]);

  // Utility functions
  const getThemeConfig = useCallback((themeId: SeasonalTheme) => {
    return THEME_CONFIGS[themeId];
  }, []);

  const getAvailableThemes = useCallback(() => {
    return Object.values(THEME_CONFIGS).map((theme) => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      isActive: theme.id === state.currentTheme,
      isDetected: theme.id === state.detectedTheme,
    }));
  }, [state.currentTheme, state.detectedTheme]);

  const isThemeActive = useCallback(
    (themeId: SeasonalTheme) => {
      return state.currentTheme === themeId;
    },
    [state.currentTheme]
  );

  const preloadThemeAssets = useCallback(async (themeId: SeasonalTheme) => {
    const theme = THEME_CONFIGS[themeId];
    const assets = theme.assets;

    const preloadPromises: Promise<void>[] = [];

    // Preload images
    if (assets.background) {
      preloadPromises.push(
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't fail if image doesn't load
          img.src = assets.background!;
        })
      );
    }

    // Preload patterns
    if (assets.patterns) {
      assets.patterns.forEach((pattern) => {
        preloadPromises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = pattern;
          })
        );
      });
    }

    try {
      await Promise.all(preloadPromises);
    } catch (error) {
      console.warn(`Failed to preload assets for theme ${themeId}:`, error);
    }
  }, []);

  // Preload next likely theme
  useEffect(() => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Determine what theme might be next
    const nextTheme = SEASONAL_THEMES.find((themeId) => {
      const theme = THEME_CONFIGS[themeId];
      const { start } = theme.dateRange;
      return nextMonth.getMonth() + 1 === start.month;
    });

    if (nextTheme && nextTheme !== state.currentTheme) {
      preloadThemeAssets(nextTheme);
    }
  }, [state.currentTheme, preloadThemeAssets]);

  return {
    // Current state
    currentTheme: state.currentTheme,
    currentThemeConfig,
    isTransitioning: state.isTransitioning,
    detectedTheme: state.detectedTheme,
    manualOverride: state.manualOverride,

    // Actions
    setManualTheme,
    transitionToTheme,

    // Utilities
    getThemeConfig,
    getAvailableThemes,
    isThemeActive,
    preloadThemeAssets,

    // Theme configs
    themes: THEME_CONFIGS,
  };
}
