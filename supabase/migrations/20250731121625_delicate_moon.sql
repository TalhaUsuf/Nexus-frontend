/*
  # Create References Table

  1. New Tables
    - `references`
      - `id` (uuid, primary key)
      - `title` (text, reference title)
      - `content` (text, reference content)
      - `source_type` (text, message/file/meeting)
      - `source_id` (text, source identifier)
      - `channel_name` (text, MS Teams channel name)
      - `team_name` (text, MS Teams team name)
      - `author` (text, content author)
      - `timestamp` (timestamp, content timestamp)
      - `meta_data` (text, JSON metadata)
      - `organization_id` (uuid, foreign key to organizations)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `references` table
    - Add policies for reference access
*/

CREATE TABLE IF NOT EXISTS references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('message', 'file', 'meeting')),
  source_id text NOT NULL,
  channel_name text DEFAULT '',
  team_name text DEFAULT '',
  author text DEFAULT '',
  timestamp timestamptz,
  meta_data text DEFAULT '{}',
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read organization references"
  ON references
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage references"
  ON references
  FOR ALL
  TO service_role
  USING (true);

-- Indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_references_org ON references(organization_id);
CREATE INDEX IF NOT EXISTS idx_references_source_type ON references(source_type);
CREATE INDEX IF NOT EXISTS idx_references_source_id ON references(source_id);

-- Full-text search index for content
CREATE INDEX IF NOT EXISTS idx_references_content_search ON references USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_references_title_search ON references USING gin(to_tsvector('english', title));