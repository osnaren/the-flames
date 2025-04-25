/*
  # Fix ambiguous column reference in get_stats_with_trends function

  1. Changes
    - Update get_stats_with_trends function to explicitly reference table names
    - Fix ambiguous 'result' column references
    - Maintain existing functionality while improving query clarity

  2. Security
    - No changes to RLS policies
    - Function remains accessible to all users
*/

CREATE OR REPLACE FUNCTION get_stats_with_trends(
  time_window text DEFAULT 'today',
  country_code text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count integer;
  today_count integer;
  result_stats json;
  name_stats json;
  pair_stats json;
  base_query text;
  window_start timestamp;
BEGIN
  -- Set time window
  window_start := CASE time_window
    WHEN 'today' THEN CURRENT_DATE
    WHEN 'week' THEN CURRENT_DATE - INTERVAL '7 days'
    ELSE '1970-01-01'::timestamp
  END;

  -- Base query with country filter if provided
  base_query := 'WHERE created_at >= $1';
  IF country_code IS NOT NULL THEN
    base_query := base_query || ' AND country = $2';
  END IF;

  -- Get total matches
  EXECUTE 'SELECT COUNT(*) FROM flames_matches ' || 
    CASE WHEN country_code IS NOT NULL 
      THEN 'WHERE country = $1' 
      ELSE 'WHERE 1=1' 
    END
  INTO total_count
  USING country_code;

  -- Get today's matches
  EXECUTE 'SELECT COUNT(*) FROM flames_matches WHERE created_at >= CURRENT_DATE' ||
    CASE WHEN country_code IS NOT NULL 
      THEN ' AND country = $1' 
      ELSE '' 
    END
  INTO today_count
  USING country_code;

  -- Get result statistics with trends
  EXECUTE format('
    WITH current_period AS (
      SELECT flames_matches.result, COUNT(*) as count
      FROM flames_matches
      %s
      GROUP BY flames_matches.result
    ),
    previous_period AS (
      SELECT flames_matches.result, COUNT(*) as count
      FROM flames_matches
      WHERE created_at >= $1 - ($1 - window_start) 
        AND created_at < $1
      %s
      GROUP BY flames_matches.result
    )
    SELECT json_agg(
      json_build_object(
        ''result'', COALESCE(c.result, p.result),
        ''current_count'', COALESCE(c.count, 0),
        ''previous_count'', COALESCE(p.count, 0),
        ''trend_percentage'', 
        CASE 
          WHEN COALESCE(p.count, 0) = 0 THEN 100
          ELSE round(((COALESCE(c.count, 0)::float / COALESCE(p.count, 1)::float) - 1) * 100)
        END
      )
    )',
    base_query,
    CASE WHEN country_code IS NOT NULL THEN 'AND country = $2' ELSE '' END
  ) INTO result_stats
  USING window_start, country_code;

  -- Get popular names with trends
  EXECUTE format('
    WITH name_counts AS (
      SELECT name, COUNT(*) as count
      FROM (
        SELECT name1 as name FROM flames_matches %s
        UNION ALL
        SELECT name2 FROM flames_matches %s
      ) names
      GROUP BY name
      ORDER BY count DESC
      LIMIT 10
    ),
    previous_counts AS (
      SELECT name, COUNT(*) as count
      FROM (
        SELECT name1 as name FROM flames_matches 
        WHERE created_at >= $1 - ($1 - window_start) AND created_at < $1 %s
        UNION ALL
        SELECT name2 FROM flames_matches 
        WHERE created_at >= $1 - ($1 - window_start) AND created_at < $1 %s
      ) names
      GROUP BY name
    )
    SELECT json_agg(
      json_build_object(
        ''name'', nc.name,
        ''current_count'', nc.count,
        ''previous_count'', COALESCE(pc.count, 0),
        ''trend_percentage'',
        CASE 
          WHEN COALESCE(pc.count, 0) = 0 THEN 100
          ELSE round(((nc.count::float / pc.count::float) - 1) * 100)
        END
      )
    )
    FROM name_counts nc
    LEFT JOIN previous_counts pc ON nc.name = pc.name',
    base_query,
    base_query,
    CASE WHEN country_code IS NOT NULL THEN 'AND country = $2' ELSE '' END,
    CASE WHEN country_code IS NOT NULL THEN 'AND country = $2' ELSE '' END
  ) INTO name_stats
  USING window_start, country_code;

  -- Get popular pairs
  EXECUTE format('
    SELECT json_agg(
      json_build_object(
        ''name1'', name1,
        ''name2'', name2,
        ''result'', flames_matches.result,
        ''count'', COUNT(*)
      )
    )
    FROM flames_matches
    %s
    GROUP BY name1, name2, flames_matches.result
    ORDER BY COUNT(*) DESC
    LIMIT 10',
    base_query
  ) INTO pair_stats
  USING window_start, country_code;

  -- Return combined stats
  RETURN json_build_object(
    'total', total_count,
    'today', today_count,
    'results', COALESCE(result_stats, '[]'::json),
    'names', COALESCE(name_stats, '[]'::json),
    'pairs', COALESCE(pair_stats, '[]'::json)
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error getting statistics: %', SQLERRM;
END;
$$;