-- Remove duplicate meeting_recordings for the same recording_id,
-- keeping the row with the most extracted actions, then the longest transcript, then the newest.
WITH ranked AS (
  SELECT m.id,
         m.recording_id,
         ROW_NUMBER() OVER (
           PARTITION BY m.recording_id
           ORDER BY (SELECT count(*) FROM public.extracted_actions a WHERE a.meeting_recording_id = m.id) DESC,
                    length(coalesce(m.transcript, '')) DESC,
                    m.created_at DESC
         ) AS rn
  FROM public.meeting_recordings m
  WHERE m.recording_id IS NOT NULL
)
DELETE FROM public.meeting_recordings m
USING ranked r
WHERE m.id = r.id AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS meeting_recordings_recording_id_key
  ON public.meeting_recordings (recording_id)
  WHERE recording_id IS NOT NULL;