// Brain-injury demo seed — runs once per session per screen group.
// Makes every prototype screen "alive" without requiring the user to capture first.

import {
  loadActs, saveActs, smartReminderDefaults,
  type PrototypeAct,
} from './prototypeStore';
import {
  saveAssessmentProfile, loadAssessmentProfile,
} from './prototypeAssessment';
import {
  loadCircle, addMember,
} from './prototypeSupportCircle';

const DEMO_FLAG = 'prototype:demoSeeded';

export function isDemoSeeded(): boolean {
  return sessionStorage.getItem(DEMO_FLAG) === '1';
}
export function markDemoSeeded() {
  sessionStorage.setItem(DEMO_FLAG, '1');
}

export function ensureDemoAssessment() {
  if (loadAssessmentProfile()) return;
  saveAssessmentProfile({
    persona: 'rebuilding',
    hardestRightNow: 'fatigue',
    bestFocusWindow: 'late_morning',
    lowEnergyWindow: 'afternoon',
    supportStyle: 'shared_circle',
    recommendedNext: 'capture',
    completedAt: new Date().toISOString(),
  });
}

export function ensureDemoCircle() {
  if (loadCircle().length > 0) return;
  addMember({ name: 'Sarah',     relationship: 'partner',   role: 'accountability', notifyByDefault: true });
  addMember({ name: 'Dr. Patel', relationship: 'clinician', role: 'clinical',       notifyByDefault: true });
  addMember({ name: 'Mum',       relationship: 'family',    role: 'cheerleader',    notifyByDefault: false });
}

export function ensureDemoActs() {
  if (loadActs().length > 0) return;
  const today = new Date();
  const inDays = (n: number) => {
    const d = new Date(today); d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const base: PrototypeAct[] = [
    { id: crypto.randomUUID(), text: 'Neuro follow-up with Dr. Patel',           assignee: 'me', dueContext: 'this week',  priority: 'high',   confidence: 0.94, proposedDate: inDays(2), proposedTime: '10:00', attendees: ['Dr. Patel'], status: 'pending', actType: 'follow_up', cognitiveLoad: 'high',  shareWith: ['Dr. Patel', 'Sarah'] },
    { id: crypto.randomUUID(), text: 'Vestibular PT — balance + gaze exercises', assignee: 'me', dueContext: 'tomorrow',   priority: 'high',   confidence: 0.91, proposedDate: inDays(1), proposedTime: '10:30', attendees: [], status: 'pending', actType: 'lifestyle', cognitiveLoad: 'medium' },
    { id: crypto.randomUUID(), text: 'Log symptoms & medication side-effects',    assignee: 'me', dueContext: 'today',      priority: 'medium', confidence: 0.88, proposedDate: inDays(0), proposedTime: '09:30', attendees: [], status: 'pending', actType: 'homework',  cognitiveLoad: 'low' },
    { id: crypto.randomUUID(), text: 'Gentle 15-min walk (energy-permitting)',    assignee: 'me', dueContext: 'today',      priority: 'low',    confidence: 0.86, proposedDate: inDays(0), proposedTime: '17:00', attendees: [], status: 'pending', actType: 'lifestyle', cognitiveLoad: 'low' },
    { id: crypto.randomUUID(), text: 'Protected rest — no screens, lights low',   assignee: 'me', dueContext: 'today',      priority: 'medium', confidence: 0.90, proposedDate: inDays(0), proposedTime: '14:30', attendees: [], status: 'pending', actType: 'lifestyle', cognitiveLoad: 'low' },
    { id: crypto.randomUUID(), text: 'Family check-in with Mum (15 min)',         assignee: 'me', dueContext: 'Sunday',     priority: 'low',    confidence: 0.82, proposedDate: inDays(3), proposedTime: '18:00', attendees: ['Mum'], status: 'pending', actType: 'general',   cognitiveLoad: 'low' },
  ];
  saveActs(base.map(a => ({ ...a, reminders: smartReminderDefaults(a) })));
}

// Seed everything; idempotent.
export function ensureFullDemo() {
  ensureDemoAssessment();
  ensureDemoCircle();
  ensureDemoActs();
  markDemoSeeded();
}

export function clearAllDemo() {
  sessionStorage.removeItem('prototype:assessmentProfile');
  sessionStorage.removeItem('prototype:supportCircle');
  sessionStorage.removeItem('prototype:acts');
  sessionStorage.removeItem('prototype:transcript');
  sessionStorage.removeItem(DEMO_FLAG);
}
