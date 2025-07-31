/*
  # Create Conversations Table

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `title` (text, conversation title)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `conversations` table
    - Add policies for conversation access
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT '',
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations"
  ON conversations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage conversations"
  ON conversations
  FOR ALL
  TO service_role
  USING (true);

-- Index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);