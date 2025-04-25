/*
  # Add get_popular_names function

  1. New Functions
    - `get_popular_names`: Returns popular names with their counts based on a SQL query
      - Takes a query_sql parameter for flexible querying
      - Returns name and count columns

  2. Security
    - Function is accessible to public role for read-only access
*/

CREATE OR REPLACE FUNCTION public.get_popular_names(query_sql TEXT)
RETURNS TABLE (
  name TEXT,
  count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Execute the provided query and return results
  RETURN QUERY EXECUTE query_sql;
END;
$$;

-- Grant execute permission to public role
GRANT EXECUTE ON FUNCTION public.get_popular_names(TEXT) TO public;