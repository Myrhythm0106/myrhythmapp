-- Test API keys by creating a simple test recording
INSERT INTO meeting_recordings (
  user_id,
  meeting_title,
  meeting_type,
  is_active,
  started_at,
  ended_at,
  processing_status
) VALUES (
  'ffdbcc21-ef98-4b92-99bf-77e62249056f',
  'API Test Recording',
  'test',
  false,
  now() - interval '2 minutes',
  now() - interval '1 minute',
  'pending'
) RETURNING id;