/*
  # Create Messages Table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text, message content)
      - `role` (text, user or assistant)
      - `conversation_id` (uuid, foreign key to conversations)
      - `sources` (text, JSON string of sources)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for message access
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sources text DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage messages in own conversations"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage messages"
  ON messages
  FOR ALL
  TO service_role
  USING (true);

-- Index for faster conversation lookups
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);