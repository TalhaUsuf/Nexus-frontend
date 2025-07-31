/*
  # Create Bot Requests Table

  1. New Tables
    - `bot_requests`
      - `id` (uuid, primary key)
      - `channel_name` (text, Teams channel/chat name)
      - `channel_id` (text, MS Teams channel ID)
      - `channel_type` (text, type: team or channel)
      - `team_id` (text, MS Teams team ID)
      - `member_count` (integer, number of members)
      - `status` (enum: pending, approved, rejected)
      - `requested_by_id` (uuid, foreign key to users)
      - `approved_by_id` (uuid, foreign key to users)
      - `reason` (text, approval/rejection reason)
      - `organization_id` (uuid, foreign key to organizations)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bot_requests` table
    - Add policies for bot request management
*/

-- Create enum for bot request status
DO $$ BEGIN
  CREATE TYPE bot_request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS bot_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_name text NOT NULL,
  channel_id text NOT NULL,
  channel_type text NOT NULL,
  team_id text,
  member_count integer DEFAULT 0,
  status bot_request_status DEFAULT 'pending',
  requested_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reason text,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bot_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create bot requests"
  ON bot_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can read organization bot requests"
  ON bot_requests
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage bot requests"
  ON bot_requests
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'org_admin')
    )
  );

CREATE POLICY "Service role can manage bot requests"
  ON bot_requests
  FOR ALL
  TO service_role
  USING (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bot_requests_status ON bot_requests(status);
CREATE INDEX IF NOT EXISTS idx_bot_requests_org ON bot_requests(organization_id);