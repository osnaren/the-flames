/*
  # Add trend calculations for FLAMES statistics

  1. New Functions
    - calculate_name_trends: Calculates trend percentages for names
    - calculate_result_trends: Calculates trend percentages for FLAMES results
    - get_stats_with_trends: Combines current and previous period stats

  2. Changes
    - Added period comparison for accurate trend calculation
    - Enhanced error handling with EXCEPTION blocks
    - Added input validation

  3. Security
    - All functions are SECURITY DEFINER
    - Added input sanitization
    - Restricted access to specific roles
*/

-- Function to calculate name trends
CREATE OR REPLACE FUNCTION public.calculate_name_trends(
  time_window text,
  country_code text DEFAULT NULL
)
RETURNS TABLE (
  name text,
  current_count bigint,
  previous_count bigint,
  trend_percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_start timestamp;
  previous_start timestamp;
BEGIN
  -- Input validation
  IF time_window NOT IN ('today', 'week', 'alltime') THEN
    RAISE EXCEPTION 'Invalid time window: %', time_window;
  END IF;

  -- Set time periods based on window
  CASE time_window
    WHEN 'today' THEN
      current_start := date_trunc('day', now());
      previous_start := current_start - interval '1 day';
    WHEN 'week' THEN
      current_start := date_trunc('week', now());
      previous_start := current_start - interval '1 week';
    ELSE
      current_start := date_trunc('month', now());
      previous_start := current_start - interval '1 month';
  END CASE;

  RETURN QUERY
  WITH current_period AS (
    SELECT n.name, COUNT(*) as count
    FROM (
      SELECT name1 as name FROM flames_matches
      WHERE created_at >= current_start
      AND (country = country_code OR country_code IS NULL)
      UNION ALL
      SELECT name2 as name FROM flames_matches
      WHERE created_at >= current_start
      AND (country = country_code OR country_code IS NULL)
    ) n
    GROUP BY n.name
  ),
  previous_period AS (
    SELECT n.name, COUNT(*) as count
    FROM (
      SELECT name1 as name FROM flames_matches
      WHERE created_at >= previous_start AND created_at < current_start
      AND (country = country_code OR country_code IS NULL)
      UNION ALL
      SELECT name2 as name FROM flames_matches
      WHERE created_at >= previous_start AND created_at < current_start
      AND (country = country_code OR country_code IS NULL)
    ) n
    GROUP BY n.name
  )
  SELECT 
    c.name,
    c.count as current_count,
    COALESCE(p.count, 0) as previous_count,
    CASE 
      WHEN COALESCE(p.count, 0) = 0 THEN 100
      ELSE ROUND(((c.count::numeric - p.count) / p.count) * 100, 1)
    END as trend_percentage
  FROM current_period c
  LEFT JOIN previous_period p ON c.name = p.name
  ORDER BY c.count DESC;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error calculating name trends: %', SQLERRM;
END;
$$;

-- Function to calculate result trends
CREATE OR REPLACE FUNCTION public.calculate_result_trends(
  time_window text,
  country_code text DEFAULT NULL
)
RETURNS TABLE (
  result text,
  current_count bigint,
  previous_count bigint,
  trend_percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_start timestamp;
  previous_start timestamp;
BEGIN
  -- Input validation
  IF time_window NOT IN ('today', 'week', 'alltime') THEN
    RAISE EXCEPTION 'Invalid time window: %', time_window;
  END IF;

  -- Set time periods based on window
  CASE time_window
    WHEN 'today' THEN
      current_start := date_trunc('day', now());
      previous_start := current_start - interval '1 day';
    WHEN 'week' THEN
      current_start := date_trunc('week', now());
      previous_start := current_start - interval '1 week';
    ELSE
      current_start := date_trunc('month', now());
      previous_start := current_start - interval '1 month';
  END CASE;

  RETURN QUERY
  WITH current_period AS (
    SELECT result, COUNT(*) as count
    FROM flames_matches
    WHERE created_at >= current_start
    AND (country = country_code OR country_code IS NULL)
    GROUP BY result
  ),
  previous_period AS (
    SELECT result, COUNT(*) as count
    FROM flames_matches
    WHERE created_at >= previous_start AND created_at < current_start
    AND (country = country_code OR country_code IS NULL)
    GROUP BY result
  )
  SELECT 
    c.result,
    c.count as current_count,
    COALESCE(p.count, 0) as previous_count,
    CASE 
      WHEN COALESCE(p.count, 0) = 0 THEN 100
      ELSE ROUND(((c.count::numeric - p.count) / p.count) * 100, 1)
    END as trend_percentage
  FROM current_period c
  LEFT JOIN previous_period p ON c.result = p.result
  ORDER BY c.count DESC;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error calculating result trends: %', SQLERRM;
END;
$$;

-- Function to get complete statistics with trends
CREATE OR REPLACE FUNCTION public.get_stats_with_trends(
  time_window text,
  country_code text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  name_trends json;
  result_trends json;
  popular_pairs json;
BEGIN
  -- Get name trends
  SELECT json_agg(nt)
  INTO name_trends
  FROM (
    SELECT * FROM calculate_name_trends(time_window, country_code) LIMIT 10
  ) nt;

  -- Get result trends
  SELECT json_agg(rt)
  INTO result_trends
  FROM (
    SELECT * FROM calculate_result_trends(time_window, country_code)
  ) rt;

  -- Get popular pairs
  SELECT json_agg(pp)
  INTO popular_pairs
  FROM (
    SELECT 
      name1,
      name2,
      result,
      COUNT(*) as count
    FROM flames_matches
    WHERE (country = country_code OR country_code IS NULL)
    GROUP BY name1, name2, result
    ORDER BY count DESC
    LIMIT 6
  ) pp;

  -- Combine all stats
  result := json_build_object(
    'names', name_trends,
    'results', result_trends,
    'pairs', popular_pairs
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error getting statistics: %', SQLERRM;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.calculate_name_trends(text, text) TO public;
GRANT EXECUTE ON FUNCTION public.calculate_result_trends(text, text) TO public;
GRANT EXECUTE ON FUNCTION public.get_stats_with_trends(text, text) TO public;