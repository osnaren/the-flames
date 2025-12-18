'use client';

/**
 * MusicPlayer Component
 *
 * A compact music player with rotating disc animation and playback controls.
 * Features:
 * - Rotating vinyl disc animation when playing
 * - Track selection dropdown
 * - Play/Pause toggle
 * - Volume control slider
 * - Responsive design
 */

import { BGM_TRACKS, SoundId } from '@/config/sound';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Disc3, Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
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

  const [isTrackSelectorOpen, setIsTrackSelectorOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const trackSelectorRef = useRef<HTMLDivElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current track info
  const currentTrack =
    BGM_TRACKS.find((track) => track.id === `bgm_${musicTheme === 'auto' ? 'default' : musicTheme}`) || BGM_TRACKS[0];

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

  // Close track selector on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trackSelectorRef.current && !trackSelectorRef.current.contains(event.target as Node)) {
        setIsTrackSelectorOpen(false);
      }
    };

    if (isTrackSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTrackSelectorOpen]);

  // Handle play/pause toggle
  const handlePlayPause = useCallback(async () => {
    if (!isBGMEnabled) {
      toggleBGM();
      return;
    }

    if (isPlaying) {
      pauseBGM();
      setIsPlaying(false);
    } else {
      await resumeBGM();
      setIsPlaying(true);
    }
  }, [isBGMEnabled, isPlaying, toggleBGM, pauseBGM, resumeBGM]);

  // Handle track selection
  const handleTrackSelect = useCallback(
    async (trackId: string) => {
      // Extract theme from track ID (e.g., 'bgm_valentine' -> 'valentine')
      const theme = trackId.replace('bgm_', '') as typeof musicTheme;
      setMusicTheme(theme);
      setIsTrackSelectorOpen(false);

      if (isBGMEnabled) {
        await playBGM(trackId as SoundId, true);
        setIsPlaying(true);
      }
    },
    [setMusicTheme, playBGM, isBGMEnabled]
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
          {/* Track Selector */}
          <div className="relative" ref={trackSelectorRef}>
            <button
              onClick={() => setIsTrackSelectorOpen(!isTrackSelectorOpen)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-2 py-1',
                'bg-surface-container-high/50 hover:bg-surface-container-highest/50',
                'text-on-surface transition-colors',
                'focus:ring-primary/50 focus:ring-2 focus:outline-none'
              )}
              aria-expanded={isTrackSelectorOpen}
              aria-haspopup="listbox"
              tabIndex={isExpanded ? tabIndex : -1}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <span>{currentTrack.icon}</span>
                <span>{currentTrack.label}</span>
              </span>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isTrackSelectorOpen && 'rotate-180')} />
            </button>

            {/* Track Dropdown */}
            <AnimatePresence>
              {isTrackSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="border-outline/20 bg-surface-container absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-lg border shadow-lg"
                  role="listbox"
                >
                  {BGM_TRACKS.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackSelect(track.id)}
                      className={cn(
                        'flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs',
                        'hover:bg-primary/10 transition-colors',
                        currentTrack.id === track.id && 'bg-primary/20 font-medium'
                      )}
                      role="option"
                      aria-selected={currentTrack.id === track.id}
                      tabIndex={isExpanded ? 0 : -1}
                    >
                      <span>{track.icon}</span>
                      <div className="flex-1">
                        <span className="text-on-surface">{track.label}</span>
                        {track.seasonal && <span className="text-on-surface-variant ml-1 text-[9px]">(Seasonal)</span>}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full',
                'bg-primary/20 hover:bg-primary/30 text-primary',
                'focus:ring-primary/50 transition-all focus:ring-2 focus:outline-none',
                shouldAnimate && 'hover:scale-105 active:scale-95'
              )}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              tabIndex={isExpanded ? tabIndex : -1}
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" fill="currentColor" />
              ) : (
                <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
              )}
            </button>

            {/* Volume Control */}
            <div
              className="relative flex items-center"
              onMouseEnter={handleVolumeHover}
              onMouseLeave={handleVolumeLeave}
            >
              <button
                onClick={toggleBGM}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  'hover:bg-surface-container-highest/50 text-on-surface-variant hover:text-on-surface',
                  'focus:ring-primary/50 transition-colors focus:ring-2 focus:outline-none'
                )}
                aria-label={isBGMEnabled ? 'Mute music' : 'Unmute music'}
                tabIndex={isExpanded ? tabIndex : -1}
              >
                {isBGMEnabled && volume > 0 ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>

              {/* Volume Slider */}
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.9 }}
                    className="bg-surface-container-high absolute right-full mr-2 flex items-center gap-2 rounded-lg px-2 py-1.5 shadow-lg"
                    onMouseEnter={handleVolumeHover}
                    onMouseLeave={handleVolumeLeave}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="accent-primary h-1 w-16 cursor-pointer"
                      aria-label="Volume control"
                      tabIndex={isExpanded ? 0 : -1}
                    />
                    <span className="text-on-surface-variant w-6 text-right text-[10px]">
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
          <span>Now playing: {currentTrack.description}</span>
        </motion.div>
      )}
    </div>
  );
}

export const MusicPlayer = memo(MusicPlayerComponent);
export default MusicPlayer;
