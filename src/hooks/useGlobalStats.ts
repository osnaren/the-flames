import { NonNullFlamesResult } from '@/features/flamesGame';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GlobalStats } from '../components/layout/GlobalCharts/types';
import { getStatsWithTrends, getUserCountry, StatsError, TimeWindow } from '../lib/supabase';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const statsCache = new Map<string, { data: GlobalStats; timestamp: number }>();

// Default values for when data is missing
const DEFAULT_STATS: GlobalStats = {
  totalMatches: 0,
  todayMatches: 0,
  popularNames: [],
  resultStats: [],
  popularPairs: [],
  regionalStats: null,
};

export function useGlobalStats(timeWindow: TimeWindow = 'today') {
  const [data, setData] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  // Fetch user's country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const country = await getUserCountry();
        setUserCountry(country);
      } catch (error) {
        console.error('Failed to detect country:', error);
        // Don't set error state - country detection is non-critical
      }
    };
    detectCountry();
  }, []);

  // Transform raw stats into our GlobalStats format with null checks
  const transformStats = useCallback((rawStats: unknown): GlobalStats => {
    if (!rawStats || typeof rawStats !== 'object') {
      return DEFAULT_STATS;
    }

    const stats = rawStats as Record<string, unknown>;

    return {
      totalMatches: typeof stats.total === 'number' ? stats.total : 0,
      todayMatches: typeof stats.today === 'number' ? stats.today : 0,
      popularNames: (Array.isArray(stats.names) ? stats.names : []).map((name: unknown) => {
        const nameObj = name as Record<string, unknown>;
        return {
          name: typeof nameObj?.name === 'string' ? nameObj.name : '',
          count: typeof nameObj?.current_count === 'number' ? nameObj.current_count : 0,
          trend: typeof nameObj?.trend_percentage === 'number' ? Number(nameObj.trend_percentage) : 0,
        };
      }),
      resultStats: (Array.isArray(stats.results) ? stats.results : []).map((result: unknown) => {
        const resultObj = result as Record<string, unknown>;
        return {
          result:
            typeof resultObj?.result === 'string'
              ? (resultObj.result as NonNullFlamesResult)
              : ('' as NonNullFlamesResult),
          count: typeof resultObj?.current_count === 'number' ? resultObj.current_count : 0,
          trend: typeof resultObj?.trend_percentage === 'number' ? Number(resultObj.trend_percentage) : 0,
        };
      }),
      popularPairs: (Array.isArray(stats.pairs) ? stats.pairs : []).map((pair: unknown) => {
        const pairObj = pair as Record<string, unknown>;
        return {
          name1: typeof pairObj?.name1 === 'string' ? pairObj.name1 : '',
          name2: typeof pairObj?.name2 === 'string' ? pairObj.name2 : '',
          result:
            typeof pairObj?.result === 'string' ? (pairObj.result as NonNullFlamesResult) : ('' as NonNullFlamesResult),
          count: typeof pairObj?.count === 'number' ? pairObj.count : 0,
        };
      }),
      regionalStats: null, // Will be populated separately if country is available
    };
  }, []);

  // Fetch stats with error handling and retries
  const fetchStats = useCallback(async () => {
    try {
      const cacheKey = `${timeWindow}-${userCountry || 'global'}`;
      const cached = statsCache.get(cacheKey);

      // Return cached data if still valid
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Fetch global stats
      const globalStats = await getStatsWithTrends(timeWindow);
      const stats = transformStats(globalStats);

      // If we have the user's country, fetch regional stats
      if (userCountry) {
        const regionalStats = await getStatsWithTrends(timeWindow, userCountry);
        if (regionalStats && typeof regionalStats === 'object') {
          const regional = regionalStats as Record<string, unknown>;
          stats.regionalStats = {
            country: userCountry,
            names: (Array.isArray(regional.names) ? regional.names : []).map((name: unknown) => {
              const nameObj = name as Record<string, unknown>;
              return {
                name: typeof nameObj?.name === 'string' ? nameObj.name : '',
                count: typeof nameObj?.current_count === 'number' ? nameObj.current_count : 0,
                trend: typeof nameObj?.trend_percentage === 'number' ? Number(nameObj.trend_percentage) : 0,
              };
            }),
            results: (Array.isArray(regional.results) ? regional.results : []).map((result: unknown) => {
              const resultObj = result as Record<string, unknown>;
              return {
                result:
                  typeof resultObj?.result === 'string'
                    ? (resultObj.result as NonNullFlamesResult)
                    : ('' as NonNullFlamesResult),
                count: typeof resultObj?.current_count === 'number' ? resultObj.current_count : 0,
                trend: typeof resultObj?.trend_percentage === 'number' ? Number(resultObj.trend_percentage) : 0,
              };
            }),
            pairs: (Array.isArray(regional.pairs) ? regional.pairs : []).map((pair: unknown) => {
              const pairObj = pair as Record<string, unknown>;
              return {
                name1: typeof pairObj?.name1 === 'string' ? pairObj.name1 : '',
                name2: typeof pairObj?.name2 === 'string' ? pairObj.name2 : '',
                result:
                  typeof pairObj?.result === 'string'
                    ? (pairObj.result as NonNullFlamesResult)
                    : ('' as NonNullFlamesResult),
                count: typeof pairObj?.count === 'number' ? pairObj.count : 0,
              };
            }),
          };
        }
      }

      setData(stats);
      setLastUpdate(Date.now());
      setRetryCount(0); // Reset retry count on success

      // Update cache
      statsCache.set(cacheKey, { data: stats, timestamp: Date.now() });
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching stats:', error);

      // Handle specific error types
      if (error instanceof StatsError) {
        switch (error.code) {
          case 'STATS_FETCH_FAILED':
            toast.error('Failed to fetch statistics. Please try again later.');
            break;
          case 'UNEXPECTED_ERROR':
            toast.error('An unexpected error occurred. Please try again.');
            break;
          default:
            toast.error('Error loading statistics.');
        }
      }

      setError(error);

      // Set default data in case of error
      setData(DEFAULT_STATS);

      // Implement retry logic for certain errors
      if (retryCount < 3 && !(error instanceof StatsError)) {
        setRetryCount((prev) => prev + 1);
        setTimeout(
          () => {
            fetchStats();
          },
          Math.pow(2, retryCount) * 1000
        ); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  }, [timeWindow, userCountry, retryCount, transformStats]);

  // Fetch stats when dependencies change
  useEffect(() => {
    fetchStats();
  }, [fetchStats, timeWindow, userCountry]);

  return {
    data,
    isLoading,
    error,
    userCountry,
    refetch: fetchStats,
    lastUpdate,
  };
}
