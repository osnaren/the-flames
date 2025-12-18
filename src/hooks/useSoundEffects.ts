/**
 * useSoundEffects Hook (Legacy Wrapper)
 *
 * This is a backward-compatible wrapper around useSoundSystem.
 * It maintains the same API for existing components while delegating
 * to the new production-ready sound system.
 *
 * @deprecated Use useSoundSystem directly for new components
 */

import { SoundId } from '@/config/sound';
import { useSoundSystem } from './useSoundSystem';

export function useSoundEffects() {
  const soundSystem = useSoundSystem();

  return {
    playSound: soundSystem.playSound,
    playSoundSequence: soundSystem.playSoundSequence,
    playBGM: soundSystem.playBGM,
    stopBGM: soundSystem.stopBGM,
    pauseBGM: soundSystem.pauseBGM,
    resumeBGM: soundSystem.resumeBGM,
    stopAllSounds: soundSystem.stopAllSounds,
    isEnabled: soundSystem.isEnabled,
    isBGMEnabled: soundSystem.isBGMEnabled,
    volume: soundSystem.volume,
  };
}

// Re-export types for convenience
export type { SoundId };
