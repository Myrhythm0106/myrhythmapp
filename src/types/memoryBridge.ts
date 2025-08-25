export interface MeetingRecording {
  id: string;
  user_id: string;
  recording_id: string;
  meeting_title: string;
  participants: { name: string; relationship: string }[];
  meeting_context?: string;
  meeting_type: 'formal' | 'informal' | 'family' | 'medical';
  location?: string;
  energy_level?: number;
  emotional_context?: string;
  relationship_context: Record<string, any>;
  watchers?: string[]; // Support Circle member IDs
  is_active: boolean;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ExtractedAction {
  id: string;
  user_id: string;
  meeting_recording_id: string;
  action_text: string;
  action_type: 'commitment' | 'promise' | 'task' | 'reminder' | 'follow_up';
  assigned_to?: string;
  due_context?: string;
  priority_level: number;
  confidence_score: number;
  relationship_impact?: string;
  emotional_stakes?: string;
  intent_behind?: string;
  transcript_excerpt?: string;
  timestamp_in_recording: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'modified' | 'scheduled';
  user_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationContext {
  id: string;
  user_id: string;
  participant_name: string;
  relationship_type: 'spouse' | 'child' | 'parent' | 'friend' | 'colleague' | 'healthcare' | 'other';
  last_conversation_date?: string;
  conversation_history: Array<{
    date: string;
    summary: string;
    key_topics: string[];
    emotional_tone: string;
  }>;
  relationship_dynamics?: string;
  emotional_patterns: Record<string, any>;
  important_topics: string[];
  communication_preferences?: string;
  energy_compatibility?: number;
  conflict_resolution_style?: string;
  shared_commitments: Array<{
    description: string;
    status: string;
    importance: number;
  }>;
  memory_triggers?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionConfirmation {
  id: string;
  user_id: string;
  extracted_action_id: string;
  confirmation_status: 'confirmed' | 'modified' | 'rejected' | 'clarification_needed';
  user_modifications: Record<string, any>;
  confirmation_note?: string;
  confirmed_at: string;
  created_at: string;
}

export interface MeetingSetupData {
  title: string;
  participants: { name: string; relationship: string }[];
  meetingType: 'formal' | 'informal' | 'family' | 'medical' | 'work';
  context?: string;
  location?: string;
  energyLevel?: number;
  emotionalContext?: string;
  watchers?: string[]; // Support Circle member IDs
}

export interface MemoryBridgeComment {
  id: string;
  user_id: string;
  meeting_recording_id: string;
  commenter_member_id: string;
  comment_text: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecordingUsageTracking {
  id: string;
  user_id: string;
  recording_count: number;
  recording_duration_minutes: number;
  comment_count: number;
  period_start: string;
  period_end: string;
  subscription_tier: 'free' | 'premium' | 'family';
  created_at: string;
  updated_at: string;
}

export interface SubscriptionLimits {
  recordingCount: number;
  recordingDurationMinutes: number;
  commentCount: number;
  hasWatchers: boolean;
  retentionDays: number;
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    recordingCount: 3,
    recordingDurationMinutes: 30,
    commentCount: 1,
    hasWatchers: false,
    retentionDays: 7
  },
  premium: {
    recordingCount: -1, // unlimited
    recordingDurationMinutes: 180, // 3 hours
    commentCount: 7,
    hasWatchers: true,
    retentionDays: -1 // permanent
  },
  family: {
    recordingCount: -1, // unlimited
    recordingDurationMinutes: 180, // 3 hours
    commentCount: -1, // unlimited
    hasWatchers: true,
    retentionDays: -1 // permanent
  }
};