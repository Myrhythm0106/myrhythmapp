// Lightweight session-scoped store for the MVP prototype flow.
// No backend coupling — keeps the prototype isolated and revertible.

export interface PrototypeAct {
  id: string;
  text: string;
  assignee: string;       // "me" or a name
  dueContext: string;     // "tomorrow", "next week"
  priority: 'high' | 'medium' | 'low';
  confidence: number;     // 0..1
  // scheduling
  proposedDate?: string;  // ISO date
  proposedTime?: string;  // HH:mm
  attendees?: string[];   // names invited
  status: 'pending' | 'confirmed' | 'rejected' | 'scheduled';
}

const KEY = 'prototype:acts';

export function loadActs(): PrototypeAct[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveActs(acts: PrototypeAct[]) {
  sessionStorage.setItem(KEY, JSON.stringify(acts));
}

export function clearActs() {
  sessionStorage.removeItem(KEY);
}

// Sample ACTs used when the user taps "Try a sample meeting" so the
// rest of the flow is demonstrable without recording live audio.
export function getSampleActs(): PrototypeAct[] {
  const today = new Date();
  const inDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  return [
    {
      id: crypto.randomUUID(),
      text: 'Book follow-up appointment with Dr. Patel',
      assignee: 'me',
      dueContext: 'this week',
      priority: 'high',
      confidence: 0.92,
      proposedDate: inDays(2),
      proposedTime: '10:00',
      attendees: ['Dr. Patel'],
      status: 'pending',
    },
    {
      id: crypto.randomUUID(),
      text: 'Call Sarah to discuss the school meeting',
      assignee: 'me',
      dueContext: 'tomorrow',
      priority: 'medium',
      confidence: 0.85,
      proposedDate: inDays(1),
      proposedTime: '14:30',
      attendees: ['Sarah'],
      status: 'pending',
    },
    {
      id: crypto.randomUUID(),
      text: 'Pick up prescription from pharmacy',
      assignee: 'me',
      dueContext: 'today',
      priority: 'high',
      confidence: 0.95,
      proposedDate: inDays(0),
      proposedTime: '16:00',
      attendees: [],
      status: 'pending',
    },
    {
      id: crypto.randomUUID(),
      text: 'Share weekly update with Mum',
      assignee: 'me',
      dueContext: 'Sunday',
      priority: 'low',
      confidence: 0.78,
      proposedDate: inDays(4),
      proposedTime: '18:00',
      attendees: ['Mum'],
      status: 'pending',
    },
  ];
}

// Lightweight contact pool for attendee suggestions.
export const SUGGESTED_CONTACTS = [
  'Sarah', 'Dr. Patel', 'Mum', 'Dad', 'James (OT)', 'Care coordinator',
];
