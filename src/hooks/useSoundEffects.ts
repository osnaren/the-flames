import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useCallback, useEffect, useRef } from 'react';

export type SoundEffect =
  | 'formSubmit'
  | 'letterStrike'
  | 'flamesCount'
  | 'resultReveal'
  | 'badgeUnlock'
  | 'hover'
  | 'click'
  | 'error'
  | 'success';

export interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

// Sound effect configurations
const SOUND_CONFIGS: Record<SoundEffect, SoundConfig> = {
  formSubmit: {
    src: '/sounds/form-submit.wav',
    volume: 0.6,
    preload: true,
  },
  letterStrike: {
    src: '/sounds/letter-strike.wav',
    volume: 0.4,
    preload: true,
  },
  flamesCount: {
    src: '/sounds/flames-count.wav',
    volume: 0.5,
    preload: true,
  },
  resultReveal: {
    src: '/sounds/result-reveal.wav',
    volume: 0.8,
    preload: true,
  },
  badgeUnlock: {
    src: '/sounds/badge-unlock.wav',
    volume: 0.7,
    preload: true,
  },
  hover: {
    src: '/sounds/hover.wav',
    volume: 0.2,
    preload: true,
  },
  click: {
    src: '/sounds/click.wav',
    volume: 0.3,
    preload: true,
  },
  error: {
    src: '/sounds/error.wav',
    volume: 0.5,
    preload: true,
  },
  success: {
    src: '/sounds/success.wav',
    volume: 0.6,
    preload: true,
  },
};

export function useSoundEffects() {
  const { isSoundEnabled, volume } = usePreferencesStore();
  const audioCache = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());
  const loadedSounds = useRef<Set<SoundEffect>>(new Set());

  // Preload audio files
  useEffect(() => {
    if (!isSoundEnabled) return;

    const loadSound = async (effect: SoundEffect, config: SoundConfig) => {
      if (loadedSounds.current.has(effect)) return;

      try {
        const audio = new Audio(config.src);
        audio.preload = config.preload ? 'auto' : 'none';
        audio.volume = (config.volume || 1) * volume;

        // Handle loading promise
        await new Promise<void>((resolve, reject) => {
          const onLoad = () => {
            audio.removeEventListener('canplaythrough', onLoad);
            audio.removeEventListener('error', onError);
            resolve();
          };

          const onError = () => {
            audio.removeEventListener('canplaythrough', onLoad);
            audio.removeEventListener('error', onError);
            console.warn(`Failed to load sound: ${config.src}`);
            reject(new Error(`Failed to load sound: ${config.src}`));
          };

          audio.addEventListener('canplaythrough', onLoad);
          audio.addEventListener('error', onError);
        });

        audioCache.current.set(effect, audio);
        loadedSounds.current.add(effect);
      } catch (error) {
        console.warn(`Sound loading failed for ${effect}:`, error);
      }
    };

    // Load all preloadable sounds
    Object.entries(SOUND_CONFIGS).forEach(([effect, config]) => {
      if (config.preload) {
        loadSound(effect as SoundEffect, config);
      }
    });

    return () => {
      // Cleanup audio objects
      audioCache.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [isSoundEnabled, volume]);

  // Update volume when preferences change
  useEffect(() => {
    audioCache.current.forEach((audio, effect) => {
      const config = SOUND_CONFIGS[effect];
      audio.volume = (config.volume || 1) * volume;
    });
  }, [volume]);

  // Play sound effect
  const playSound = useCallback(
    async (
      effect: SoundEffect,
      options?: {
        volume?: number;
        playbackRate?: number;
        delay?: number;
      }
    ) => {
      if (!isSoundEnabled) return;

      const config = SOUND_CONFIGS[effect];
      let audio = audioCache.current.get(effect);

      // Load audio if not cached
      if (!audio) {
        try {
          audio = new Audio(config.src);
          audio.volume = (options?.volume || config.volume || 1) * volume;
          audioCache.current.set(effect, audio);
        } catch (error) {
          console.warn(`Failed to create audio for ${effect}:`, error);
          return;
        }
      }

      try {
        // Reset audio
        audio.currentTime = 0;

        // Apply options
        if (options?.volume !== undefined) {
          audio.volume = options.volume * volume;
        }
        if (options?.playbackRate !== undefined) {
          audio.playbackRate = options.playbackRate;
        }

        // Play with optional delay
        if (options?.delay) {
          setTimeout(() => {
            audio?.play().catch((e) => console.warn(`Audio play failed for ${effect}:`, e));
          }, options.delay);
        } else {
          await audio.play();
        }
      } catch (error) {
        console.warn(`Audio play failed for ${effect}:`, error);
      }
    },
    [isSoundEnabled, volume]
  );

  // Play multiple sounds in sequence
  const playSoundSequence = useCallback(
    async (
      sequence: Array<{
        effect: SoundEffect;
        delay?: number;
        options?: Parameters<typeof playSound>[1];
      }>
    ) => {
      if (!isSoundEnabled) return;

      for (const { effect, delay = 0, options } of sequence) {
        await new Promise((resolve) => {
          setTimeout(() => {
            playSound(effect, options);
            resolve(void 0);
          }, delay);
        });
      }
    },
    [playSound, isSoundEnabled]
  );

  // Preload specific sound
  const preloadSound = useCallback(
    async (effect: SoundEffect) => {
      if (loadedSounds.current.has(effect)) return;

      const config = SOUND_CONFIGS[effect];
      try {
        const audio = new Audio(config.src);
        audio.preload = 'auto';
        audio.volume = (config.volume || 1) * volume;

        await new Promise<void>((resolve) => {
          const onLoad = () => {
            audio.removeEventListener('canplaythrough', onLoad);
            resolve();
          };
          audio.addEventListener('canplaythrough', onLoad);
        });

        audioCache.current.set(effect, audio);
        loadedSounds.current.add(effect);
      } catch (error) {
        console.warn(`Failed to preload sound ${effect}:`, error);
      }
    },
    [volume]
  );

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    audioCache.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    playSound,
    playSoundSequence,
    preloadSound,
    stopAllSounds,
    isEnabled: isSoundEnabled,
    volume,
  };
}
