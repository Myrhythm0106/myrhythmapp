export type SectionKey = 'summary' | 'actions' | 'decisions' | 'questions' | 'transcript';

export interface SchedulingSuggestion {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  confidence: number; // 0-1
  reason: string;     // one-liner
  energyMatch?: string;
  conflictLevel: 'none' | 'low' | 'high';
  isRecommended: boolean;
}

export interface MentionedSupportMember {
  id: string;
  name: string;
  email?: string;
  relationship?: string;
  hasCalendarPermission: boolean;
  hasActionsPermission: boolean;
}

export type MemberRole = 'invite' | 'watch' | 'none';

export interface PersonPick {
  memberId: string;
  name: string;
  email?: string;
  role: MemberRole;
  pre: 'mentioned' | 'default-watcher' | 'manual';
  canInvite: boolean;
  canWatch: boolean;
}

export interface ActionReminder {
  minutesBefore: number;
  channel: 'push' | 'email';
}

export interface ActionDueDate {
  date: string;            // YYYY-MM-DD
  source: 'meeting' | 'ai' | 'user';
  locked: boolean;
  label?: string;          // human readable e.g. "Fri 5 Jun (from meeting)"
}

export interface ActionScheduledState {
  startDate: string;
  startTime: string;
  dueDate?: string;
  reminders: ActionReminder[];
  invitedMemberIds: string[];
  watcherMemberIds: string[];
  calendarEventId?: string;
}

export interface ActionMilestone {
  id: string;
  label: string;
  date: string;            // YYYY-MM-DD
  time?: string;           // HH:mm
  percentOfLeadTime: number;
  status: 'pending' | 'done' | 'missed';
  reminderMinutesBefore: number;
  scheduleReason?: string;
  conflictLevel?: 'none' | 'low' | 'high';
  loadTier?: 'low' | 'med' | 'high';
  healthAdjustments?: string[];
  userEdited?: boolean;
}

export interface PerActionSchedulingOverride {
  smartSchedulingEnabled?: boolean;
  milestonesEnabled?: boolean;
  healthAwareEnabled?: boolean;
}

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
  twoMinuteStarter?: string;

  // SMART scheduling
  dateMentionedInMeeting?: boolean;
  mentionedDateLabel?: string;
  dueDate?: ActionDueDate;
  suggestions?: SchedulingSuggestion[];
  people?: PersonPick[];
  scheduled?: ActionScheduledState;

  // Milestones + per-action overrides
  milestones?: ActionMilestone[];
  milestonePlanSource?: 'auto' | 'user' | 'mixed';
  schedulingOverride?: PerActionSchedulingOverride;
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
  supportMembers?: MentionedSupportMember[];
}

export interface ExportOptions {
  sections: Record<SectionKey, boolean>;
  filename: string;
  includeSchedule?: boolean;
}
