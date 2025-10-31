-- MoEstateNews Supabase Schema
-- This schema defines the database structure for storing briefs and articles

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Briefs table
CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('single-family', 'multi-family', 'commercial', 'luxury', 'condo', 'townhouse', 'land', 'all')),
  time_span VARCHAR(20) NOT NULL CHECK (time_span IN ('daily', 'weekly', 'custom')),
  custom_date_range JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID, -- For future multi-user support
  CONSTRAINT valid_custom_range CHECK (
    (time_span != 'custom') OR (custom_date_range IS NOT NULL)
  )
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  source VARCHAR(200) NOT NULL,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_briefs_user_id ON briefs(user_id);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefs_time_span ON briefs(time_span);
CREATE INDEX IF NOT EXISTS idx_briefs_property_type ON briefs(property_type);
CREATE INDEX IF NOT EXISTS idx_articles_brief_id ON articles(brief_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (adjust based on your security requirements)
CREATE POLICY "Allow public read access" ON briefs
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read articles" ON articles
  FOR SELECT
  USING (true);

-- Policy: Allow public insert (adjust based on your security requirements)
CREATE POLICY "Allow public insert" ON briefs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert articles" ON articles
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow public update (adjust based on your security requirements)
CREATE POLICY "Allow public update" ON briefs
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update articles" ON articles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow public delete (adjust based on your security requirements)
CREATE POLICY "Allow public delete" ON briefs
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public delete articles" ON articles
  FOR DELETE
  USING (true);

-- Example data (for demonstration)
INSERT INTO briefs (id, title, content, property_type, time_span, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'Weekly Real Estate Digest - January 2024',
    'This week in real estate: The market continues to show strong growth with several key developments across commercial and residential sectors.',
    'all',
    'weekly',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO articles (brief_id, title, source, url, published_at, excerpt, display_order)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'Housing Market Shows Strong Growth in Q4 2024',
    'realtor.com',
    'https://example.com/article1',
    NOW() - INTERVAL '2 days',
    'The real estate market continues to show resilience with record-breaking sales numbers.',
    0
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'New Development Projects Transform Downtown Area',
    'inman.com',
    'https://example.com/article2',
    NOW() - INTERVAL '3 days',
    'Several major development projects are reshaping the urban landscape.',
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'Mortgage Rates Stabilize After Fed Meeting',
    'mansionglobal.com',
    'https://example.com/article3',
    NOW() - INTERVAL '4 days',
    'Interest rates hold steady as the Federal Reserve maintains current policy.',
    2
  )
ON CONFLICT DO NOTHING;
