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
  /** Theme group this track belongs to */
  themeGroup: 'default' | 'chill' | 'valentine' | 'halloween' | 'christmas';
}

/** Theme group configuration for UI */
export interface ThemeGroup {
  id: string;
  label: string;
  icon: string;
  description: string;
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
    src: '/sounds/bgm/mischief-makers.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Default',
    description: 'Playful romantic melody',
  },
  bgm_valentine: {
    id: 'bgm_valentine',
    src: '/sounds/bgm/bgm-valentine.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Valentine',
    description: 'Soft romantic ballad',
  },
  bgm_halloween: {
    id: 'bgm_halloween',
    src: '/sounds/bgm/bgm-halloween.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Halloween',
    description: 'Spooky playful tune',
  },
  bgm_christmas: {
    id: 'bgm_christmas',
    src: '/sounds/bgm/bgm-christmas.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Christmas',
    description: 'Festive holiday jingle',
  },
  bgm_chill: {
    id: 'bgm_chill',
    src: '/sounds/bgm/bgm-chill.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.3,
    label: 'Chill',
    description: 'Relaxing lo-fi beats',
  },

  // -------------------------------------------------------------------------
  // Result BGM
  // -------------------------------------------------------------------------
  bgm_result_love: {
    id: 'bgm_result_love',
    src: '/sounds/bgm/bgm-result-love.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Love Result',
    description: 'Romantic celebration',
  },
  bgm_result_friendship: {
    id: 'bgm_result_friendship',
    src: '/sounds/bgm/bgm-result-friendship.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Friendship Result',
    description: 'Upbeat friendship tune',
  },
  bgm_result_marriage: {
    id: 'bgm_result_marriage',
    src: '/sounds/bgm/bgm-result-marriage.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Marriage Result',
    description: 'Wedding march style',
  },
  bgm_result_enemy: {
    id: 'bgm_result_enemy',
    src: '/sounds/bgm/bgm-result-enemy.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Enemy Result',
    description: 'Dramatic tension',
  },
  bgm_result_sibling: {
    id: 'bgm_result_sibling',
    src: '/sounds/bgm/bgm-result-sibling.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Sibling Result',
    description: 'Playful tune',
  },
  bgm_result_affection: {
    id: 'bgm_result_affection',
    src: '/sounds/bgm/bgm-result-affection.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Affection Result',
    description: 'Sweet melody',
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
  // calculating: {
  //   id: 'calculating',
  //   src: '/sounds/calculating.mp3',
  //   category: 'sfx',
  //   volume: 0.35,
  //   loop: true,
  //   preload: true,
  //   label: 'Calculating',
  //   description: 'Processing animation sound',
  // },
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
  // badgeUnlock: {
  //   id: 'badgeUnlock',
  //   src: '/sounds/badge-unlock.mp3',
  //   category: 'sfx',
  //   volume: 0.6,
  //   preload: true,
  //   label: 'Badge Unlock',
  //   description: 'Achievement celebration',
  // },
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
  delete: {
    id: 'delete',
    src: '/sounds/delete.mp3',
    category: 'sfx',
    volume: 0.5,
    preload: true,
    label: 'Delete',
    description: 'Item deletion sound',
  },
} as const;

export type SoundId = keyof typeof SOUND_ASSETS;

// ============================================================================
// THEME GROUPS FOR UI SELECTION
// ============================================================================

export const THEME_GROUPS: ThemeGroup[] = [
  { id: 'default', label: 'Romantic', icon: '💕', description: 'Playful romantic melodies' },
  { id: 'chill', label: 'Chill', icon: '🎧', description: 'Relaxing lo-fi beats' },
  { id: 'valentine', label: 'Valentine', icon: '❤️', description: 'Soft romantic ballads', seasonal: true },
  { id: 'halloween', label: 'Spooky', icon: '🎃', description: 'Playful spooky tunes', seasonal: true },
  { id: 'christmas', label: 'Festive', icon: '🎄', description: 'Holiday jingles', seasonal: true },
];

// ============================================================================
// BGM TRACKS FOR UI SELECTION (Multiple tracks per theme)
// ============================================================================

export const BGM_TRACKS: BGMTrack[] = [
  // Default theme tracks
  {
    id: 'bgm_default',
    label: 'Mischief Makers',
    description: 'Playful romantic melody',
    icon: '💕',
    seasonal: false,
    themeGroup: 'default',
  },
  // Chill theme tracks
  {
    id: 'bgm_chill',
    label: 'Lo-Fi Dreams',
    description: 'Relaxing lo-fi beats',
    icon: '🎧',
    seasonal: false,
    themeGroup: 'chill',
  },
  // Valentine theme tracks
  {
    id: 'bgm_valentine',
    label: 'Love Ballad',
    description: 'Soft romantic ballad',
    icon: '❤️',
    seasonal: true,
    themeGroup: 'valentine',
  },
  // Halloween theme tracks
  {
    id: 'bgm_halloween',
    label: 'Spooky Night',
    description: 'Playful spooky tune',
    icon: '🎃',
    seasonal: true,
    themeGroup: 'halloween',
  },
  // Christmas theme tracks
  {
    id: 'bgm_christmas',
    label: 'Holiday Jingle',
    description: 'Festive holiday jingle',
    icon: '🎄',
    seasonal: true,
    themeGroup: 'christmas',
  },
];

/** Get tracks for a specific theme group */
export function getTracksForTheme(themeGroup: string): BGMTrack[] {
  return BGM_TRACKS.filter((track) => track.themeGroup === themeGroup);
}

/** Get the current track index within its theme group */
export function getTrackIndexInTheme(trackId: string): number {
  const track = BGM_TRACKS.find((t) => t.id === trackId);
  if (!track) return 0;
  const themeTracks = getTracksForTheme(track.themeGroup);
  return themeTracks.findIndex((t) => t.id === trackId);
}

/** Get next/prev track within the same theme group */
export function cycleTrackInTheme(currentTrackId: string, direction: 'next' | 'prev'): BGMTrack | null {
  const currentTrack = BGM_TRACKS.find((t) => t.id === currentTrackId);
  if (!currentTrack) return null;

  const themeTracks = getTracksForTheme(currentTrack.themeGroup);
  if (themeTracks.length <= 1) return currentTrack;

  const currentIndex = themeTracks.findIndex((t) => t.id === currentTrackId);
  let newIndex: number;

  if (direction === 'next') {
    newIndex = (currentIndex + 1) % themeTracks.length;
  } else {
    newIndex = (currentIndex - 1 + themeTracks.length) % themeTracks.length;
  }

  return themeTracks[newIndex];
}

/** Map seasonal theme to music theme */
export function getMatchingMusicTheme(
  seasonalTheme: string
): 'default' | 'chill' | 'valentine' | 'halloween' | 'christmas' {
  const themeMap: Record<string, 'default' | 'chill' | 'valentine' | 'halloween' | 'christmas'> = {
    valentine: 'valentine',
    halloween: 'halloween',
    christmas: 'christmas',
    newYear: 'christmas',
    diwali: 'default',
    holi: 'default',
    onam: 'default',
    pongal: 'default',
    default: 'default',
    auto: 'default',
  };
  return themeMap[seasonalTheme] || 'default';
}

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
