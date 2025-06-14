import { useCallback, useEffect } from 'react';

import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { useHapticFeedback } from './useHapticFeedback';
import { usePairingHistory } from './usePairingHistory';
import { useSoundEffects } from './useSoundEffects';

/**
 * Comprehensive integration hook that combines all game systems
 * Provides unified methods for game events with sound, haptic, and visual feedback
 */
export function useGameIntegration() {
  const { playSound, playSoundSequence } = useSoundEffects();
  const { hapticFeedback, triggerHapticSequence } = useHapticFeedback();
  const { getNewlyUnlockedBadges } = usePairingHistory();
  const { currentThemeConfig } = useSeasonalTheme();

  // Form submission with feedback
  const handleFormSubmit = useCallback(async () => {
    await Promise.all([playSound('formSubmit'), hapticFeedback.tap()]);
  }, [playSound, hapticFeedback]);

  // Letter striking animation with feedback
  const handleLetterStrike = useCallback(
    async (letterIndex: number, totalLetters: number) => {
      const delay = letterIndex * 100; // Stagger the feedback

      await Promise.all([playSound('letterStrike', { delay }), hapticFeedback.letterStrike()]);
    },
    [playSound, hapticFeedback]
  );

  // FLAMES counting with progressive feedback
  const handleFlamesCounting = useCallback(
    async (currentStep: number, totalSteps: number) => {
      const intensity = Math.min(1, currentStep / totalSteps);

      await Promise.all([
        playSound('flamesCount', {
          playbackRate: 0.8 + intensity * 0.4, // Speed up as we progress
          volume: 0.3 + intensity * 0.4,
        }),
        hapticFeedback.counting(),
      ]);
    },
    [playSound, hapticFeedback]
  );

  // Result reveal with celebration
  const handleResultReveal = useCallback(
    async (result: string) => {
      // Determine celebration intensity based on result
      const celebrationMap: Record<string, 'celebration' | 'success' | 'notification'> = {
        L: 'celebration', // Love gets full celebration
        M: 'celebration', // Marriage gets full celebration
        A: 'success', // Affection gets success
        F: 'success', // Friendship gets success
        S: 'notification', // Siblings gets notification
        E: 'notification', // Enemy gets notification
      };

      const celebrationType = celebrationMap[result] || 'notification';

      // Sound sequence for dramatic effect
      await playSoundSequence([
        { effect: 'resultReveal', delay: 0 },
        { effect: 'success', delay: 500, options: { volume: 0.8 } },
      ]);

      // Haptic sequence for result
      await triggerHapticSequence([
        { pattern: 'impact', delay: 0 },
        { pattern: celebrationType, delay: 300 },
      ]);
    },
    [playSound, playSoundSequence, triggerHapticSequence]
  );

  // Badge unlock celebration
  const handleBadgeUnlock = useCallback(
    async (badgeId: string) => {
      // Extra special feedback for badge unlocks
      await playSoundSequence([
        { effect: 'badgeUnlock', delay: 0 },
        { effect: 'success', delay: 200 },
        { effect: 'success', delay: 400, options: { playbackRate: 1.2 } },
      ]);

      await triggerHapticSequence([
        { pattern: 'celebration', delay: 0 },
        { pattern: 'success', delay: 500 },
      ]);
    },
    [playSoundSequence, triggerHapticSequence]
  );

  // UI interaction feedback
  const handleUIInteraction = useCallback(
    async (type: 'click' | 'hover' | 'success' | 'error') => {
      await Promise.all([
        playSound(type),
        type === 'click'
          ? hapticFeedback.tap()
          : type === 'success'
            ? hapticFeedback.success()
            : type === 'error'
              ? hapticFeedback.error()
              : hapticFeedback.select(), // hover
      ]);
    },
    [playSound, hapticFeedback]
  );

  // Game reset with gentle feedback
  const handleGameReset = useCallback(async () => {
    await Promise.all([playSound('click', { volume: 0.5 }), hapticFeedback.tap()]);
  }, [playSound, hapticFeedback]);

  // Check for newly unlocked badges and celebrate
  useEffect(() => {
    const newBadges = getNewlyUnlockedBadges();
    newBadges.forEach((badge) => {
      handleBadgeUnlock(badge.id);
    });
  }, [getNewlyUnlockedBadges, handleBadgeUnlock]);

  // Seasonal theme-aware feedback
  const getThemeAwareFeedback = useCallback(() => {
    const theme = currentThemeConfig;
    return {
      soundIntensity:
        theme.id === 'halloween' ? 1.2 : theme.id === 'christmas' ? 0.9 : theme.id === 'valentine' ? 0.8 : 1.0,
      hapticIntensity: theme.id === 'halloween' ? 1.1 : theme.id === 'christmas' ? 0.9 : 1.0,
      celebrationDuration: theme.id === 'valentine' ? 4000 : theme.id === 'christmas' ? 3500 : 3000,
    };
  }, [currentThemeConfig]);

  // Enhanced methods with theme awareness
  const enhancedMethods = {
    formSubmit: handleFormSubmit,
    letterStrike: handleLetterStrike,
    flamesCounting: handleFlamesCounting,
    resultReveal: handleResultReveal,
    badgeUnlock: handleBadgeUnlock,
    uiInteraction: handleUIInteraction,
    gameReset: handleGameReset,
    themeAwareFeedback: getThemeAwareFeedback,
  };

  return {
    // Individual system access
    sound: { playSound, playSoundSequence },
    haptic: { hapticFeedback, triggerHapticSequence },
    theme: { currentThemeConfig },

    // Integrated game methods
    ...enhancedMethods,

    // Convenience methods
    celebrate: (intensity: 'low' | 'medium' | 'high' = 'medium') => {
      const multiplier = { low: 0.5, medium: 1, high: 1.5 }[intensity];
      return Promise.all([playSound('success', { volume: 0.6 * multiplier }), hapticFeedback.celebration()]);
    },

    notify: (type: 'info' | 'warning' | 'error' = 'info') => {
      return Promise.all([
        playSound(type === 'error' ? 'error' : 'success', {
          volume: type === 'error' ? 0.7 : 0.5,
        }),
        type === 'error' ? hapticFeedback.error() : hapticFeedback.notification(),
      ]);
    },

    feedback: (action: 'tap' | 'select' | 'press' | 'success' | 'error') => {
      return Promise.all([
        playSound(action === 'tap' || action === 'select' || action === 'press' ? 'click' : action),
        hapticFeedback[action](),
      ]);
    },
  };
}
