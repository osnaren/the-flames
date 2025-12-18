import { useCallback, useEffect, useRef } from 'react';

import { SoundId } from '@/config/sound';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { useHapticFeedback } from './useHapticFeedback';
import { usePairingHistory } from './usePairingHistory';
import { useSoundSystem } from './useSoundSystem';

/**
 * Comprehensive integration hook that combines all game systems
 * Provides unified methods for game events with sound, haptic, and visual feedback
 *
 * Features:
 * - Integrated sound and haptic feedback for all game events
 * - Theme-aware celebration intensities
 * - Badge unlock detection and celebration
 * - Debounced event handlers to prevent duplicate triggers
 * - Performance optimized with memoization
 */
export function useGameIntegration() {
  const { playSound, playSoundSequence } = useSoundSystem();
  const { hapticFeedback, triggerHapticSequence } = useHapticFeedback();
  const { getNewlyUnlockedBadges } = usePairingHistory();
  const { currentThemeConfig } = useSeasonalTheme();

  // Prevent duplicate badge celebrations
  const celebratedBadgesRef = useRef<Set<string>>(new Set());

  // Form submission with feedback
  const handleFormSubmit = useCallback(async () => {
    await Promise.all([playSound('formSubmit' as SoundId), hapticFeedback.tap()]);
  }, [playSound, hapticFeedback]);

  // Letter striking animation with feedback
  const handleLetterStrike = useCallback(
    async (letterIndex: number, _totalLetters: number) => {
      const delay = letterIndex * 100; // Stagger the feedback

      await Promise.all([playSound('letterStrike' as SoundId, { delay }), hapticFeedback.letterStrike()]);
    },
    [playSound, hapticFeedback]
  );

  // FLAMES counting with progressive feedback
  const handleFlamesCounting = useCallback(
    async (currentStep: number, totalSteps: number) => {
      const intensity = Math.min(1, currentStep / totalSteps);

      await Promise.all([
        playSound('flamesCount' as SoundId, {
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
        { effect: 'resultReveal' as SoundId, delay: 0 },
        { effect: 'success' as SoundId, delay: 500, options: { volume: 0.8 } },
      ]);

      // Haptic sequence for result
      await triggerHapticSequence([
        { pattern: 'impact', delay: 0 },
        { pattern: celebrationType, delay: 300 },
      ]);
    },
    [playSoundSequence, triggerHapticSequence]
  );

  // Badge unlock celebration
  const handleBadgeUnlock = useCallback(
    async (badgeId: string) => {
      // Prevent duplicate celebrations
      if (celebratedBadgesRef.current.has(badgeId)) {
        return;
      }
      celebratedBadgesRef.current.add(badgeId);

      // Extra special feedback for badge unlocks
      await playSoundSequence([
        { effect: 'badgeUnlock' as SoundId, delay: 0 },
        { effect: 'success' as SoundId, delay: 200 },
        { effect: 'sparkle' as SoundId, delay: 400, options: { playbackRate: 1.2 } },
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
    async (type: 'click' | 'hover' | 'success' | 'error' | 'toggle') => {
      const soundMap: Record<string, SoundId> = {
        click: 'click',
        hover: 'hover',
        success: 'success',
        error: 'error',
        toggle: 'toggle',
      };

      await Promise.all([
        playSound(soundMap[type] as SoundId),
        type === 'click' || type === 'toggle'
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
    await Promise.all([playSound('click' as SoundId, { volume: 0.5 }), hapticFeedback.tap()]);
  }, [playSound, hapticFeedback]);

  // Check for newly unlocked badges and celebrate
  useEffect(() => {
    const newBadges = getNewlyUnlockedBadges();
    newBadges.forEach((badge) => {
      // Use setTimeout to prevent blocking the main thread
      setTimeout(() => {
        handleBadgeUnlock(badge.id);
      }, 0);
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
      return Promise.all([playSound('success' as SoundId, { volume: 0.6 * multiplier }), hapticFeedback.celebration()]);
    },

    notify: (type: 'info' | 'warning' | 'error' = 'info') => {
      return Promise.all([
        playSound((type === 'error' ? 'error' : 'success') as SoundId, {
          volume: type === 'error' ? 0.7 : 0.5,
        }),
        type === 'error' ? hapticFeedback.error() : hapticFeedback.notification(),
      ]);
    },

    feedback: (action: 'tap' | 'select' | 'press' | 'success' | 'error') => {
      const soundId = (action === 'tap' || action === 'select' || action === 'press' ? 'click' : action) as SoundId;
      return Promise.all([playSound(soundId), hapticFeedback[action]()]);
    },
  };
}
