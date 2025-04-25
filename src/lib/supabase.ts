import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Time window types for stats
export type TimeWindow = 'today' | 'week' | 'alltime';

// Error types
export class StatsError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StatsError';
  }
}

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // ms

// Helper function for exponential backoff retry
async function withRetry<T>(
  operation: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (attempts <= 1) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(operation, attempts - 1, delay * 2);
  }
}

// Get user's country code
export const getUserCountry = async (): Promise<string | null> => {
  try {
    const response = await withRetry(() => 
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-country`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      })
    );
    
    if (!response.ok) {
      throw new StatsError(
        'Failed to detect country',
        'COUNTRY_DETECTION_FAILED'
      );
    }
    
    const { country } = await response.json();
    return country;
  } catch (error) {
    console.error('Error detecting country:', error);
    return null;
  }
};

// Get statistics with trends
export const getStatsWithTrends = async (window: TimeWindow = 'today', country?: string) => {
  try {
    // Add query timeout
    const QUERY_TIMEOUT = 10000; // 10 seconds
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new StatsError(
        'Query timed out',
        'QUERY_TIMEOUT'
      )), QUERY_TIMEOUT);
    });

    const { data, error } = await withRetry(() =>
      supabase.rpc('get_stats_with_trends', {
        time_window: window,
        country_code: country
      })
    );
    
    // Race between query and timeout
    const result = await Promise.race([
      data,
      timeoutPromise
    ]);

    if (error) {
      throw new StatsError(
        'Failed to fetch statistics',
        'STATS_FETCH_FAILED'
      );
    }

    return result;
  } catch (error) {
    if (error instanceof StatsError) throw error;
    throw new StatsError(
      'An unexpected error occurred',
      'UNEXPECTED_ERROR'
    );
  }
};

// Insert a new match with retry and validation
export const insertMatch = async (
  name1: string,
  name2: string,
  result: string,
  country?: string
) => {
  // Validate inputs
  if (!name1?.trim() || !name2?.trim() || !result?.trim()) {
    throw new StatsError(
      'Invalid match data provided',
      'INVALID_MATCH_DATA'
    );
  }

  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('flames_matches')
        .insert([
          {
            name1: name1.trim(),
            name2: name2.trim(),
            result: result.trim(),
            country
          }
        ])
        .select()
    );
    
    if (error) {
      throw new StatsError(
        'Failed to record match',
        'MATCH_INSERT_FAILED'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof StatsError) throw error;
    throw new StatsError(
      'An unexpected error occurred while recording match',
      'UNEXPECTED_ERROR'
    );
  }
};