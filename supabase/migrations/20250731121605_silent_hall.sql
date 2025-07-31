/*
  # Create Invitations Table

  1. New Tables
    - `invitations`
      - `id` (uuid, primary key)
      - `email` (text, invitee email)
      - `role` (user_role enum)
      - `token` (text, unique invitation token)
      - `expires_at` (timestamp)
      - `used_at` (timestamp, nullable)
      - `created_by_id` (uuid, foreign key to users)
      - `organization_id` (uuid, foreign key to organizations)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `invitations` table
    - Add policies for invitation management
*/

CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role user_role DEFAULT 'end_user',
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invitations"
  ON invitations
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'org_admin')
    )
  );

CREATE POLICY "Service role can manage invitations"
  ON invitations
  FOR ALL
  TO service_role
  USING (true);

-- Index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);