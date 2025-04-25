import { useState, useEffect, useCallback } from 'react';
import { 
  getStatsWithTrends,
  getUserCountry,
  TimeWindow,
  StatsError
} from '../lib/supabase';
import { GlobalStats } from '../components/layout/GlobalCharts/types';
import toast from 'react-hot-toast';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const statsCache = new Map<string, { data: GlobalStats; timestamp: number }>();

// Default values for when data is missing
const DEFAULT_STATS: GlobalStats = {
  totalMatches: 0,
  todayMatches: 0,
  popularNames: [],
  resultStats: [],
  popularPairs: [],
  regionalStats: null
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
  const transformStats = useCallback((rawStats: any): GlobalStats => {
    if (!rawStats) {
      return DEFAULT_STATS;
    }

    return {
      totalMatches: rawStats.total || 0,
      todayMatches: rawStats.today || 0,
      popularNames: (rawStats.names || []).map((name: any) => ({
        name: name?.name || '',
        count: name?.current_count || 0,
        trend: Number(name?.trend_percentage || 0)
      })),
      resultStats: (rawStats.results || []).map((result: any) => ({
        result: result?.result || '',
        count: result?.current_count || 0,
        trend: Number(result?.trend_percentage || 0)
      })),
      popularPairs: (rawStats.pairs || []).map((pair: any) => ({
        name1: pair?.name1 || '',
        name2: pair?.name2 || '',
        result: pair?.result || '',
        count: pair?.count || 0
      })),
      regionalStats: null // Will be populated separately if country is available
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
      let stats = transformStats(globalStats);

      // If we have the user's country, fetch regional stats
      if (userCountry) {
        const regionalStats = await getStatsWithTrends(timeWindow, userCountry);
        if (regionalStats) {
          stats.regionalStats = {
            country: userCountry,
            names: (regionalStats.names || []).map((name: any) => ({
              name: name?.name || '',
              count: name?.current_count || 0,
              trend: Number(name?.trend_percentage || 0)
            })),
            results: (regionalStats.results || []).map((result: any) => ({
              result: result?.result || '',
              count: result?.current_count || 0,
              trend: Number(result?.trend_percentage || 0)
            })),
            pairs: (regionalStats.pairs || []).map((pair: any) => ({
              name1: pair?.name1 || '',
              name2: pair?.name2 || '',
              result: pair?.result || '',
              count: pair?.count || 0
            }))
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
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchStats();
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  }, [timeWindow, userCountry, retryCount, transformStats]);

  // Fetch stats when dependencies change
  useEffect(() => {
    fetchStats();
  }, [timeWindow, userCountry]);

  return { 
    data, 
    isLoading, 
    error,
    userCountry,
    refetch: fetchStats,
    lastUpdate
  };
}