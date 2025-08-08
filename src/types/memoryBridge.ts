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
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'modified';
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
  meetingType: 'formal' | 'informal' | 'family' | 'medical';
  context?: string;
  location?: string;
  energyLevel?: number;
  emotionalContext?: string;
}