/**
 * useRecentMatches Hook
 * Provides recent match history with display-ready computed properties
 */
import { RECENT_MATCHES_CONFIG } from '@/config/recentMatches';
import type { FlamesResult } from '@/utils/resultData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DisplayMatch, MatchEntry, UseRecentMatchesReturn } from '../components/RecentMatches/types';

/**
 * Result metadata for display purposes
 */
const RESULT_DISPLAY_DATA: Record<
  NonNullable<FlamesResult>,
  { text: string; emoji: string; color: string; gradientClass: string }
> = {
  F: {
    text: 'Friends',
    emoji: '🤝',
    color: 'var(--color-friendship)',
    gradientClass: 'from-blue-500 to-cyan-500',
  },
  L: {
    text: 'Love',
    emoji: '❤️',
    color: 'var(--color-love)',
    gradientClass: 'from-pink-500 to-rose-500',
  },
  A: {
    text: 'Affection',
    emoji: '🥰',
    color: 'var(--color-affection)',
    gradientClass: 'from-amber-500 to-orange-500',
  },
  M: {
    text: 'Marriage',
    emoji: '💍',
    color: 'var(--color-marriage)',
    gradientClass: 'from-emerald-500 to-green-500',
  },
  E: {
    text: 'Enemies',
    emoji: '⚔️',
    color: 'var(--color-enemy)',
    gradientClass: 'from-red-500 to-red-600',
  },
  S: {
    text: 'Siblings',
    emoji: '👫',
    color: 'var(--color-siblings)',
    gradientClass: 'from-purple-500 to-violet-500',
  },
};

/**
 * Calculate relative time string from timestamp
 */
function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const { TIME_THRESHOLDS } = RECENT_MATCHES_CONFIG;

  if (diff < TIME_THRESHOLDS.JUST_NOW) {
    return 'Just now';
  }

  if (diff < TIME_THRESHOLDS.MINUTES_AGO) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  if (diff < TIME_THRESHOLDS.HOURS_AGO) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (diff < TIME_THRESHOLDS.DAYS_AGO) {
    const days = Math.floor(diff / 86400000);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  if (diff < TIME_THRESHOLDS.WEEKS_AGO) {
    const weeks = Math.floor(diff / 604800000);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  // Format as date for older entries
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  // Add year if it's not the current year
  if (date.getFullYear() !== new Date().getFullYear()) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString(undefined, options);
}

/**
 * Truncate name to max length with ellipsis
 */
function truncateName(name: string, maxLength: number): string {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength - 1)}…`;
}

/**
 * Transform raw match entry to display-ready format
 */
function toDisplayMatch(match: MatchEntry): DisplayMatch {
  const { MAX_NAME_LENGTH } = RECENT_MATCHES_CONFIG.UI;

  return {
    ...match,
    relativeTime: getRelativeTime(match.timestamp),
    resultData: RESULT_DISPLAY_DATA[match.result],
    displayName1: truncateName(match.name1, MAX_NAME_LENGTH),
    displayName2: truncateName(match.name2, MAX_NAME_LENGTH),
  };
}

/**
 * Safe localStorage access (SSR-safe)
 */
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Handle quota exceeded or private browsing
    }
  },
};

/**
 * Validate match entry structure
 */
function isValidMatchEntry(entry: unknown): entry is MatchEntry {
  if (!entry || typeof entry !== 'object') return false;

  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.name1 === 'string' &&
    typeof e.name2 === 'string' &&
    typeof e.result === 'string' &&
    ['F', 'L', 'A', 'M', 'E', 'S'].includes(e.result as string) &&
    typeof e.timestamp === 'number'
  );
}

/**
 * Hook for accessing and managing recent matches
 */
export function useRecentMatches(): UseRecentMatchesReturn {
  const [matches, setMatches] = useState<MatchEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load matches from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const loadMatches = () => {
      try {
        const stored = safeStorage.getItem(RECENT_MATCHES_CONFIG.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Validate and filter entries
            const validMatches = parsed.filter(isValidMatchEntry);
            // Sort by timestamp (most recent first)
            validMatches.sort((a, b) => b.timestamp - a.timestamp);
            // Apply storage limit
            const limitedMatches = validMatches.slice(0, RECENT_MATCHES_CONFIG.MAX_STORAGE_LIMIT);
            setMatches(limitedMatches);
          }
        }
      } catch {
        // Failed to parse - start fresh
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RECENT_MATCHES_CONFIG.STORAGE_KEY) {
        loadMatches();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Subscribe to localStorage changes within the same tab (custom event)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocalUpdate = () => {
      const stored = safeStorage.getItem(RECENT_MATCHES_CONFIG.STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const validMatches = parsed.filter(isValidMatchEntry);
            validMatches.sort((a, b) => b.timestamp - a.timestamp);
            setMatches(validMatches.slice(0, RECENT_MATCHES_CONFIG.MAX_STORAGE_LIMIT));
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    // Custom event for same-tab updates
    window.addEventListener('flames-history-update', handleLocalUpdate);
    return () => window.removeEventListener('flames-history-update', handleLocalUpdate);
  }, []);

  // Transform matches to display format with memoization
  const displayMatches = useMemo(() => matches.map(toDisplayMatch), [matches]);

  // Get limited display matches
  const getDisplayMatches = useCallback(
    (limit?: number): DisplayMatch[] => {
      const count = Math.min(
        limit ?? RECENT_MATCHES_CONFIG.DEFAULT_DISPLAY_COUNT,
        RECENT_MATCHES_CONFIG.MAX_DISPLAY_COUNT,
        displayMatches.length
      );
      return displayMatches.slice(0, count);
    },
    [displayMatches]
  );

  // Remove a specific match
  const removeMatch = useCallback((id: string) => {
    setMatches((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      safeStorage.setItem(RECENT_MATCHES_CONFIG.STORAGE_KEY, JSON.stringify(updated));
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('flames-history-update'));
      return updated;
    });
  }, []);

  // Clear all matches
  const clearAllMatches = useCallback(() => {
    setMatches([]);
    safeStorage.setItem(RECENT_MATCHES_CONFIG.STORAGE_KEY, JSON.stringify([]));
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('flames-history-update'));
  }, []);

  return {
    matches,
    displayMatches,
    totalCount: matches.length,
    isLoading,
    hasMatches: matches.length > 0,
    removeMatch,
    clearAllMatches,
    getDisplayMatches,
  };
}

export default useRecentMatches;
