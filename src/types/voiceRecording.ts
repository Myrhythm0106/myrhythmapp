
export interface VoiceRecording {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_path: string;
  duration_seconds?: number;
  transcription?: string;
  created_at: string;
  access_level: 'private' | 'healthcare';
  legal_retention_required: boolean;
  // AI processing fields
  ai_summary?: string;
  key_insights?: KeyInsight[];
  extracted_actions_count?: number;
  processing_status?: 'pending' | 'processing' | 'completed' | 'failed';
  processed_at?: string;
}

export interface KeyInsight {
  insight: string;
  type: 'emotional' | 'practical' | 'relationship' | 'health';
  importance: 'high' | 'medium' | 'low';
}
