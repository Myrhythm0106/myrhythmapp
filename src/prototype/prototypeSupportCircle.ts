// Session-scoped Support Circle for the prototype.
// No DB, no real invites — purely demonstrative.

import type { PrototypeAct } from './prototypeStore';

export type CircleRelationship =
  | 'partner' | 'family' | 'friend' | 'clinician' | 'caregiver' | 'other';

export type CircleRole =
  | 'cheerleader'      // celebrates wins
  | 'accountability'   // nudges follow-through
  | 'logistics'        // helps with rides, scheduling
  | 'clinical';        // doctor / OT / care coordinator

export interface PrototypeCircleMember {
  id: string;
  name: string;
  relationship: CircleRelationship;
  role: CircleRole;
  notifyByDefault: boolean;
}

const KEY = 'prototype:supportCircle';

export function loadCircle(): PrototypeCircleMember[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCircle(members: PrototypeCircleMember[]) {
  sessionStorage.setItem(KEY, JSON.stringify(members));
}

export function addMember(m: Omit<PrototypeCircleMember, 'id'>): PrototypeCircleMember {
  const member = { ...m, id: crypto.randomUUID() };
  const next = [...loadCircle(), member];
  saveCircle(next);
  return member;
}

export function removeMember(id: string) {
  saveCircle(loadCircle().filter(m => m.id !== id));
}

export function clearCircle() {
  sessionStorage.removeItem(KEY);
}

export const RELATIONSHIP_LABEL: Record<CircleRelationship, string> = {
  partner: 'Partner', family: 'Family', friend: 'Friend',
  clinician: 'Clinician', caregiver: 'Caregiver', other: 'Other',
};

export const ROLE_LABEL: Record<CircleRole, string> = {
  cheerleader: 'Cheerleader',
  accountability: 'Accountability',
  logistics: 'Logistics',
  clinical: 'Clinical',
};

// Suggest members likely to fit an action based on type / priority.
export function suggestForAct(act: PrototypeAct): PrototypeCircleMember[] {
  const all = loadCircle();
  if (all.length === 0) return [];
  const isClinical = act.actType === 'medication' || act.actType === 'follow_up'
    || act.actType === 'test' || act.actType === 'referral';
  const wantsAccountability = act.actType === 'lifestyle' || act.actType === 'homework';

  return all.filter(m => {
    if (m.notifyByDefault && act.priority === 'high') return true;
    if (isClinical && m.role === 'clinical') return true;
    if (wantsAccountability && m.role === 'accountability') return true;
    return false;
  });
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map(s => s[0]?.toUpperCase() ?? '').join('');
}
