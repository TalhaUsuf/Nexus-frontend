/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (enum: super_admin, org_admin, team_lead, end_user)
      - `status` (enum: active, pending, inactive)
      - `department` (text)
      - `job_title` (text)
      - `phone_number` (text)
      - `timezone` (text)
      - `avatar_url` (text)
      - `microsoft_user_id` (text, unique)
      - `password` (text, for demo purposes)
      - `last_active` (timestamp)
      - `organization_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policies for user data access
*/

-- Create enums for user roles and status
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'org_admin', 'team_lead', 'end_user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'pending', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  role user_role DEFAULT 'end_user',
  status user_status DEFAULT 'pending',
  department text DEFAULT '',
  job_title text DEFAULT '',
  phone_number text DEFAULT '',
  timezone text DEFAULT '',
  avatar_url text DEFAULT '',
  microsoft_user_id text UNIQUE,
  password text DEFAULT '',
  last_active timestamptz DEFAULT now(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can read organization users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'org_admin')
    )
  );

CREATE POLICY "Service role can manage users"
  ON users
  FOR ALL
  TO service_role
  USING (true);