import { FlamesResult } from '@features/flamesGame/flames.types';
import { useCallback, useEffect, useState } from 'react';

interface PairingEntry {
  id: string;
  name1: string;
  name2: string;
  result: FlamesResult;
  timestamp: number;
  anonymous: boolean;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
}

interface PairingStats {
  totalPairings: number;
  uniqueResults: Set<FlamesResult>;
  consecutiveLove: number;
  maxConsecutiveLove: number;
  resultCounts: Record<NonNullable<FlamesResult>, number>;
}

const STORAGE_KEY = 'flames-pairing-history';
const BADGES_KEY = 'flames-badges';

// Badge definitions
const BADGE_DEFINITIONS: Omit<Badge, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'heartthrob',
    title: 'Heartthrob',
    description: 'Get Love result 3 times in a row',
    emoji: '💓',
  },
  {
    id: 'flames-explorer',
    title: 'FLAMES Explorer',
    description: 'Get all 6 different outcomes',
    emoji: '🗺️',
  },
  {
    id: 'friendship-guru',
    title: 'Friendship Guru',
    description: 'Get Friends result 5 times',
    emoji: '🤝',
  },
  {
    id: 'love-magnet',
    title: 'Love Magnet',
    description: 'Get Love result 10 times',
    emoji: '🧲',
  },
  {
    id: 'matchmaker',
    title: 'Matchmaker',
    description: 'Get Marriage result 5 times',
    emoji: '💒',
  },
  {
    id: 'peacekeeper',
    title: 'Peacekeeper',
    description: 'Turn an Enemy result into Love in the next try',
    emoji: '🕊️',
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Complete 100 pairings',
    emoji: '💯',
  },
  {
    id: 'daily-player',
    title: 'Daily Player',
    description: 'Play for 7 consecutive days',
    emoji: '📅',
  },
];

/**
 * Hook for managing pairing history and achievement badges
 */
