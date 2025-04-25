/*
  # Fix ambiguous column references in stats function

  1. Changes
    - Update get_stats_with_trends function to properly qualify all column references
    - Add explicit table aliases to improve query readability
    - Fix ambiguous 'result' column reference

  2. Notes
    - No schema changes, only function modification
    - Maintains existing functionality with improved SQL syntax
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

  -- Build result JSON with properly qualified column names
  WITH current_period AS (
    SELECT 
      fm.result as result,
      COUNT(*) as current_count,
      fm.name1,
      fm.name2
    FROM flames_matches fm
    WHERE 
      fm.created_at >= start_time
      AND (country_code IS NULL OR fm.country = country_code)
    GROUP BY fm.result, fm.name1, fm.name2
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
  popular_names AS (
    SELECT 
      name,
      COUNT(*) as current_count,
      COALESCE(
        ROUND(
          (COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY COUNT(*) DESC)) * 100.0 / 
          NULLIF(LAG(COUNT(*)) OVER (ORDER BY COUNT(*) DESC), 0),
          1
        ),
        0
      ) as trend_percentage
    FROM (
      SELECT fm.name1 as name
      FROM flames_matches fm
      WHERE 
        fm.created_at >= start_time
        AND (country_code IS NULL OR fm.country = country_code)
      UNION ALL
      SELECT fm.name2
      FROM flames_matches fm
      WHERE 
        fm.created_at >= start_time
        AND (country_code IS NULL OR fm.country = country_code)
    ) names
    GROUP BY name
    ORDER BY current_count DESC
    LIMIT 10
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
  popular_pairs AS (
    SELECT 
      fm.name1,
      fm.name2,
      fm.result,
      COUNT(*) as count
    FROM flames_matches fm
    WHERE 
      fm.created_at >= start_time
      AND (country_code IS NULL OR fm.country = country_code)
    GROUP BY fm.name1, fm.name2, fm.result
    ORDER BY count DESC
    LIMIT 10
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
      'names', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', name,
            'current_count', current_count,
            'trend_percentage', trend_percentage
          )
        )
        FROM popular_names
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
      'pairs', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name1', name1,
            'name2', name2,
            'result', result,
            'count', count
          )
        )
        FROM popular_pairs
      )
    ) INTO result_json;

  RETURN result_json;
END;
$$;