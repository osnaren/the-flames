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

export type MusicThemeGroup =
  | 'default'
  | 'playful'
  | 'chill'
  | 'valentine'
  | 'festive'
  | 'lunar'
  | 'eid'
  | 'spring'
  | 'monsoon'
  | 'autumn'
  | 'friendship'
  | 'party'
  | 'halloween'
  | 'christmas';

export interface TrackCredit {
  title: string;
  artist: string;
  license: string;
  url: string;
}

export interface BGMTrack {
  id: string;
  label: string;
  description: string;
  icon?: string;
  seasonal?: boolean;
  /** Theme group this track belongs to */
  themeGroup: MusicThemeGroup;
  /** Attribution for licensed music (shown in the player and credits). */
  credit?: TrackCredit;
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
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/mischief-makers.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Default',
    description: 'Playful romantic melody',
  },
  bgm_valentine: {
    id: 'bgm_valentine',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-valentine.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Valentine',
    description: 'Soft romantic ballad',
  },
  bgm_halloween: {
    id: 'bgm_halloween',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-halloween.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Halloween',
    description: 'Spooky playful tune',
  },
  bgm_christmas: {
    id: 'bgm_christmas',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-christmas.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Christmas',
    description: 'Festive holiday jingle',
  },
  bgm_chill: {
    id: 'bgm_chill',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-chill.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.3,
    label: 'Chill',
    description: 'Relaxing lo-fi beats',
  },

  // -------------------------------------------------------------------------
  // Licensed theme music (Kevin MacLeod, incompetech.com, CC BY 4.0).
  // Served from /public so new tracks ship with the app.
  // -------------------------------------------------------------------------
  bgm_romantic_2: {
    id: 'bgm_romantic_2',
    src: '/sounds/bgm/bgm-romantic-2.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Heartwarming',
    description: 'Tender piano warmth',
  },
  bgm_playful: {
    id: 'bgm_playful',
    src: '/sounds/bgm/bgm-playful.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Fluffing a Duck',
    description: 'Bouncy, cheeky fun',
  },
  bgm_playful_2: {
    id: 'bgm_playful_2',
    src: '/sounds/bgm/bgm-playful-2.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Monkeys Spinning Monkeys',
    description: 'Silly upbeat strut',
  },
  bgm_chill_2: {
    id: 'bgm_chill_2',
    src: '/sounds/bgm/bgm-chill-2.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Bossa Antigua',
    description: 'Laid-back bossa nova',
  },
  bgm_festive_india: {
    id: 'bgm_festive_india',
    src: '/sounds/bgm/bgm-festive-india.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Jalandhar',
    description: 'Groovy Indian percussion',
  },
  bgm_festive_colours: {
    id: 'bgm_festive_colours',
    src: '/sounds/bgm/bgm-festive-colours.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Sunflower Dance Party',
    description: 'Bright, colourful celebration',
  },
  bgm_rakhi: {
    id: 'bgm_rakhi',
    src: '/sounds/bgm/bgm-rakhi.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Vadodora',
    description: 'Warm South Asian groove',
  },
  bgm_lunar: {
    id: 'bgm_lunar',
    src: '/sounds/bgm/bgm-lunar.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Guzheng City',
    description: 'Plucked guzheng and drums',
  },
  bgm_eid: {
    id: 'bgm_eid',
    src: '/sounds/bgm/bgm-eid.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Ibn Al-Noor',
    description: 'Middle Eastern night breeze',
  },
  bgm_spring: {
    id: 'bgm_spring',
    src: '/sounds/bgm/bgm-spring.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Cherry Blossom',
    description: 'Gentle blossom season',
  },
  bgm_monsoon: {
    id: 'bgm_monsoon',
    src: '/sounds/bgm/bgm-monsoon.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Luminous Rain',
    description: 'Soft rainy-day glow',
  },
  bgm_autumn: {
    id: 'bgm_autumn',
    src: '/sounds/bgm/bgm-autumn.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Autumn Day',
    description: 'Golden afternoon calm',
  },
  bgm_friendship: {
    id: 'bgm_friendship',
    src: '/sounds/bgm/bgm-friendship.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Wholesome',
    description: 'Sunny feel-good vibes',
  },
  bgm_newyear: {
    id: 'bgm_newyear',
    src: '/sounds/bgm/bgm-newyear.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Celebration',
    description: 'Countdown party energy',
  },
  bgm_halloween_2: {
    id: 'bgm_halloween_2',
    src: '/sounds/bgm/bgm-halloween-2.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Ghost Dance',
    description: 'Mischievous spooky waltz',
  },
  bgm_christmas_2: {
    id: 'bgm_christmas_2',
    src: '/sounds/bgm/bgm-christmas-2.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.35,
    label: 'Jingle Bells (Calm)',
    description: 'Cosy fireside jingle',
  },

  // -------------------------------------------------------------------------
  // Result BGM
  // -------------------------------------------------------------------------
  bgm_result_love: {
    id: 'bgm_result_love',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-result-love.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Love Result',
    description: 'Romantic celebration',
  },
  bgm_result_friendship: {
    id: 'bgm_result_friendship',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-result-friendship.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Friendship Result',
    description: 'Upbeat friendship tune',
  },
  bgm_result_marriage: {
    id: 'bgm_result_marriage',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-result-marriage.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Marriage Result',
    description: 'Wedding march style',
  },
  bgm_result_enemy: {
    id: 'bgm_result_enemy',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-result-enemy.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Enemy Result',
    description: 'Dramatic tension',
  },
  bgm_result_sibling: {
    id: 'bgm_result_sibling',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-result-sibling.mp3',
    category: 'bgm',
    loop: true,
    volume: 0.4,
    label: 'Sibling Result',
    description: 'Playful tune',
  },
  bgm_result_affection: {
    id: 'bgm_result_affection',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/bgm/bgm-result-affection.mp3',
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
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/click.mp3',
    category: 'sfx',
    volume: 0.4,
    preload: true,
    label: 'Click',
    description: 'Button click sound',
  },
  hover: {
    id: 'hover',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/hover.mp3',
    category: 'sfx',
    volume: 0.15,
    preload: true,
    label: 'Hover',
    description: 'Subtle hover feedback',
  },
  toggle: {
    id: 'toggle',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/toggle.mp3',
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
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/success.mp3',
    category: 'sfx',
    volume: 0.55,
    preload: true,
    label: 'Success',
    description: 'Positive confirmation',
  },
  error: {
    id: 'error',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/error.mp3',
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
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/reveal.mp3',
    category: 'sfx',
    volume: 0.6,
    preload: true,
    label: 'Result Reveal',
    description: 'Dramatic reveal sound',
  },
  letterStrike: {
    id: 'letterStrike',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/letter-strike.mp3',
    category: 'sfx',
    volume: 0.35,
    preload: true,
    label: 'Letter Strike',
    description: 'Letter elimination sound',
  },
  flamesCount: {
    id: 'flamesCount',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/flames-count.mp3',
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
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/form-submit.mp3',
    category: 'sfx',
    volume: 0.5,
    preload: true,
    label: 'Form Submit',
    description: 'Form submission confirmation',
  },
  heartbeat: {
    id: 'heartbeat',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/heartbeat.mp3',
    category: 'sfx',
    volume: 0.45,
    loop: true,
    preload: true,
    label: 'Heartbeat',
    description: 'Romantic heartbeat sound',
  },
  sparkle: {
    id: 'sparkle',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/sparkle.mp3',
    category: 'sfx',
    volume: 0.4,
    preload: true,
    label: 'Sparkle',
    description: 'Magical sparkle effect',
  },
  whoosh: {
    id: 'whoosh',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/whoosh.mp3',
    category: 'sfx',
    volume: 0.35,
    preload: true,
    label: 'Whoosh',
    description: 'Transition swoosh sound',
  },
  pop: {
    id: 'pop',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/pop.mp3',
    category: 'sfx',
    volume: 0.4,
    preload: true,
    label: 'Pop',
    description: 'Bubble pop sound',
  },
  delete: {
    id: 'delete',
    src: 'https://cdn.osnaren.com/the-flames/v1/sounds/delete.mp3',
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
  { id: 'playful', label: 'Playful', icon: '🎈', description: 'Bouncy, cheeky tunes' },
  { id: 'chill', label: 'Chill', icon: '🎧', description: 'Relaxing lo-fi and bossa' },
  { id: 'friendship', label: 'Friendship', icon: '🤝', description: 'Sunny feel-good vibes', seasonal: true },
  { id: 'valentine', label: 'Valentine', icon: '❤️', description: 'Soft romantic ballads', seasonal: true },
  {
    id: 'festive',
    label: 'Desi Festive',
    icon: '🪔',
    description: 'Diwali, Holi, Onam, Pongal & Rakhi',
    seasonal: true,
  },
  { id: 'lunar', label: 'Lunar New Year', icon: '🏮', description: 'Guzheng and festival drums', seasonal: true },
  { id: 'eid', label: 'Eid Nights', icon: '🌙', description: 'Middle Eastern evening calm', seasonal: true },
  { id: 'spring', label: 'Spring', icon: '🌸', description: 'Blossom-season melodies', seasonal: true },
  { id: 'monsoon', label: 'Monsoon', icon: '🌧️', description: 'Rainy-day ambience', seasonal: true },
  { id: 'autumn', label: 'Autumn', icon: '🍂', description: 'Golden afternoon calm', seasonal: true },
  { id: 'halloween', label: 'Spooky', icon: '🎃', description: 'Playful spooky tunes', seasonal: true },
  { id: 'christmas', label: 'Festive', icon: '🎄', description: 'Holiday jingles', seasonal: true },
  { id: 'party', label: 'New Year', icon: '🎉', description: 'Countdown party energy', seasonal: true },
];

