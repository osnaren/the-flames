'use client';

import { usePreferencesStore } from '@/store/usePreferencesStore';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { detectSeasonalTheme } from './calendar';
import {
  autumnTheme,
  christmasTheme,
  defaultTheme,
  diwaliTheme,
  eidTheme,
  friendshipTheme,
  halloweenTheme,
  holiTheme,
  lunarNewYearTheme,
  monsoonTheme,
  newYearTheme,
  onamTheme,
  pongalTheme,
  rakhiTheme,
  springTheme,
  valentineTheme,
} from './configs';
import { SeasonalTheme, SeasonalThemeConfig, SeasonalThemeState } from './types';

// All available themes
const THEME_CONFIGS: Record<SeasonalTheme, SeasonalThemeConfig> = {
  default: defaultTheme,
  valentine: valentineTheme,
  holi: holiTheme,
  onam: onamTheme,
  halloween: halloweenTheme,
  diwali: diwaliTheme,
  christmas: christmasTheme,
  newYear: newYearTheme,
  pongal: pongalTheme,
  lunarNewYear: lunarNewYearTheme,
  eid: eidTheme,
  rakhi: rakhiTheme,
  friendship: friendshipTheme,
  spring: springTheme,
  monsoon: monsoonTheme,
  autumn: autumnTheme,
};

export const SEASONAL_THEME_IDS = Object.keys(THEME_CONFIGS) as SeasonalTheme[];

function useSeasonalThemeController() {
  const preferenceTheme = usePreferencesStore((state) => state.seasonalTheme);
  const setSeasonalTheme = usePreferencesStore((state) => state.setSeasonalTheme);
  const isDarkTheme = usePreferencesStore((state) => state.isDarkTheme);

  const [state, setState] = useState<SeasonalThemeState>({
    currentTheme: 'default',
    isTransitioning: false,
    availableThemes: SEASONAL_THEME_IDS,
    detectedTheme: 'default',
    manualOverride: null,
  });

  // Detect the current festival or season from the festival calendar.
  const detectCurrentTheme = useCallback((): SeasonalTheme => detectSeasonalTheme(new Date()), []);

  // Get current theme configuration
  const currentThemeConfig = useMemo(() => THEME_CONFIGS[state.currentTheme], [state.currentTheme]);

  // Apply theme to DOM
  const applyTheme = useCallback((theme: SeasonalThemeConfig, isDark?: boolean) => {
    const root = document.documentElement;

    // Merge base colors with dark mode overrides if applicable
    const effectiveColors =
      isDark && theme.darkModeColors ? { ...theme.colors, ...theme.darkModeColors } : theme.colors;

    // Apply CSS custom properties
    Object.entries(effectiveColors).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle gradient arrays
        value.forEach((gradient, index) => {
          root.style.setProperty(`--theme-${key}-${index}`, gradient);
        });
      } else {
        if (root.style.getPropertyValue(`--theme-${key}`) !== value) root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Apply theme class to body
    if (!document.body.classList.contains(`${theme.id}-theme`)) {
      document.body.className = document.body.className.replace(/\b\w+-theme\b/g, '').trim();
      document.body.classList.add(`${theme.id}-theme`);
    }

    // Inject custom CSS if provided
    if (theme.customCSS) {
      let styleElement = document.getElementById('seasonal-theme-styles');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'seasonal-theme-styles';
        document.head.appendChild(styleElement);
      }
      if (styleElement.textContent !== theme.customCSS) styleElement.textContent = theme.customCSS;
    } else {
      document.getElementById('seasonal-theme-styles')?.remove();
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
    (newTheme: SeasonalTheme) => {
      applyTheme(THEME_CONFIGS[newTheme], usePreferencesStore.getState().isDarkTheme);
      setState((prev) => ({ ...prev, currentTheme: newTheme, isTransitioning: false }));
    },
    [applyTheme]
  );

  // Set manual theme override
  const setManualTheme = useCallback(
    (theme: SeasonalTheme | null) => {
      setSeasonalTheme(theme || 'auto');
    },
    [setSeasonalTheme]
  );

  // Initialize theme on mount and update when preferences change
  useEffect(() => {
    const detectedTheme = detectCurrentTheme();

    const targetTheme = preferenceTheme === 'auto' ? detectedTheme : preferenceTheme;
    const manualOverride = preferenceTheme === 'auto' ? null : preferenceTheme;
    setState((prev) =>
      prev.currentTheme === targetTheme &&
      prev.detectedTheme === detectedTheme &&
      prev.manualOverride === manualOverride
        ? prev
        : { ...prev, currentTheme: targetTheme, detectedTheme, manualOverride }
    );
    applyTheme(THEME_CONFIGS[targetTheme], isDarkTheme);
  }, [preferenceTheme, detectCurrentTheme, applyTheme, isDarkTheme]);

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
    const assets = theme.assets ?? {};

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
    } catch {
      // Asset preload failed, continue without preloaded assets
    }
  }, []);

  return useMemo(
    () => ({
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
    }),
    [
      state,
      currentThemeConfig,
      setManualTheme,
      transitionToTheme,
      getThemeConfig,
      getAvailableThemes,
      isThemeActive,
      preloadThemeAssets,
    ]
  );
}

const SeasonalThemeContext = createContext<ReturnType<typeof useSeasonalThemeController> | null>(null);

/** One controller owns document styles; consumers share its state and timers. */
export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSeasonalThemeController();
  return <SeasonalThemeContext.Provider value={theme}>{children}</SeasonalThemeContext.Provider>;
}

export function useSeasonalTheme() {
  const theme = useContext(SeasonalThemeContext);
  if (!theme) throw new Error('SeasonalThemeProvider is required');
  return theme;
}
