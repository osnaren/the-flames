/**
 * Sound Configuration
 *
 * Central configuration for all audio assets in the application.
 * Organized by category (BGM, SFX) with metadata for playback control.
 */

export type SoundCategory = 'bgm' | 'sfx';

export interface SoundAsset {
  id: string;
  src: string;
  category: SoundCategory;
  volume?: number; // Default volume multiplier (0-1)
  loop?: boolean;
  preload?: boolean;
  /** Display name for UI */
  label?: string;
  /** Description for accessibility */
  description?: string;
}

export interface BGMTrack {
  id: string;
  label: string;
  description: string;
  icon?: string;
  seasonal?: boolean;
}

// ============================================================================
// SOUND ASSETS CONFIGURATION
// ============================================================================

export const SOUND_ASSETS = {
  // -------------------------------------------------------------------------
  // Background Music (BGM)
  // -------------------------------------------------------------------------
  bgm_default: {
    id: 'bgm_default',
    src: '/sounds/bgm-default.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Default',
    description: 'Playful romantic melody',
  },
  bgm_valentine: {
    id: 'bgm_valentine',
    src: '/sounds/bgm-valentine.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Valentine',
    description: 'Soft romantic ballad',
  },
  bgm_halloween: {
    id: 'bgm_halloween',
    src: '/sounds/bgm-halloween.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Halloween',
    description: 'Spooky playful tune',
  },
  bgm_christmas: {
    id: 'bgm_christmas',
    src: '/sounds/bgm-christmas.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Christmas',
    description: 'Festive holiday jingle',
  },
  bgm_chill: {
    id: 'bgm_chill',
    src: '/sounds/bgm-chill.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.3,
    label: 'Chill',
    description: 'Relaxing lo-fi beats',
  },

  // -------------------------------------------------------------------------
  // Sound Effects (SFX) - UI Interactions
  // -------------------------------------------------------------------------
  click: {
    id: 'click',
    src: '/sounds/click.mp3',
    category: 'sfx',
    volume: 0.4,
    preload: true,
    label: 'Click',
    description: 'Button click sound',
  },
  hover: {
    id: 'hover',
    src: '/sounds/hover.mp3',
    category: 'sfx',
    volume: 0.15,
    preload: true,
    label: 'Hover',
    description: 'Subtle hover feedback',
  },
  toggle: {
    id: 'toggle',
    src: '/sounds/toggle.mp3',
    category: 'sfx',
    volume: 0.35,
    preload: true,
    label: 'Toggle',
    description: 'Toggle switch sound',
  },

  // -------------------------------------------------------------------------
  // Sound Effects (SFX) - Game Events
  // -------------------------------------------------------------------------
  success: {
    id: 'success',
    src: '/sounds/success.mp3',
    category: 'sfx',
    volume: 0.55,
    preload: true,
    label: 'Success',
    description: 'Positive confirmation',
  },
  error: {
    id: 'error',
    src: '/sounds/error.mp3',
    category: 'sfx',
    volume: 0.45,
    preload: true,
    label: 'Error',
    description: 'Error notification',
  },
  calculating: {
    id: 'calculating',
    src: '/sounds/calculating.mp3',
    category: 'sfx',
    volume: 0.35,
    loop: true,
    preload: true,
    label: 'Calculating',
    description: 'Processing animation sound',
  },
  resultReveal: {
    id: 'resultReveal',
    src: '/sounds/reveal.mp3',
    category: 'sfx',
    volume: 0.6,
    preload: true,
    label: 'Result Reveal',
    description: 'Dramatic reveal sound',
  },
  letterStrike: {
    id: 'letterStrike',
    src: '/sounds/letter-strike.mp3',
    category: 'sfx',
    volume: 0.35,
    preload: true,
    label: 'Letter Strike',
    description: 'Letter elimination sound',
  },
  flamesCount: {
    id: 'flamesCount',
    src: '/sounds/flames-count.mp3',
    category: 'sfx',
    volume: 0.4,
    preload: true,
    label: 'Flames Count',
    description: 'Counting step sound',
  },
  badgeUnlock: {
    id: 'badgeUnlock',
    src: '/sounds/badge-unlock.mp3',
    category: 'sfx',
    volume: 0.6,
    preload: true,
    label: 'Badge Unlock',
    description: 'Achievement celebration',
  },
  formSubmit: {
    id: 'formSubmit',
    src: '/sounds/form-submit.mp3',
    category: 'sfx',
    volume: 0.5,
    preload: true,
    label: 'Form Submit',
    description: 'Form submission confirmation',
  },
  heartbeat: {
    id: 'heartbeat',
    src: '/sounds/heartbeat.mp3',
    category: 'sfx',
    volume: 0.45,
    loop: true,
    preload: true,
    label: 'Heartbeat',
    description: 'Romantic heartbeat sound',
  },
  sparkle: {
    id: 'sparkle',
    src: '/sounds/sparkle.mp3',
    category: 'sfx',
    volume: 0.4,
    preload: true,
    label: 'Sparkle',
    description: 'Magical sparkle effect',
  },
  whoosh: {
    id: 'whoosh',
    src: '/sounds/whoosh.mp3',
    category: 'sfx',
    volume: 0.35,
    preload: true,
    label: 'Whoosh',
    description: 'Transition swoosh sound',
  },
  pop: {
    id: 'pop',
    src: '/sounds/pop.mp3',
    category: 'sfx',
    volume: 0.4,
    preload: true,
    label: 'Pop',
    description: 'Bubble pop sound',
  },
} as const;

export type SoundId = keyof typeof SOUND_ASSETS;

// ============================================================================
// BGM TRACKS FOR UI SELECTION
// ============================================================================

export const BGM_TRACKS: BGMTrack[] = [
  {
    id: 'bgm_default',
    label: 'Romantic',
    description: 'Playful romantic melody',
    icon: '💕',
    seasonal: false,
  },
  {
    id: 'bgm_chill',
    label: 'Chill',
    description: 'Relaxing lo-fi beats',
    icon: '🎧',
    seasonal: false,
  },
  {
    id: 'bgm_valentine',
    label: 'Valentine',
    description: 'Soft romantic ballad',
    icon: '❤️',
    seasonal: true,
  },
  {
    id: 'bgm_halloween',
    label: 'Spooky',
    description: 'Playful spooky tune',
    icon: '🎃',
    seasonal: true,
  },
  {
    id: 'bgm_christmas',
    label: 'Festive',
    description: 'Holiday jingle',
    icon: '🎄',
    seasonal: true,
  },
];

// ============================================================================
// SFX SOUNDS FOR REFERENCE
// ============================================================================

export const SFX_SOUNDS = Object.entries(SOUND_ASSETS)
  .filter(([_, asset]) => asset.category === 'sfx')
  .map(([id, asset]) => ({
    id,
    label: asset.label || id,
    description: asset.description || '',
  }));

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getSoundAsset(id: SoundId): SoundAsset {
  return SOUND_ASSETS[id];
}

export function getBGMAssets(): SoundAsset[] {
  return Object.values(SOUND_ASSETS).filter((asset) => asset.category === 'bgm');
}

export function getSFXAssets(): SoundAsset[] {
  return Object.values(SOUND_ASSETS).filter((asset) => asset.category === 'sfx');
}

export function isBGMTrack(id: string): boolean {
  return id in SOUND_ASSETS && SOUND_ASSETS[id as SoundId].category === 'bgm';
}
