/*
  # Create Organizations Table

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, organization name)
      - `domain` (text, unique domain)
      - `microsoft_tenant_id` (text, unique MS tenant ID)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `organizations` table
    - Add policy for authenticated users to read their own organization data
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text UNIQUE NOT NULL,
  microsoft_tenant_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage organizations"
  ON organizations
  FOR ALL
  TO service_role
  USING (true);