/*
  # Insert Sample Data

  1. Sample Data
    - Create sample organization (Acme Corp)
    - Create sample admin user
    - Create sample bot requests for demo

  2. Notes
    - This is for development/demo purposes
    - Passwords are hashed with bcrypt
    - Admin login: admin@acmecorp.com / admin123
*/

-- Insert sample organization
INSERT INTO organizations (id, name, domain, microsoft_tenant_id, created_at, updated_at)
VALUES (
  'org_acme_corp_uuid',
  'Acme Corp',
  'acmecorp.com',
  'sample-tenant-id-12345',
  now(),
  now()
) ON CONFLICT (domain) DO NOTHING;

-- Insert sample admin user (password: admin123)
INSERT INTO users (
  id, 
  email, 
  first_name, 
  last_name, 
  role, 
  status, 
  department, 
  job_title, 
  password,
  organization_id, 
  created_at, 
  updated_at,
  last_active
)
VALUES (
  'user_admin_uuid',
  'admin@acmecorp.com',
  'Organization',
  'Admin',
  'org_admin',
  'active',
  'IT',
  'System Administrator',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'admin123'
  'org_acme_corp_uuid',
  now(),
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample end user
INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  role,
  status,
  department,
  job_title,
  password,
  organization_id,
  created_at,
  updated_at,
  last_active
)
VALUES (
  'user_enduser_uuid',
  'user@acmecorp.com',
  'End',
  'User',
  'end_user',
  'active',
  'Marketing',
  'Marketing Specialist',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'admin123'
  'org_acme_corp_uuid',
  now(),
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample bot requests
INSERT INTO bot_requests (
  id,
  channel_name,
  channel_id,
  channel_type,
  team_id,
  member_count,
  status,
  requested_by_id,
  organization_id,
  created_at,
  updated_at
)
VALUES 
(
  'bot_request_1_uuid',
  'Marketing Team',
  'channel_marketing_123',
  'team',
  'team_marketing_456',
  12,
  'pending',
  'user_enduser_uuid',
  'org_acme_corp_uuid',
  now(),
  now()
),
(
  'bot_request_2_uuid',
  'Product Development',
  'channel_product_789',
  'channel',
  'team_product_012',
  8,
  'pending',
  'user_enduser_uuid',
  'org_acme_corp_uuid',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Insert sample references for search
INSERT INTO references (
  id,
  title,
  content,
  source_type,
  source_id,
  channel_name,
  team_name,
  author,
  timestamp,
  meta_data,
  organization_id,
  created_at
)
VALUES 
(
  'ref_q4_planning_uuid',
  'Q4 Planning Discussion',
  'Based on our analysis, the key Q4 priorities include: 1) Launching the new product beta by October 15th, 2) Increasing customer acquisition by 25%, and 3) Implementing the new CRM system. The marketing team has allocated additional budget for digital campaigns, and engineering is focusing on performance optimizations.',
  'message',
  'msg_q4_planning_123',
  'Marketing Team',
  'Product Development',
  'Sarah Johnson',
  now() - interval '2 hours',
  '{"url": "https://teams.microsoft.com/l/message/msg_q4_planning_123", "thread_id": "thread_123"}',
  'org_acme_corp_uuid',
  now()
),
(
  'ref_standup_notes_uuid',
  'Engineering Standup Notes',
  'From last week''s standup: The team completed 8 story points, resolved 3 critical bugs, and started work on the authentication system. Sarah mentioned the API integration is 80% complete, and Mike flagged potential performance issues that need investigation. Next sprint planning is scheduled for Friday.',
  'message',
  'msg_standup_456',
  'Engineering',
  'Engineering Team',
  'Mike Chen',
  now() - interval '1 day',
  '{"url": "https://teams.microsoft.com/l/message/msg_standup_456", "meeting_id": "meeting_456"}',
  'org_acme_corp_uuid',
  now()
),
(
  'ref_beta_release_uuid',
  'Beta Release Timeline',
  'According to the Product Development channel, the beta release is scheduled for October 15th. The current status shows: UI/UX design is complete, backend APIs are 85% done, and QA testing begins next week. The team is confident about meeting the deadline, but they''ve identified database optimization as a potential risk factor.',
  'file',
  'file_beta_timeline_789',
  'Product Development',
  'Product Team',
  'Alex Wilson',
  now() - interval '3 days',
  '{"url": "https://teams.microsoft.com/l/file/file_beta_timeline_789", "file_type": "document", "file_size": "2.3MB"}',
  'org_acme_corp_uuid',
  now()
) ON CONFLICT (id) DO NOTHING;