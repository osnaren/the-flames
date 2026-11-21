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

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '@/components/shadcn/select';
import { BGM_TRACKS, getTracksForTheme, resolveMusic, SoundId, THEME_GROUPS } from '@/config/sound';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Disc3, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface MusicPlayerProps {
  /** Use native controls inside the performance-sensitive settings panel. */
  compact?: boolean;
  /** Whether the player is in an expanded panel */
  isExpanded?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Tab index for accessibility */
  tabIndex?: number;
}

function MusicPlayerComponent({ isExpanded = true, className, tabIndex = 0, compact = false }: MusicPlayerProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const { isBGMEnabled, musicTheme, volume, toggleBGM, setMusicTheme, setVolume } = usePreferencesStore(
    useShallow((state) => ({
      isBGMEnabled: state.isBGMEnabled,
      musicTheme: state.musicTheme,
      volume: state.volume,
      toggleBGM: state.toggleBGM,
      setMusicTheme: state.setMusicTheme,
      setVolume: state.setVolume,
    }))
  );
  const { playBGM, getBGMState, pauseBGM, resumeBGM } = useSoundSystem();
  const { hapticFeedback } = useHapticFeedback();
  const compactDevice = useMediaQuery('(max-width: 767px), (pointer: coarse)');

  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 'auto' follows the active seasonal theme (Diwali -> Desi Festive, etc.)
  const { currentTheme: activeSeasonalTheme } = useSeasonalTheme();
  const resolvedGroupId = resolveMusic(musicTheme, activeSeasonalTheme).group;
  const currentThemeGroup = THEME_GROUPS.find((tg) => tg.id === resolvedGroupId) || THEME_GROUPS[0];
  const selectValue = musicTheme === 'auto' ? 'auto' : currentThemeGroup.id;

  // Get tracks for current theme group
  const themeTracks = useMemo(() => getTracksForTheme(currentThemeGroup.id), [currentThemeGroup.id]);

  // Get current track (based on index within theme)
  const currentTrack = themeTracks[currentTrackIndex] || themeTracks[0] || BGM_TRACKS[0];

  // Update playing state
  useEffect(() => {
    const checkPlayingState = () => {
      const state = getBGMState();
      setIsPlaying(state.isPlaying);
      // Keep the shown track in sync with what is actually playing.
      const playingIndex = themeTracks.findIndex((t) => t.id === state.currentTrackId);
      if (playingIndex >= 0) setCurrentTrackIndex((index) => (index === playingIndex ? index : playingIndex));
    };

    checkPlayingState();
    const interval = setInterval(checkPlayingState, 500);
    return () => clearInterval(interval);
  }, [getBGMState, themeTracks]);

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
        // Resume only if the paused track still belongs to the selected music;
        // after a theme change, start that theme's track instead.
        const pausedTrack = BGM_TRACKS.find((t) => t.id === state.currentTrackId);
        if (!pausedTrack || pausedTrack.themeGroup !== currentThemeGroup.id) {
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
  }, [
    isBGMEnabled,
    isPlaying,
    toggleBGM,
    pauseBGM,
    resumeBGM,
    playBGM,
    getBGMState,
    currentTrack.id,
    currentThemeGroup.id,
    hapticFeedback,
  ]);

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

  if (compact || compactDevice) {
    const controlClass =
      'text-on-surface-variant hover:bg-surface-container-highest/50 focus:ring-primary/50 flex h-9 w-9 items-center justify-center rounded-full focus:ring-2 focus:outline-none disabled:opacity-30';
    return (
      <div
        role="group"
        aria-label="Music player"
        className={cn('border-outline/20 bg-surface-container-low/80 space-y-2 rounded-xl border p-2', className)}
      >
        <Select value={selectValue} onValueChange={(value) => void handleThemeSelect(value)}>
          <SelectTrigger aria-label="Music theme" className="h-10 text-xs" tabIndex={isExpanded ? tabIndex : -1}>
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true">{musicTheme === 'auto' ? '✨' : currentThemeGroup.icon}</span>
              <span className="truncate">
                {musicTheme === 'auto' ? (
                  <>
                    Auto <span className="text-on-surface-variant">· {currentThemeGroup.label}</span>
                  </>
                ) : (
                  currentThemeGroup.label
                )}
              </span>
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-[min(20rem,var(--radix-select-content-available-height))]">
            <SelectItem value="auto" className="text-xs">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">✨</span>
                <span>
                  Auto <span className="text-on-surface-variant font-normal">· follows the theme</span>
                </span>
              </span>
            </SelectItem>
            <SelectSeparator />
            {THEME_GROUPS.map((group) => (
              <SelectItem key={group.id} value={group.id} className="text-xs">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{group.icon}</span>
                  <span>{group.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              void cycleTrack('prev');
            }}
            disabled={themeTracks.length <= 1}
            className={controlClass}
            aria-label="Previous track"
            tabIndex={isExpanded ? tabIndex : -1}
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              void handlePlayPause();
            }}
            className={cn(controlClass, 'bg-primary/20 text-primary')}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            tabIndex={isExpanded ? tabIndex : -1}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              void cycleTrack('next');
            }}
            disabled={themeTracks.length <= 1}
            className={controlClass}
            aria-label="Next track"
            tabIndex={isExpanded ? tabIndex : -1}
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              hapticFeedback.tap();
              toggleBGM();
            }}
            className={controlClass}
            aria-label={isBGMEnabled ? 'Mute music' : 'Unmute music'}
            tabIndex={isExpanded ? tabIndex : -1}
          >
            {isBGMEnabled && volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume control"
            className="accent-primary h-6 min-w-0 flex-1"
            tabIndex={isExpanded ? tabIndex : -1}
          />
          <span className="text-on-surface-variant w-7 text-right text-[10px]">{Math.round(volume * 100)}%</span>
        </div>
        <p className="text-on-surface-variant h-4 truncate text-[10px]">
          {isPlaying ? 'Now playing' : 'Track'}: {currentTrack.label}
        </p>
        {currentTrack.credit && (
          <p className="text-on-surface-variant/90 truncate text-[9px]">
            Music: {currentTrack.credit.artist} ·{' '}
            <a href={currentTrack.credit.url} target="_blank" rel="noopener noreferrer" className="underline">
              {currentTrack.credit.license}
            </a>
          </p>
        )}
      </div>
    );
  }

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
          <Select value={selectValue} onValueChange={handleThemeSelect}>
            <SelectTrigger className="h-9 px-2.5 text-xs font-medium" tabIndex={isExpanded ? tabIndex : -1}>
              <div className="flex items-center gap-1.5">
                <span>{musicTheme === 'auto' ? '✨' : currentThemeGroup.icon}</span>
                <span>{musicTheme === 'auto' ? `Auto · ${currentThemeGroup.label}` : currentThemeGroup.label}</span>
                {themeTracks.length > 1 && (
                  <span className="text-on-surface-variant text-[9px]">
                    ({currentTrackIndex + 1}/{themeTracks.length})
                  </span>
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto" className="text-xs">
                <div className="flex w-full items-center gap-2">
                  <span>✨</span>
                  <span>Auto</span>
                  <span className="text-on-surface-variant text-[9px] font-normal">matches the season</span>
                </div>
              </SelectItem>
              {THEME_GROUPS.map((themeGroup) => {
                const trackCount = getTracksForTheme(themeGroup.id).length;
                return (
                  <SelectItem key={themeGroup.id} value={themeGroup.id} className="text-xs">
                    <div className="flex w-full items-center gap-2">
                      <span>{themeGroup.icon}</span>
                      <div className="flex flex-1 items-center gap-1">
                        <span>{themeGroup.label}</span>
                        {themeGroup.seasonal && (
                          <span className="text-on-surface-variant text-[9px] font-normal">(Seasonal)</span>
                        )}
                        {trackCount > 1 && (
                          <span className="text-on-surface-variant text-[9px] font-normal">• {trackCount} tracks</span>
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
          <span className="truncate">
            Now playing: {currentTrack.label}
            {themeTracks.length > 1 && ` (${currentTrackIndex + 1}/${themeTracks.length})`}
          </span>
        </motion.div>
      )}
      {currentTrack.credit && (
        <p className="text-on-surface-variant/90 mt-1 truncate text-[9px]">
          Music: “{currentTrack.credit.title}” by {currentTrack.credit.artist} ·{' '}
          <a href={currentTrack.credit.url} target="_blank" rel="noopener noreferrer" className="underline">
            {currentTrack.credit.license}
          </a>
        </p>
      )}
    </div>
  );
}

export const MusicPlayer = memo(MusicPlayerComponent);
export default MusicPlayer;
