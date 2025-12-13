/**
 * Recent Matches Type Definitions
 */
import type { FlamesResult } from '@/utils/resultData';

/**
 * Individual match entry stored in localStorage
 */
export interface MatchEntry {
  /** Unique identifier for the match */
  id: string;
  /** First person's name */
  name1: string;
  /** Second person's name */
  name2: string;
  /** FLAMES result (F, L, A, M, E, S) */
  result: NonNullable<FlamesResult>;
  /** Unix timestamp when the match was created */
  timestamp: number;
}

/**
 * Display-ready match data with computed properties
 */
export interface DisplayMatch extends MatchEntry {
  /** Human-readable relative time (e.g., "2 hours ago") */
  relativeTime: string;
  /** Result display data (color, emoji, text) */
  resultData: {
    text: string;
    emoji: string;
    color: string;
    gradientClass: string;
  };
  /** Truncated names if they exceed max length */
  displayName1: string;
  displayName2: string;
}

/**
 * Hook return type for useRecentMatches
 */
export interface UseRecentMatchesReturn {
  /** All stored matches */
  matches: MatchEntry[];
  /** Display-ready matches with computed properties */
  displayMatches: DisplayMatch[];
  /** Total count of stored matches */
  totalCount: number;
  /** Whether the matches are still loading from storage */
  isLoading: boolean;
  /** Whether there are any matches */
  hasMatches: boolean;
  /** Remove a specific match by ID */
  removeMatch: (id: string) => void;
  /** Clear all match history */
  clearAllMatches: () => void;
  /** Get a limited number of matches for display */
  getDisplayMatches: (limit?: number) => DisplayMatch[];
}

/**
 * Props for the RecentMatchesSection component
 */
export interface RecentMatchesSectionProps {
  /** Number of matches to display (default from config) */
  displayCount?: number;
  /** Callback when a match is clicked for replay */
  onMatchClick?: (match: MatchEntry) => void;
  /** Whether to show the section header */
  showHeader?: boolean;
  /** Custom class name for styling */
  className?: string;
}

/**
 * Props for individual match item component
 */
export interface MatchItemProps {
  /** The match data to display */
  match: DisplayMatch;
  /** Animation delay index for staggered animations */
  index: number;
  /** Callback when the match is clicked */
  onClick?: (match: MatchEntry) => void;
  /** Whether the item should animate */
  shouldAnimate: boolean;
}

/**
 * Props for empty state component
 */
export interface EmptyStateProps {
  /** Whether to animate the empty state */
  shouldAnimate: boolean;
}
