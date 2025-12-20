'use client';

import { BGM_TRACKS, SoundId } from '@/config/sound';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useEffect, useRef } from 'react';

/**
 * Global Sound Controller
 *
 * Manages:
 * - Global audio persistence (keeps AudioManager mounted)
 * - Playlist logic (auto-advance to next track)
 * - Theme synchronization
 */
export default function SoundController() {
  const { playBGM, setOnTrackEnded, getBGMState } = useSoundSystem();
  const { musicTheme, isBGMEnabled } = usePreferencesStore();
  const isInitialized = useRef(false);

  // Handle playlist auto-advance
  useEffect(() => {
    setOnTrackEnded(() => {
      const state = getBGMState();
      const currentId = state.currentTrackId;

      // Only auto-advance if we are playing a standard BGM track
      // (Result tracks might loop or be handled differently)
      const isStandardTrack = BGM_TRACKS.some((t) => t.id === currentId);

      if (isStandardTrack && isBGMEnabled) {
        // Pick a random next track that is different from current
        const availableTracks = BGM_TRACKS.filter((t) => t.id !== currentId);
        const nextTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];

        if (nextTrack) {
          playBGM(nextTrack.id as SoundId, true);
        }
      }
    });
  }, [setOnTrackEnded, getBGMState, playBGM, isBGMEnabled]);

  // Initial startup
  useEffect(() => {
    if (isInitialized.current || !isBGMEnabled) return;

    // If no track is playing, start the theme track
    const state = getBGMState();
    if (!state.isPlaying && !state.currentTrackId) {
      const themeTrackId = `bgm_${musicTheme === 'auto' ? 'default' : musicTheme}`;
      // Verify track exists
      const trackExists = BGM_TRACKS.some((t) => t.id === themeTrackId);
      const trackToPlay = trackExists ? themeTrackId : 'bgm_default';

      playBGM(trackToPlay as SoundId, true);
    }

    isInitialized.current = true;
  }, [isBGMEnabled, musicTheme, getBGMState, playBGM]);

  return null; // Headless component
}
