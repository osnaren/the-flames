import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'undefined' || supabaseKey === 'undefined') {
  console.error('Supabase URL or Anon Key missing:', {
    supabaseUrl: supabaseUrl || 'not set',
    supabaseKey: supabaseKey ? '****' : 'not set',
  });
  throw new Error('Supabase URL and Anon Key must be set in environment variables (.env or .env.local)');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Time window types for stats
export type TimeWindow = 'today' | 'week' | 'alltime';

// Error types
export class StatsError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'StatsError';
  }
}

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // ms

// Helper function for exponential backoff retry
async function withRetry<T>(
  operation: () => PromiseLike<T>,
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (attempts <= 1) throw error;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(operation, attempts - 1, delay * 2);
  }
}

// Get user's country code
export const getUserCountry = async (): Promise<string | null> => {
  try {
    // 1. Try our local optimized API route (fastest, uses Vercel headers)
    try {
      const localResponse = await fetch('/api/geo');
      if (localResponse.ok) {
        const { country } = await localResponse.json();
        if (country) return country;
      }
    } catch (e) {
      // Ignore local API errors and fall back to Edge Function
      console.warn('Local geo API failed, falling back to Edge Function', e);
    }

    // 2. Fallback to Supabase Edge Function (uses IP geolocation)
    const response = await withRetry(() =>
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-country`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      })
    );

    if (!response.ok) {
      throw new StatsError('Failed to detect country', 'COUNTRY_DETECTION_FAILED');
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
    const { data, error } = await withRetry(() =>
      supabase.rpc('get_stats_with_trends', {
        time_window: window,
        country_code: country,
      })
    );

    if (error) {
      throw new StatsError('Failed to fetch statistics', 'STATS_FETCH_FAILED');
    }

    return data;
  } catch (error) {
    if (error instanceof StatsError) throw error;
    throw new StatsError('An unexpected error occurred', 'UNEXPECTED_ERROR');
  }
};

// Insert a new match with retry and validation
export const insertMatch = async (result: string, country?: string) => {
  // Validate only the result field as required
  if (!result?.trim()) {
    throw new StatsError('Invalid match data provided', 'INVALID_MATCH_DATA');
  }

  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('flames_matches')
        .insert([
          {
            result: result.trim(),
            country,
          },
        ])
        .select()
    );

    if (error) {
      throw new StatsError('Failed to record match', 'MATCH_INSERT_FAILED');
    }

    return data;
  } catch (error) {
    if (error instanceof StatsError) throw error;
    throw new StatsError('An unexpected error occurred while recording match', 'UNEXPECTED_ERROR');
  }
};
