export type SectionKey = 'summary' | 'actions' | 'decisions' | 'questions' | 'transcript';

export interface BriefAction {
  id: string;
  text: string;
  owner: string;
  due?: string;
  priority: number;
  priorityLabel: 'High' | 'Medium' | 'Low';
  confidence: number; // 0-1
  category?: string;
  sourceQuote?: string;
  context?: string;
}

export interface TranscriptTurn {
  speaker: string;
  text: string;
  timestamp?: string;
}

export interface CaptureBriefModel {
  meetingId: string;
  title: string;
  date: string; // formatted
  durationLabel?: string;
  participants: string[];
  context?: string;
  summary: string;
  actions: BriefAction[];
  decisions: string[];
  themes: string[];
  openQuestions: string[];
  transcript: TranscriptTurn[];
  rawTranscript: string;
  confidence?: number;
}

export interface ExportOptions {
  sections: Record<SectionKey, boolean>;
  filename: string;
}
