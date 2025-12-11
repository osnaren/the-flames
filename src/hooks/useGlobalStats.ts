import { generateMockData, GlobalStats } from '@modules/charts';
import { NonNullFlamesResult } from '@/utils/resultData';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getStatsWithTrends, getUserCountry, StatsError, TimeWindow } from '../lib/supabase';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const statsCache = new Map<string, { data: GlobalStats; timestamp: number }>();

// Default values for when data is missing
const DEFAULT_STATS: GlobalStats = {
  totalMatches: 0,
  todayMatches: 0,
  resultStats: [],
  recentMatches: [],
  topCountries: [],
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
      } catch {
        // Country detection is non-critical - silent failure
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
      recentMatches: (Array.isArray(stats.recent) ? stats.recent : []).map((match: unknown) => {
        const matchObj = match as Record<string, unknown>;
        return {
          result:
            typeof matchObj?.result === 'string'
              ? (matchObj.result as NonNullFlamesResult)
              : ('' as NonNullFlamesResult),
          country: typeof matchObj?.country === 'string' ? matchObj.country : null,
          created_at: typeof matchObj?.created_at === 'string' ? matchObj.created_at : '',
        };
      }),
      topCountries: (Array.isArray(stats.top_countries) ? stats.top_countries : []).map((country: unknown) => {
        const countryObj = country as Record<string, unknown>;
        return {
          country: typeof countryObj?.country === 'string' ? countryObj.country : '',
          count: typeof countryObj?.count === 'number' ? countryObj.count : 0,
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

      // Check for mock data flag
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        const mockData = generateMockData();
        setData(mockData);
        setIsLoading(false);
        return;
      }

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
    // Guard against SSR
    if (typeof window === 'undefined') return;

    fetchStats();

    // Set up polling for live updates (every 30 seconds)
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        fetchStats();
      }
    }, 30000);

    return () => clearInterval(intervalId);
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
