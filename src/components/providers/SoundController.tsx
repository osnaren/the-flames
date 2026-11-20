'use client';

import { BGM_TRACKS, resolveMusic, SoundId } from '@/config/sound';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { detectSeasonalTheme } from '@/themes/seasonal/calendar';
import { useEffect, useRef } from 'react';
import InteractionFeedback from './InteractionFeedback';

/**
 * Global Sound Controller
 *
 * Manages:
 * - Global audio persistence (keeps AudioManager mounted)
 * - Playlist logic (auto-advance within the current mood, never jumping genres)
 * - Theme synchronization
 * - Site-wide haptic / click feedback (InteractionFeedback)
 */
export default function SoundController() {
  const { playBGM, setOnTrackEnded, getBGMState } = useSoundSystem();
  const musicTheme = usePreferencesStore((state) => state.musicTheme);
  const seasonalTheme = usePreferencesStore((state) => state.seasonalTheme);
  const isBGMEnabled = usePreferencesStore((state) => state.isBGMEnabled);
  const isInitialized = useRef(false);

  // Handle playlist auto-advance: next track from the same group (wrapping).
  useEffect(() => {
    setOnTrackEnded(() => {
      if (!isBGMEnabled) return;
      const currentId = getBGMState().currentTrackId;
      const current = BGM_TRACKS.find((t) => t.id === currentId);
      // Result tracks and unknown ids are handled by the game flow.
      if (!current) return;

      const group = BGM_TRACKS.filter((t) => t.themeGroup === current.themeGroup);
      const next = group[(group.findIndex((t) => t.id === current.id) + 1) % group.length];
      if (next) void playBGM(next.id as SoundId, true);
    });
  }, [setOnTrackEnded, getBGMState, playBGM, isBGMEnabled]);

  // Initial startup
  useEffect(() => {
    if (isInitialized.current || !isBGMEnabled) return;

    const state = getBGMState();
    if (!state.isPlaying && !state.currentTrackId) {
      const activeSeasonal = seasonalTheme === 'auto' ? detectSeasonalTheme() : seasonalTheme;
      const { track } = resolveMusic(musicTheme, activeSeasonal);
      void playBGM((track?.id ?? 'bgm_default') as SoundId, true);
    }

    isInitialized.current = true;
  }, [isBGMEnabled, musicTheme, seasonalTheme, getBGMState, playBGM]);

  return <InteractionFeedback />;
}
