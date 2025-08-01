import { useState, useEffect } from 'react';
import { ExtractedAction, MeetingRecording, ConversationContext } from '@/types/memoryBridge';

export function useMemoryBridgeDemoData() {
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);
  const [meetingHistory, setMeetingHistory] = useState<MeetingRecording[]>([]);
  const [conversationContexts, setConversationContexts] = useState<ConversationContext[]>([]);

  useEffect(() => {
    // Initialize demo data
    const demoActions: ExtractedAction[] = [
      {
        id: 'demo-1',
        user_id: 'demo-user',
        meeting_recording_id: 'demo-meeting-1',
        action_text: 'Call Sarah back about the school meeting by Friday',
        action_type: 'commitment' as const,
        priority_level: 5,
        confidence_score: 0.95,
        timestamp_in_recording: 120,
        assigned_to: 'me',
        due_context: 'Friday this week',
        relationship_impact: 'High - daughter\'s education is important',
        emotional_stakes: 'Sarah seemed worried about missing the discussion',
        intent_behind: 'Supporting my daughter\'s academic progress',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-2',
        user_id: 'demo-user',
        meeting_recording_id: 'demo-meeting-2',
        action_text: 'Send Mom the photos from last weekend',
        action_type: 'promise' as const,
        priority_level: 3,
        confidence_score: 0.88,
        timestamp_in_recording: 85,
        assigned_to: 'me',
        due_context: 'This week',
        relationship_impact: 'Medium - Mom loves seeing family photos',
        emotional_stakes: 'Mom mentioned feeling left out of family moments',
        intent_behind: 'Keeping Mom connected to family activities',
        status: 'confirmed',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-3',
        user_id: 'demo-user',
        meeting_recording_id: 'demo-meeting-3',
        action_text: 'Pick up prescription for John by Tuesday',
        action_type: 'commitment' as const,
        priority_level: 5,
        confidence_score: 0.92,
        timestamp_in_recording: 45,
        assigned_to: 'me',
        due_context: 'Tuesday (2 days)',
        relationship_impact: 'Critical - John\'s health depends on this medication',
        emotional_stakes: 'John is anxious about running out',
        intent_behind: 'Ensuring John\'s health and peace of mind',
        status: 'pending',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const demoMeetings: MeetingRecording[] = [
      {
        id: 'demo-meeting-1',
        user_id: 'demo-user',
        recording_id: 'voice-demo-1',
        meeting_title: 'Call with Sarah about Emma\'s school',
        meeting_type: 'family',
        participants: [
          { name: 'Sarah', relationship: 'wife' },
          { name: 'Me', relationship: 'self' }
        ],
        meeting_context: 'Discussion about Emma\'s parent-teacher conference',
        emotional_context: 'Concerned but supportive conversation about our daughter\'s progress',
        relationship_context: { family_dynamics: 'supportive', communication_style: 'direct' },
        is_active: false,
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-meeting-2',
        user_id: 'demo-user',
        recording_id: 'voice-demo-2',
        meeting_title: 'Family video call with Mom',
        meeting_type: 'family',
        participants: [
          { name: 'Mom', relationship: 'mother' },
          { name: 'Me', relationship: 'self' }
        ],
        meeting_context: 'Weekly check-in with Mom',
        emotional_context: 'Warm family conversation, Mom feeling a bit lonely',
        relationship_context: { family_dynamics: 'loving', communication_style: 'expressive' },
        is_active: false,
        started_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const demoContexts: ConversationContext[] = [
      {
        id: 'context-1',
        user_id: 'demo-user',
        participant_name: 'Sarah',
        relationship_type: 'spouse' as const,
        conversation_history: [
          {
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            summary: 'Discussed Emma\'s parent-teacher conference',
            key_topics: ['Education', 'Parenting', 'Scheduling'],
            emotional_tone: 'Concerned but supportive'
          }
        ],
        relationship_dynamics: 'Strong partnership with direct, caring communication style. Talk through issues openly.',
        emotional_patterns: {
          patterns: 'Sarah tends to worry about Emma\'s academic performance, appreciates when I follow through on commitments',
          triggers: 'Academic concerns, broken commitments',
          responses: 'Direct communication, seeks reassurance'
        },
        communication_preferences: 'Prefers detailed updates, likes to plan ahead, responds well to proactive communication',
        shared_commitments: [
          {
            description: 'Attend Emma\'s parent-teacher conference together',
            status: 'pending',
            importance: 5
          },
          {
            description: 'Coordinate weekend family activities',
            status: 'ongoing',
            importance: 4
          },
          {
            description: 'Share household management tasks',
            status: 'ongoing',
            importance: 3
          }
        ],
        important_topics: ['Emma\'s education', 'Family time', 'Work-life balance'],
        last_conversation_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'context-2',
        user_id: 'demo-user',
        participant_name: 'Mom',
        relationship_type: 'parent' as const,
        conversation_history: [
          {
            date: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
            summary: 'Weekly family video call',
            key_topics: ['Family updates', 'Health', 'Grandchildren'],
            emotional_tone: 'Warm but slightly lonely'
          }
        ],
        relationship_dynamics: 'Deep family bond with loving, expressive communication. Gentle approach to discussions.',
        emotional_patterns: {
          patterns: 'Lights up when receiving family photos and updates, sometimes feels left out of day-to-day activities',
          triggers: 'Being excluded from family activities, lack of visual updates',
          responses: 'Expresses feelings openly, requests more connection'
        },
        communication_preferences: 'Loves visual updates (photos), prefers regular scheduled calls, appreciates detailed family news',
        shared_commitments: [
          {
            description: 'Weekly video calls every Sunday',
            status: 'ongoing',
            importance: 5
          },
          {
            description: 'Share family photos and updates',
            status: 'pending',
            importance: 4
          },
          {
            description: 'Plan holiday visits',
            status: 'pending',
            importance: 5
          }
        ],
        important_topics: ['Grandchildren', 'Health updates', 'Family memories'],
        last_conversation_date: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    setExtractedActions(demoActions);
    setMeetingHistory(demoMeetings);
    setConversationContexts(demoContexts);
  }, []);

  return {
    extractedActions,
    meetingHistory,
    conversationContexts,
    setExtractedActions,
    setMeetingHistory,
    setConversationContexts
  };
}