-- Emergency fix: End the stuck active meeting
UPDATE meeting_recordings 
SET is_active = false, ended_at = NOW()
WHERE user_id = '7059e468-2b74-457f-b4f9-a0882f31b3d0' AND is_active = true;