/*
  # Fix statistics functions with proper drops

  1. Changes
    - Drop existing functions before recreation
    - Add helper functions for time and trend calculations
    - Fix return type issues
    - Optimize query performance
*/

-- Drop existing functions first
DROP FUNCTION IF EXISTS get_stats_with_trends(text, text);
DROP FUNCTION IF EXISTS get_time_range(text);
DROP FUNCTION IF EXISTS calculate_trend_percentage(bigint, bigint);

-- Helper function to calculate time range based on window
CREATE FUNCTION get_time_range(time_window text)
RETURNS TABLE (
  start_time timestamptz,
  end_time timestamptz,
  previous_start timestamptz,
  previous_end timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE time_window
      WHEN 'today' THEN date_trunc('day', now())
      WHEN 'week' THEN date_trunc('week', now())
      ELSE '1970-01-01'::timestamptz
    END AS start_time,
    now() AS end_time,
    CASE time_window
      WHEN 'today' THEN date_trunc('day', now()) - interval '1 day'
      WHEN 'week' THEN date_trunc('week', now()) - interval '1 week'
      ELSE '1970-01-01'::timestamptz
    END AS previous_start,
    CASE time_window
      WHEN 'today' THEN date_trunc('day', now())
      WHEN 'week' THEN date_trunc('week', now())
      ELSE now()
    END AS previous_end;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to calculate trend percentage
CREATE FUNCTION calculate_trend_percentage(
  current_count bigint,
  previous_count bigint
) RETURNS numeric AS $$
BEGIN
  IF previous_count = 0 THEN
    RETURN 100;
  END IF;
  RETURN round(((current_count::numeric - previous_count::numeric) / previous_count::numeric * 100)::numeric, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Main function to get statistics with trends
CREATE FUNCTION get_stats_with_trends(
  time_window text DEFAULT 'today',
  country_code text DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
  time_ranges record;
BEGIN
  -- Validate input parameters
  IF time_window NOT IN ('today', 'week', 'alltime') THEN
    RAISE EXCEPTION 'Invalid time window: %', time_window;
  END IF;

  -- Get time ranges
  SELECT * INTO time_ranges FROM get_time_range(time_window);

  -- Use CTEs to avoid nested aggregates
  WITH current_period AS (
    SELECT *
    FROM flames_matches
    WHERE created_at >= time_ranges.start_time
    AND created_at <= time_ranges.end_time
    AND (country_code IS NULL OR country = country_code)
  ),
  previous_period AS (
    SELECT *
    FROM flames_matches
    WHERE created_at >= time_ranges.previous_start
    AND created_at < time_ranges.previous_end
    AND (country_code IS NULL OR country = country_code)
  ),
  name_stats AS (
    SELECT 
      name,
      COUNT(*) as current_count,
      COALESCE((
        SELECT COUNT(*)
        FROM (
          SELECT unnest(ARRAY[name1, name2]) as name
          FROM previous_period
        ) prev
        WHERE prev.name = names.name
      ), 0) as previous_count
    FROM (
      SELECT unnest(ARRAY[name1, name2]) as name
      FROM current_period
    ) names
    GROUP BY name
    ORDER BY current_count DESC
    LIMIT 10
  ),
  result_stats AS (
    SELECT 
      c.result,
      COUNT(*) as current_count,
      COALESCE((
        SELECT COUNT(*)
        FROM previous_period p
        WHERE p.result = c.result
      ), 0) as previous_count
    FROM current_period c
    GROUP BY c.result
  ),
  pair_stats AS (
    SELECT 
      name1,
      name2,
      result,
      COUNT(*) as count
    FROM current_period
    GROUP BY name1, name2, result
    ORDER BY count DESC
    LIMIT 10
  )
  SELECT jsonb_build_object(
    'total', (SELECT COUNT(*) FROM flames_matches WHERE (country_code IS NULL OR country = country_code)),
    'today', (
      SELECT COUNT(*) 
      FROM flames_matches 
      WHERE created_at >= date_trunc('day', now())
      AND (country_code IS NULL OR country = country_code)
    ),
    'names', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', name,
          'current_count', current_count,
          'trend_percentage', calculate_trend_percentage(current_count, previous_count)
        )
      )
      FROM name_stats
    ),
    'results', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'result', result,
          'current_count', current_count,
          'trend_percentage', calculate_trend_percentage(current_count, previous_count)
        )
      )
      FROM result_stats
    ),
    'pairs', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name1', name1,
          'name2', name2,
          'result', result,
          'count', count
        )
      )
      FROM pair_stats
    )
  ) INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error getting statistics: %', SQLERRM;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions to public
GRANT EXECUTE ON FUNCTION get_stats_with_trends(text, text) TO public;
GRANT EXECUTE ON FUNCTION get_time_range(text) TO public;
GRANT EXECUTE ON FUNCTION calculate_trend_percentage(bigint, bigint) TO public;