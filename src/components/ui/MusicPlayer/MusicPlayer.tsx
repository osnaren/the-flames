'use client';

/**
 * MusicPlayer Component
 *
 * A compact music player with rotating disc animation and playback controls.
 * Features:
 * - Rotating vinyl disc animation when playing
 * - Theme group selection dropdown
 * - Track cycling within theme groups via prev/next
 * - Play/Pause toggle
 * - Volume control slider
 * - Responsive design
 */

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select';
import { BGM_TRACKS, getTracksForTheme, SoundId, THEME_GROUPS } from '@/config/sound';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Disc3, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
  /** Whether the player is in an expanded panel */
  isExpanded?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Tab index for accessibility */
  tabIndex?: number;
}

function MusicPlayerComponent({ isExpanded = true, className, tabIndex = 0 }: MusicPlayerProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const { isBGMEnabled, musicTheme, volume, toggleBGM, setMusicTheme, setVolume } = usePreferencesStore();
  const { playBGM, getBGMState, pauseBGM, resumeBGM } = useSoundSystem();
  const { hapticFeedback } = useHapticFeedback();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current theme group
  const currentThemeGroup =
    THEME_GROUPS.find((tg) => tg.id === (musicTheme === 'auto' ? 'default' : musicTheme)) || THEME_GROUPS[0];

  // Get tracks for current theme group
  const themeTracks = getTracksForTheme(currentThemeGroup.id);

  // Get current track (based on index within theme)
  const currentTrack = themeTracks[currentTrackIndex] || themeTracks[0] || BGM_TRACKS[0];

  // Update playing state
  useEffect(() => {
    const checkPlayingState = () => {
      const state = getBGMState();
      setIsPlaying(state.isPlaying);
    };

    checkPlayingState();
    const interval = setInterval(checkPlayingState, 500);
    return () => clearInterval(interval);
  }, [getBGMState]);

  // Reset track index when theme changes
  useEffect(() => {
    setCurrentTrackIndex(0);
  }, [musicTheme]);

  // Handle play/pause toggle
  const handlePlayPause = useCallback(async () => {
    hapticFeedback.tap();

    if (!isBGMEnabled) {
      toggleBGM();
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      pauseBGM();
      setIsPlaying(false);
    } else {
      // Ensure we have a track playing
      const state = getBGMState();
      try {
        if (!state.currentTrackId) {
          await playBGM(currentTrack.id as SoundId, true);
        } else {
          await resumeBGM();
        }
        setIsPlaying(true);
      } catch {
        // Failed to play (e.g. autoplay blocked)
        setIsPlaying(false);
      }
    }
  }, [isBGMEnabled, isPlaying, toggleBGM, pauseBGM, resumeBGM, playBGM, getBGMState, currentTrack.id, hapticFeedback]);

  // Handle theme selection
  const handleThemeSelect = useCallback(
    async (themeId: string) => {
      hapticFeedback.select();
      setMusicTheme(themeId as typeof musicTheme);
      setCurrentTrackIndex(0);

      // Note: We don't call playBGM here anymore because the useSoundSystem hook
      // watches for musicTheme changes and will automatically play the correct track.
      // This prevents race conditions where both components try to play audio simultaneously.

      if (isBGMEnabled) {
        setIsPlaying(true);
      }
    },
    [setMusicTheme, isBGMEnabled, hapticFeedback]
  );

  // Handle next/prev track within theme
  const cycleTrack = useCallback(
    async (direction: 'next' | 'prev') => {
      if (themeTracks.length <= 1) return;

      hapticFeedback.select();

      let newIndex: number;
      if (direction === 'next') {
        newIndex = (currentTrackIndex + 1) % themeTracks.length;
      } else {
        newIndex = (currentTrackIndex - 1 + themeTracks.length) % themeTracks.length;
      }

      setCurrentTrackIndex(newIndex);
      const newTrack = themeTracks[newIndex];

      if (newTrack && isBGMEnabled) {
        await playBGM(newTrack.id as SoundId, true);
        setIsPlaying(true);
      }
    },
    [themeTracks, currentTrackIndex, playBGM, isBGMEnabled, hapticFeedback]
  );

  // Handle volume change
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
    },
    [setVolume]
  );

  // Handle volume button hover
  const handleVolumeHover = useCallback(() => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    setShowVolumeSlider(true);
  }, []);

  const handleVolumeLeave = useCallback(() => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1500);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  // Disc rotation animation
  const discVariants = {
    playing: {
      rotate: 360,
      transition: {
        duration: 3,
        ease: 'linear' as const,
        repeat: Infinity,
      },
    },
    paused: {
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div
      className={cn(
        'from-surface-container-low/80 to-surface-container/60 border-outline/20 rounded-xl border bg-linear-to-br p-3',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Rotating Disc */}
        <motion.div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center"
          animate={isPlaying && shouldAnimate ? 'playing' : 'paused'}
          variants={shouldAnimate ? discVariants : undefined}
        >
          {/* Disc background */}
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-gray-800 to-gray-900 shadow-lg" />

          {/* Vinyl grooves */}
          <div className="absolute inset-1 rounded-full border border-gray-700/50" />
          <div className="absolute inset-2 rounded-full border border-gray-700/30" />
          <div className="absolute inset-3 rounded-full border border-gray-700/20" />

          {/* Center label */}
          <div className="from-primary to-secondary absolute flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br">
            <Disc3 className="h-3 w-3 text-white" />
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/10 via-transparent to-transparent" />

          {/* Playing indicator */}
          {isPlaying && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Controls */}
        <div className="flex flex-1 flex-col gap-1.5">
          {/* Theme Selector */}
          <Select value={currentThemeGroup.id} onValueChange={handleThemeSelect}>
            <SelectTrigger
              className="bg-surface-container-high/50 hover:bg-surface-container-highest/50 focus:ring-primary/50 h-7 w-full border-none px-2 py-1 text-xs font-medium"
              tabIndex={isExpanded ? tabIndex : -1}
            >
              <div className="flex items-center gap-1.5">
                <span>{currentThemeGroup.icon}</span>
                <span>{currentThemeGroup.label}</span>
                {themeTracks.length > 1 && (
                  <span className="text-on-surface-variant text-[9px]">
                    ({currentTrackIndex + 1}/{themeTracks.length})
                  </span>
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              {THEME_GROUPS.map((themeGroup) => {
                const trackCount = getTracksForTheme(themeGroup.id).length;
                return (
                  <SelectItem key={themeGroup.id} value={themeGroup.id} className="text-xs">
                    <div className="flex w-full items-center gap-2">
                      <span>{themeGroup.icon}</span>
                      <div className="flex flex-1 items-center gap-1">
                        <span>{themeGroup.label}</span>
                        {themeGroup.seasonal && <span className="text-muted-foreground text-[9px]">(Seasonal)</span>}
                        {trackCount > 1 && (
                          <span className="text-muted-foreground text-[9px]">• {trackCount} tracks</span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Playback Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {/* Prev Button - Touch-optimized */}
              <button
                onClick={() => cycleTrack('prev')}
                disabled={themeTracks.length <= 1}
                className={cn(
                  'flex h-8 w-8 touch-manipulation items-center justify-center rounded-full',
                  'hover:bg-surface-container-highest/50 active:bg-surface-container-highest/70',
                  'text-on-surface-variant hover:text-on-surface',
                  'focus:ring-primary/50 transition-colors focus:ring-2 focus:outline-none',
                  themeTracks.length <= 1 && 'cursor-not-allowed opacity-30'
                )}
                aria-label="Previous track"
                title={themeTracks.length > 1 ? 'Previous track in theme' : 'Only one track in this theme'}
                tabIndex={isExpanded ? tabIndex : -1}
              >
                <SkipBack className="h-4 w-4" fill="currentColor" />
              </button>

              {/* Play/Pause Button - Touch-optimized */}
              <button
                onClick={handlePlayPause}
                className={cn(
                  'flex h-10 w-10 touch-manipulation items-center justify-center rounded-full',
                  'bg-primary/20 hover:bg-primary/30 active:bg-primary/40 text-primary',
                  'focus:ring-primary/50 transition-all focus:ring-2 focus:outline-none',
                  shouldAnimate && 'hover:scale-105 active:scale-95'
                )}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
                tabIndex={isExpanded ? tabIndex : -1}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" fill="currentColor" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                )}
              </button>

              {/* Next Button - Touch-optimized */}
              <button
                onClick={() => cycleTrack('next')}
                disabled={themeTracks.length <= 1}
                className={cn(
                  'flex h-8 w-8 touch-manipulation items-center justify-center rounded-full',
                  'hover:bg-surface-container-highest/50 active:bg-surface-container-highest/70',
                  'text-on-surface-variant hover:text-on-surface',
                  'focus:ring-primary/50 transition-colors focus:ring-2 focus:outline-none',
                  themeTracks.length <= 1 && 'cursor-not-allowed opacity-30'
                )}
                aria-label="Next track"
                title={themeTracks.length > 1 ? 'Next track in theme' : 'Only one track in this theme'}
                tabIndex={isExpanded ? tabIndex : -1}
              >
                <SkipForward className="h-4 w-4" fill="currentColor" />
              </button>
            </div>

            {/* Volume Control - Touch-friendly */}
            <div
              className="relative flex items-center"
              onMouseEnter={handleVolumeHover}
              onMouseLeave={handleVolumeLeave}
              onTouchStart={handleVolumeHover}
            >
              <button
                onClick={() => {
                  hapticFeedback.tap();
                  toggleBGM();
                }}
                onTouchEnd={(e) => {
                  // Prevent double-tap zoom on mobile
                  e.preventDefault();
                }}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'hover:bg-surface-container-highest/50 active:bg-surface-container-highest/70',
                  'text-on-surface-variant hover:text-on-surface',
                  'focus:ring-primary/50 transition-colors focus:ring-2 focus:outline-none',
                  'touch-manipulation' // Improves touch responsiveness
                )}
                aria-label={isBGMEnabled ? 'Mute music' : 'Unmute music'}
                tabIndex={isExpanded ? tabIndex : -1}
              >
                {isBGMEnabled && volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              {/* Volume Slider - Touch-friendly */}
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.9 }}
                    className="bg-surface-container-high absolute right-full mr-2 flex items-center gap-2 rounded-lg px-3 py-2 shadow-lg"
                    onMouseEnter={handleVolumeHover}
                    onMouseLeave={handleVolumeLeave}
                    onTouchStart={handleVolumeHover}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      onTouchEnd={() => hapticFeedback.select()}
                      className="accent-primary h-2 w-20 cursor-pointer touch-manipulation"
                      aria-label="Volume control"
                      tabIndex={isExpanded ? 0 : -1}
                    />
                    <span className="text-on-surface-variant w-7 text-right text-[11px] font-medium">
                      {Math.round(volume * 100)}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Now Playing Label */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-on-surface-variant mt-2 flex items-center gap-1.5 text-[10px]"
        >
          <Music2 className="h-3 w-3" />
          <span>
            Now playing: {currentTrack.label}
            {themeTracks.length > 1 && ` (${currentTrackIndex + 1}/${themeTracks.length})`}
          </span>
        </motion.div>
      )}
    </div>
  );
}

export const MusicPlayer = memo(MusicPlayerComponent);
export default MusicPlayer;