export function usePairingHistory() {
  const [history, setHistory] = useState<PairingEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<PairingStats>({
    totalPairings: 0,
    uniqueResults: new Set(),
    consecutiveLove: 0,
    maxConsecutiveLove: 0,
    resultCounts: { F: 0, L: 0, A: 0, M: 0, E: 0, S: 0 },
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      const savedBadges = localStorage.getItem(BADGES_KEY);

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        calculateStats(parsedHistory);
      }

      if (savedBadges) {
        setBadges(JSON.parse(savedBadges));
      } else {
        // Initialize badges
        const initialBadges = BADGE_DEFINITIONS.map((badge) => ({
          ...badge,
          unlocked: false,
        }));
        setBadges(initialBadges);
      }
    } catch (error) {
      console.error('Error loading pairing history:', error);
    }
  }, []);

  // Calculate statistics from history
  const calculateStats = useCallback((historyData: PairingEntry[]) => {
    const resultCounts = { F: 0, L: 0, A: 0, M: 0, E: 0, S: 0 };
    const uniqueResults = new Set<FlamesResult>();
    let consecutiveLove = 0;
    let maxConsecutiveLove = 0;

    // Sort by timestamp to get correct order
    const sortedHistory = [...historyData].sort((a, b) => a.timestamp - b.timestamp);

    sortedHistory.forEach((entry, index) => {
      if (entry.result) {
        resultCounts[entry.result]++;
        uniqueResults.add(entry.result);

        // Track consecutive love results
        if (entry.result === 'L') {
          consecutiveLove++;
          maxConsecutiveLove = Math.max(maxConsecutiveLove, consecutiveLove);
        } else {
          consecutiveLove = 0;
        }
      }
    });

    setStats({
      totalPairings: historyData.length,
      uniqueResults,
      consecutiveLove,
      maxConsecutiveLove,
      resultCounts,
    });
  }, []);

  // Add a new pairing to history
  const addPairing = useCallback(
    (name1: string, name2: string, result: FlamesResult, anonymous: boolean = false) => {
      const newEntry: PairingEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name1: anonymous ? '' : name1,
        name2: anonymous ? '' : name2,
        result,
        timestamp: Date.now(),
        anonymous,
      };

      const updatedHistory = [newEntry, ...history].slice(0, 100); // Keep only last 100 entries
      setHistory(updatedHistory);
      calculateStats(updatedHistory);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving pairing history:', error);
      }

      // Check for new badges
      checkBadges(updatedHistory, newEntry);
    },
    [history, calculateStats]
  );

  // Check and unlock badges
  const checkBadges = useCallback(
    (historyData: PairingEntry[], latestEntry: PairingEntry) => {
      const updatedBadges = [...badges];
      let hasNewBadges = false;

      // Heartthrob: 3 consecutive Love results
      const heartthrobBadge = updatedBadges.find((b) => b.id === 'heartthrob');
      if (heartthrobBadge && !heartthrobBadge.unlocked) {
        const recentEntries = historyData.slice(0, 3);
        if (recentEntries.length === 3 && recentEntries.every((e) => e.result === 'L')) {
          heartthrobBadge.unlocked = true;
          heartthrobBadge.unlockedAt = Date.now();
          hasNewBadges = true;
        }
      }

      // FLAMES Explorer: All 6 different outcomes
      const explorerBadge = updatedBadges.find((b) => b.id === 'flames-explorer');
      if (explorerBadge && !explorerBadge.unlocked) {
        const uniqueResults = new Set(historyData.map((e) => e.result));
        if (uniqueResults.size === 6) {
          explorerBadge.unlocked = true;
          explorerBadge.unlockedAt = Date.now();
          hasNewBadges = true;
        }
      }

      // Friendship Guru: 5 Friends results
      const friendshipBadge = updatedBadges.find((b) => b.id === 'friendship-guru');
      if (friendshipBadge && !friendshipBadge.unlocked) {
        const friendsCount = historyData.filter((e) => e.result === 'F').length;
        if (friendsCount >= 5) {
          friendshipBadge.unlocked = true;
          friendshipBadge.unlockedAt = Date.now();
          hasNewBadges = true;
        }
      }

      // Love Magnet: 10 Love results
      const loveBadge = updatedBadges.find((b) => b.id === 'love-magnet');
      if (loveBadge && !loveBadge.unlocked) {
        const loveCount = historyData.filter((e) => e.result === 'L').length;
        if (loveCount >= 10) {
          loveBadge.unlocked = true;
          loveBadge.unlockedAt = Date.now();
          hasNewBadges = true;
        }
      }

      // Matchmaker: 5 Marriage results
      const matchmakerBadge = updatedBadges.find((b) => b.id === 'matchmaker');
      if (matchmakerBadge && !matchmakerBadge.unlocked) {
        const marriageCount = historyData.filter((e) => e.result === 'M').length;
        if (marriageCount >= 5) {
          matchmakerBadge.unlocked = true;
          matchmakerBadge.unlockedAt = Date.now();
          hasNewBadges = true;
        }
      }

      // Peacekeeper: Enemy to Love conversion
      const peacekeeperBadge = updatedBadges.find((b) => b.id === 'peacekeeper');
      if (peacekeeperBadge && !peacekeeperBadge.unlocked && historyData.length >= 2) {
        const [latest, previous] = historyData;
        if (previous.result === 'E' && latest.result === 'L') {
          peacekeeperBadge.unlocked = true;
          peacekeeperBadge.unlockedAt = Date.now();
          hasNewBadges = true;
        }
      }

      // Century Club: 100 pairings
      const centuryBadge = updatedBadges.find((b) => b.id === 'century-club');
      if (centuryBadge && !centuryBadge.unlocked && historyData.length >= 100) {
        centuryBadge.unlocked = true;
        centuryBadge.unlockedAt = Date.now();
        hasNewBadges = true;
      }

      if (hasNewBadges) {
        setBadges(updatedBadges);
        try {
          localStorage.setItem(BADGES_KEY, JSON.stringify(updatedBadges));
        } catch (error) {
          console.error('Error saving badges:', error);
        }
      }
    },
    [badges]
  );

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setStats({
      totalPairings: 0,
      uniqueResults: new Set(),
      consecutiveLove: 0,
      maxConsecutiveLove: 0,
      resultCounts: { F: 0, L: 0, A: 0, M: 0, E: 0, S: 0 },
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  // Get recent pairings
  const getRecentPairings = useCallback(
    (limit: number = 10) => {
      return history.slice(0, limit);
    },
    [history]
  );

  // Get newly unlocked badges
  const getNewlyUnlockedBadges = useCallback(() => {
    const oneMinuteAgo = Date.now() - 60000; // 1 minute
    return badges.filter((badge) => badge.unlocked && badge.unlockedAt && badge.unlockedAt > oneMinuteAgo);
  }, [badges]);

  return {
    history,
    badges,
    stats,
    addPairing,
    clearHistory,
    getRecentPairings,
    getNewlyUnlockedBadges,
    unlockedBadges: badges.filter((b) => b.unlocked),
    totalBadges: badges.length,
  };
}
