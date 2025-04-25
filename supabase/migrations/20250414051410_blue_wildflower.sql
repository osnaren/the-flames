/*
  # Create FLAMES matches table

  1. New Tables
    - `flames_matches`
      - `id` (uuid, primary key)
      - `name1` (text)
      - `name2` (text)
      - `result` (text)
      - `country` (varchar, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `flames_matches` table
    - Add policy for public inserts
    - Add policy for public reads
    - Protect updates and deletes
*/

-- Create the flames_matches table
CREATE TABLE IF NOT EXISTS flames_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name1 text NOT NULL,
  name2 text NOT NULL,
  result text NOT NULL,
  country varchar(2),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE flames_matches ENABLE ROW LEVEL SECURITY;

-- Create policy for public inserts
CREATE POLICY "Allow public inserts"
  ON flames_matches
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for public reads
CREATE POLICY "Allow public reads"
  ON flames_matches
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flames_matches_names 
  ON flames_matches (name1, name2);

CREATE INDEX IF NOT EXISTS idx_flames_matches_result 
  ON flames_matches (result);

CREATE INDEX IF NOT EXISTS idx_flames_matches_created_at 
  ON flames_matches (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_flames_matches_country 
  ON flames_matches (country);