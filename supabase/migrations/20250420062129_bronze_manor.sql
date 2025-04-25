/*
  # Add optimized indexes for FLAMES statistics

  1. New Indexes
    - Composite index for time-based queries
    - Composite index for country statistics
    - Composite index for result trends
    - Composite index for name-based queries
    - Partial indexes for common query patterns

  2. Changes
    - Use B-tree indexes for efficient sorting
    - Add covering indexes to reduce table lookups
    - Remove non-IMMUTABLE function predicates
    - Optimize for common query patterns

  3. Notes
    - All indexes use IMMUTABLE operations only
    - Indexes are designed for the statistics calculation functions
*/

-- Add index for time-based queries with included columns
CREATE INDEX IF NOT EXISTS idx_flames_matches_time_stats 
ON flames_matches (created_at DESC)
INCLUDE (result, name1, name2);

-- Add composite index for country-based statistics
CREATE INDEX IF NOT EXISTS idx_flames_matches_country_time 
ON flames_matches (country, created_at DESC)
WHERE country IS NOT NULL;

-- Add index for result trends
CREATE INDEX IF NOT EXISTS idx_flames_matches_result_trends 
ON flames_matches (result, created_at DESC)
INCLUDE (country);

-- Add index for name-based queries
CREATE INDEX IF NOT EXISTS idx_flames_matches_names 
ON flames_matches (name1, name2, created_at DESC);

-- Add index for result-based queries
CREATE INDEX IF NOT EXISTS idx_flames_matches_result_country 
ON flames_matches (result, country, created_at DESC);

-- Add statistics to help query planner
ANALYZE flames_matches;