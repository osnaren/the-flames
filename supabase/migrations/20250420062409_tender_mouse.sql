/*
  # Fix stats function syntax

  1. Changes
    - Fixed LIMIT clause placement in subquery
    - Improved query structure for better readability
    - Added proper error handling
*/

CREATE OR REPLACE FUNCTION get_stats_with_trends(
  time_window text DEFAULT 'today',
  country_code text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  window_start timestamp with time zone;
  result_data json;
BEGIN
  -- Set time window
  window_start := CASE time_window
    WHEN 'today' THEN current_date
    WHEN 'week' THEN current_date - interval '7 days'
    ELSE '1970-01-01'::timestamp -- alltime
  END;

  -- Build stats object
  WITH filtered_matches AS (
    -- Base query with time and country filters
    SELECT *
    FROM flames_matches
    WHERE 
      created_at >= window_start
      AND (country_code IS NULL OR country = country_code)
  ),
  name_stats AS (
    -- Get name counts (combining both name columns)
    SELECT name, COUNT(*) as name_count
    FROM (
      SELECT name1 as name FROM filtered_matches
      UNION ALL
      SELECT name2 FROM filtered_matches
    ) names
    GROUP BY name
    ORDER BY COUNT(*) DESC
    LIMIT 10
  ),
  stats AS (
    SELECT
      COUNT(*) as total_matches,
      json_object_agg(
        result,
        COUNT(*)
      ) as result_counts,
      (
        SELECT json_agg(
          json_build_object(
            'name', name,
            'count', name_count
          )
        )
        FROM name_stats
      ) as top_names,
      CASE WHEN country_code IS NOT NULL THEN
        json_object_agg(
          country,
          COUNT(*)
        )
      ELSE NULL
      END as country_stats
    FROM filtered_matches
    GROUP BY country_code
  )
  SELECT json_build_object(
    'total_matches', total_matches,
    'result_counts', result_counts,
    'top_names', top_names,
    'country_stats', country_stats
  ) INTO result_data
  FROM stats;

  RETURN result_data;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error getting statistics: %', SQLERRM;
END;
$$;