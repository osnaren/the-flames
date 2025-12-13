/*
  # Remove names from stats and add recent matches

  1. Changes
    - Update get_stats_with_trends function to remove name-based stats
    - Add recent matches (anonymous)
    - Add top countries stats
    - Optimize query performance by removing name grouping

  2. Notes
    - Removes popular_names and popular_pairs
    - Adds recent_matches and top_countries
*/

CREATE OR REPLACE FUNCTION get_stats_with_trends(
  time_window text DEFAULT 'today',
  country_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  start_time timestamp;
  prev_start_time timestamp;
  result_json jsonb;
BEGIN
  -- Set time window
  IF time_window = 'today' THEN
    start_time := date_trunc('day', now());
    prev_start_time := start_time - interval '1 day';
  ELSIF time_window = 'week' THEN
    start_time := date_trunc('week', now());
    prev_start_time := start_time - interval '1 week';
  ELSE -- all time
    start_time := '1970-01-01'::timestamp;
    prev_start_time := start_time;
  END IF;

  -- Build result JSON
  WITH current_period AS (
    SELECT 
      fm.result as result,
      COUNT(*) as current_count
    FROM flames_matches fm
    WHERE 
      fm.created_at >= start_time
      AND (country_code IS NULL OR fm.country = country_code)
    GROUP BY fm.result
  ),
  previous_period AS (
    SELECT 
      fm.result as result,
      COUNT(*) as previous_count
    FROM flames_matches fm
    WHERE 
      fm.created_at >= prev_start_time 
      AND fm.created_at < start_time
      AND (country_code IS NULL OR fm.country = country_code)
    GROUP BY fm.result
  ),
  result_trends AS (
    SELECT 
      cp.result,
      cp.current_count,
      COALESCE(
        ROUND(
          (cp.current_count - pp.previous_count) * 100.0 / 
          NULLIF(pp.previous_count, 0),
          1
        ),
        0
      ) as trend_percentage
    FROM current_period cp
    LEFT JOIN previous_period pp ON cp.result = pp.result
    ORDER BY cp.current_count DESC
  ),
  recent_matches AS (
    SELECT 
      result,
      country,
      created_at
    FROM flames_matches
    WHERE (country_code IS NULL OR country = country_code)
    ORDER BY created_at DESC
    LIMIT 10
  ),
  top_countries AS (
    SELECT 
      country,
      COUNT(*) as count
    FROM flames_matches
    WHERE 
      created_at >= start_time
      AND country IS NOT NULL
    GROUP BY country
    ORDER BY count DESC
    LIMIT 5
  )
  SELECT 
    jsonb_build_object(
      'total', (
        SELECT COUNT(*)
        FROM flames_matches fm
        WHERE (country_code IS NULL OR fm.country = country_code)
      ),
      'today', (
        SELECT COUNT(*)
        FROM flames_matches fm
        WHERE 
          fm.created_at >= date_trunc('day', now())
          AND (country_code IS NULL OR fm.country = country_code)
      ),
      'results', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'result', result,
            'current_count', current_count,
            'trend_percentage', trend_percentage
          )
        )
        FROM result_trends
      ),
      'recent', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'result', result,
            'country', country,
            'created_at', created_at
          )
        )
        FROM recent_matches
      ),
      'top_countries', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'country', country,
            'count', count
          )
        )
        FROM top_countries
      )
    ) INTO result_json;

  RETURN result_json;
END;
$$;
