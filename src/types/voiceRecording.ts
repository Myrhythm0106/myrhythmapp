
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
}
