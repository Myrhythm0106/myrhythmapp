import { supabase } from '@/integrations/supabase/client';
import { MeetingSetupData } from '@/types/memoryBridge';

// Temporary utility functions for Memory Bridge API calls
// This bypasses TypeScript issues until Supabase types are regenerated

export async function createMeetingRecording(
  userId: string,
  voiceRecordingId: string,
  setupData: MeetingSetupData
) {
  const response = await fetch(
    `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/meeting_recordings`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
      },
      body: JSON.stringify({
        user_id: userId,
        recording_id: voiceRecordingId,
        meeting_title: setupData.title,
        participants: setupData.participants,
        meeting_context: setupData.context || null,
        meeting_type: setupData.meetingType,
        location: setupData.location || null,
        energy_level: setupData.energyLevel || null,
        emotional_context: setupData.emotionalContext || null,
        relationship_context: {},
        watchers: setupData.watchers || [],
        is_active: true,
        started_at: new Date().toISOString()
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create meeting recording');
  }

  const responseText = await response.text();
  if (!responseText) {
    throw new Error('Empty response from server');
  }

  const data = JSON.parse(responseText);
  return Array.isArray(data) ? data[0] : data;
}

export async function fetchExtractedActions(userId: string, meetingId?: string) {
  let url = `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/extracted_actions?user_id=eq.${userId}&order=created_at.desc`;
  
  if (meetingId) {
    url += `&meeting_recording_id=eq.${meetingId}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch extracted actions');
  }

  return await response.json();
}

export async function updateExtractedAction(
  actionId: string,
  userId: string,
  status: string,
  notes?: string
) {
  const response = await fetch(
    `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/extracted_actions?id=eq.${actionId}&user_id=eq.${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
      },
      body: JSON.stringify({
        status,
        user_notes: notes || null
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update action');
  }

  return await response.json();
}

export async function createActionConfirmation(
  userId: string,
  actionId: string,
  confirmationStatus: string,
  modifications?: Record<string, any>,
  note?: string
) {
  const response = await fetch(
    `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/action_confirmations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
      },
      body: JSON.stringify({
        user_id: userId,
        extracted_action_id: actionId,
        confirmation_status: confirmationStatus,
        user_modifications: modifications || {},
        confirmation_note: note || null
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create action confirmation');
  }

  return await response.json();
}

export async function fetchMeetingHistory(userId: string) {
  const response = await fetch(
    `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/meeting_recordings?user_id=eq.${userId}&select=*,voice_recordings(title,duration_seconds,created_at)&order=created_at.desc`,
    {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch meeting history');
  }

  return await response.json();
}