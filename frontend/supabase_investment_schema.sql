-- ═══════════════════════════════════════════════════════════════
-- Supabase SQL Setup for Investment Profiles
-- Run this in the Supabase SQL Editor when adding backend support
-- ═══════════════════════════════════════════════════════════════

-- 1. Create the investment_profiles table
CREATE TABLE IF NOT EXISTS investment_profiles (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_level  text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  duration    integer NOT NULL CHECK (duration > 0),
  savings     integer NOT NULL CHECK (savings > 0),
  age         integer NOT NULL CHECK (age > 0 AND age <= 120),
  has_emergency_fund boolean NOT NULL DEFAULT false,
  profile     text NOT NULL CHECK (profile IN ('Conservative', 'Balanced', 'Aggressive')),
  created_at  timestamptz DEFAULT now()
);

-- 2. Create index for faster lookups by user
CREATE INDEX idx_investment_profiles_user_id
  ON investment_profiles(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE investment_profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Users can only access their own data
CREATE POLICY "Users can view own investment profiles"
  ON investment_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investment profiles"
  ON investment_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investment profiles"
  ON investment_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investment profiles"
  ON investment_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Optional: Function to get latest profile for a user
CREATE OR REPLACE FUNCTION get_latest_investment_profile(p_user_id uuid)
RETURNS investment_profiles AS $$
  SELECT *
  FROM investment_profiles
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
$$ LANGUAGE SQL STABLE;
