import { SoundId } from '@/config/sound';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { useCallback, useEffect, useRef } from 'react';
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
 * - Game-aware BGM management (suspends theme BGM during processing)
 */
export function useGameIntegration() {
  const { playSound, playSoundSequence, playBGM, suspendThemeBGM, resumeThemeBGM } = useSoundSystem();
  const { hapticFeedback, triggerHapticSequence } = useHapticFeedback();
  const { getNewlyUnlockedBadges } = usePairingHistory();
  const { currentThemeConfig } = useSeasonalTheme();
  const { isBGMEnabled } = usePreferencesStore();

  // Prevent duplicate badge celebrations
  const celebratedBadgesRef = useRef<Set<string>>(new Set());

  // Form submission with feedback
  // Suspends theme BGM so only SFX plays during processing
  const handleFormSubmit = useCallback(async () => {
    await suspendThemeBGM();
    await Promise.all([playSound('formSubmit' as SoundId), hapticFeedback.tap()]);
  }, [playSound, hapticFeedback, suspendThemeBGM]);

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
  // Plays result-specific BGM based on the FLAMES result
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

      // Map result to BGM - only play if BGM is enabled
      if (isBGMEnabled) {
        const bgmMap: Record<string, SoundId> = {
          L: 'bgm_result_love',
          M: 'bgm_result_marriage',
          A: 'bgm_result_affection',
          F: 'bgm_result_friendship',
          S: 'bgm_result_sibling',
          E: 'bgm_result_enemy',
        };

        const resultBgm = bgmMap[result];
        if (resultBgm) {
          // Play result BGM (theme BGM was suspended on form submit)
          playBGM(resultBgm, true);
        }
      }

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
    [playSoundSequence, triggerHapticSequence, playBGM, isBGMEnabled]
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
    async (type: 'click' | 'hover' | 'success' | 'error' | 'toggle' | 'select') => {
      const soundMap: Record<string, SoundId> = {
        click: 'click',
        hover: 'hover',
        success: 'success',
        error: 'error',
        toggle: 'toggle',
        select: 'click',
      };

      await Promise.all([
        playSound(soundMap[type] as SoundId),
        type === 'click' || type === 'toggle' || type === 'select'
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
  // Resumes theme BGM that was suspended during game processing
  const handleGameReset = useCallback(async () => {
    // Resume theme BGM (will fade out result BGM and play theme BGM)
    await resumeThemeBGM();

    await Promise.all([playSound('click' as SoundId, { volume: 0.5 }), hapticFeedback.tap()]);
  }, [playSound, hapticFeedback, resumeThemeBGM]);

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