const MACLEOD = (title: string): TrackCredit => ({
  title,
  artist: 'Kevin MacLeod (incompetech.com)',
  license: 'CC BY 4.0',
  url: 'https://creativecommons.org/licenses/by/4.0/',
});

// ============================================================================
// BGM TRACKS FOR UI SELECTION (Supports multiple tracks per theme)
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
  {
    id: 'bgm_romantic_2',
    label: 'Heartwarming',
    description: 'Tender piano warmth',
    icon: '💗',
    seasonal: false,
    themeGroup: 'default',
    credit: MACLEOD('Heartwarming'),
  },
  {
    id: 'bgm_playful',
    label: 'Fluffing a Duck',
    description: 'Bouncy, cheeky fun',
    icon: '🦆',
    seasonal: false,
    themeGroup: 'playful',
    credit: MACLEOD('Fluffing a Duck'),
  },
  {
    id: 'bgm_playful_2',
    label: 'Monkeys Spinning Monkeys',
    description: 'Silly upbeat strut',
    icon: '🐒',
    seasonal: false,
    themeGroup: 'playful',
    credit: MACLEOD('Monkeys Spinning Monkeys'),
  },
  {
    id: 'bgm_chill_2',
    label: 'Bossa Antigua',
    description: 'Laid-back bossa nova',
    icon: '☕',
    seasonal: false,
    themeGroup: 'chill',
    credit: MACLEOD('Bossa Antigua'),
  },
  {
    id: 'bgm_festive_india',
    label: 'Jalandhar',
    description: 'Groovy Indian percussion',
    icon: '🪔',
    seasonal: true,
    themeGroup: 'festive',
    credit: MACLEOD('Jalandhar'),
  },
  {
    id: 'bgm_festive_colours',
    label: 'Sunflower Dance Party',
    description: 'Bright, colourful celebration',
    icon: '🎨',
    seasonal: true,
    themeGroup: 'festive',
    credit: MACLEOD('Sunflower Dance Party'),
  },
  {
    id: 'bgm_rakhi',
    label: 'Vadodora',
    description: 'Warm South Asian groove',
    icon: '🪢',
    seasonal: true,
    themeGroup: 'festive',
    credit: MACLEOD('Vadodora'),
  },
  {
    id: 'bgm_lunar',
    label: 'Guzheng City',
    description: 'Plucked guzheng and drums',
    icon: '🏮',
    seasonal: true,
    themeGroup: 'lunar',
    credit: MACLEOD('Guzheng City'),
  },
  {
    id: 'bgm_eid',
    label: 'Ibn Al-Noor',
    description: 'Middle Eastern night breeze',
    icon: '🌙',
    seasonal: true,
    themeGroup: 'eid',
    credit: MACLEOD('Ibn Al-Noor'),
  },
  {
    id: 'bgm_spring',
    label: 'Cherry Blossom',
    description: 'Gentle blossom season',
    icon: '🌸',
    seasonal: true,
    themeGroup: 'spring',
    credit: MACLEOD('Cherry Blossom'),
  },
  {
    id: 'bgm_monsoon',
    label: 'Luminous Rain',
    description: 'Soft rainy-day glow',
    icon: '🌧️',
    seasonal: true,
    themeGroup: 'monsoon',
    credit: MACLEOD('Luminous Rain'),
  },
  {
    id: 'bgm_autumn',
    label: 'Autumn Day',
    description: 'Golden afternoon calm',
    icon: '🍂',
    seasonal: true,
    themeGroup: 'autumn',
    credit: MACLEOD('Autumn Day'),
  },
  {
    id: 'bgm_friendship',
    label: 'Wholesome',
    description: 'Sunny feel-good vibes',
    icon: '🤝',
    seasonal: true,
    themeGroup: 'friendship',
    credit: MACLEOD('Wholesome'),
  },
  {
    id: 'bgm_newyear',
    label: 'Celebration',
    description: 'Countdown party energy',
    icon: '🎉',
    seasonal: true,
    themeGroup: 'party',
    credit: MACLEOD('Celebration'),
  },
  {
    id: 'bgm_halloween_2',
    label: 'Ghost Dance',
    description: 'Mischievous spooky waltz',
    icon: '👻',
    seasonal: true,
    themeGroup: 'halloween',
    credit: MACLEOD('Ghost Dance'),
  },
  {
    id: 'bgm_christmas_2',
    label: 'Jingle Bells (Calm)',
    description: 'Cosy fireside jingle',
    icon: '🔔',
    seasonal: true,
    themeGroup: 'christmas',
    credit: MACLEOD('Jingle Bells (Calm)'),
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

/** Map a seasonal (visual) theme to the music group that suits it. */
export function getMatchingMusicTheme(seasonalTheme: string): MusicThemeGroup {
  const themeMap: Record<string, MusicThemeGroup> = {
    valentine: 'valentine',
    halloween: 'halloween',
    christmas: 'christmas',
    newYear: 'party',
    diwali: 'festive',
    holi: 'festive',
    onam: 'festive',
    pongal: 'festive',
    rakhi: 'festive',
    lunarNewYear: 'lunar',
    eid: 'eid',
    spring: 'spring',
    monsoon: 'monsoon',
    autumn: 'autumn',
    friendship: 'friendship',
    default: 'default',
  };
  return themeMap[seasonalTheme] || 'default';
}

/**
 * Resolve which music group and starting track should play.
 * `musicTheme` 'auto' follows the active seasonal theme (itself possibly auto-detected).
 */
export function resolveMusic(
  musicTheme: string,
  activeSeasonalTheme: string
): { group: MusicThemeGroup; track?: BGMTrack } {
  if (musicTheme !== 'auto') {
    const group = musicTheme as MusicThemeGroup;
    return { group, track: getTracksForTheme(group)[0] };
  }
  return { group: getMatchingMusicTheme(activeSeasonalTheme), track: getPreferredTrackForTheme(activeSeasonalTheme) };
}

/** Preferred first track for a seasonal theme within its music group. */
export function getPreferredTrackForTheme(seasonalTheme: string): BGMTrack | undefined {
  const group = getMatchingMusicTheme(seasonalTheme);
  const tracks = getTracksForTheme(group);
  if (seasonalTheme === 'rakhi') return tracks.find((t) => t.id === 'bgm_rakhi') ?? tracks[0];
  if (seasonalTheme === 'holi') return tracks.find((t) => t.id === 'bgm_festive_colours') ?? tracks[0];
  return tracks[0];
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
