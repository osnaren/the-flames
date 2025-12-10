/**
 * Recent Matches Configuration
 * Centralized configuration for the recent matches feature
 */

export const RECENT_MATCHES_CONFIG = {
  /**
   * Maximum number of matches to store in localStorage
   * Older matches will be automatically removed when this limit is exceeded
   */
  MAX_STORAGE_LIMIT: 100,

  /**
   * Default number of matches to display in the UI
   * Can be overridden by component props
   */
  DEFAULT_DISPLAY_COUNT: 5,

  /**
   * Maximum number of matches that can be displayed
   * UI will never show more than this even if requested
   */
  MAX_DISPLAY_COUNT: 20,

  /**
   * Minimum number of matches required to show the section
   * Set to 0 to always show (with empty state)
   */
  MIN_MATCHES_TO_SHOW: 0,

  /**
   * LocalStorage key for storing match history
   * Shared with usePairingHistory for consistency
   */
  STORAGE_KEY: 'flames-pairing-history',

  /**
   * Time thresholds for relative time display (in milliseconds)
   */
  TIME_THRESHOLDS: {
    JUST_NOW: 60 * 1000, // 1 minute
    MINUTES_AGO: 60 * 60 * 1000, // 1 hour
    HOURS_AGO: 24 * 60 * 60 * 1000, // 24 hours
    DAYS_AGO: 7 * 24 * 60 * 60 * 1000, // 7 days
    WEEKS_AGO: 30 * 24 * 60 * 60 * 1000, // 30 days
  },

  /**
   * Animation configuration for the recent matches section
   */
  ANIMATION: {
    /** Stagger delay between each match item animation (seconds) */
    STAGGER_DELAY: 0.08,
    /** Duration of individual item animations (seconds) */
    ITEM_DURATION: 0.4,
    /** Duration of section entrance animation (seconds) */
    SECTION_DURATION: 0.5,
    /** Delay before section appears (seconds) */
    SECTION_DELAY: 0.3,
  },

  /**
   * UI Configuration
   */
  UI: {
    /** Show "View All" button when matches exceed display count */
    SHOW_VIEW_ALL_THRESHOLD: 3,
    /** Enable click to replay match */
    ENABLE_REPLAY: true,
    /** Show relative time for matches */
    SHOW_RELATIVE_TIME: true,
    /** Truncate names longer than this */
    MAX_NAME_LENGTH: 15,
  },
} as const;

export type RecentMatchesConfig = typeof RECENT_MATCHES_CONFIG;
