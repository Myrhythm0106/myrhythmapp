// Single source of truth for Support Circle relationships and role presets.
// Support Circle = the roster of who has access to what.
// "In the loop" on an action = per-action tag (may reuse a circle member OR be ad-hoc).

export const RELATIONSHIP_OPTIONS = [
  'Family',
  'Friend',
  'Partner',
  'Carer',
  'Colleague',
  'Clinician',
  'Other',
] as const;

export type RelationshipOption = typeof RELATIONSHIP_OPTIONS[number];

export type SupportRolePresetId =
  | 'cheerleader'
  | 'everyday_buddy'
  | 'family_co_planner'
  | 'clinician'
  | 'custom';

export interface SupportRolePreset {
  id: SupportRolePresetId;
  label: string;
  description: string;
  /** Writes to `support_circle_members.role` */
  role: 'viewer' | 'supporter' | 'caregiver' | 'medical';
  /** Writes to `support_circle_members.permissions` (JSONB) */
  permissions: Record<string, boolean>;
}

export const ROLE_PRESETS: SupportRolePreset[] = [
  {
    id: 'cheerleader',
    label: 'Cheerleader',
    description: 'Sees your wins only.',
    role: 'viewer',
    permissions: { growth: true },
  },
  {
    id: 'everyday_buddy',
    label: 'Everyday buddy',
    description: 'Calendar and actions.',
    role: 'supporter',
    permissions: { calendar: true, actions: true },
  },
  {
    id: 'family_co_planner',
    label: 'Family / co-planner',
    description: 'Calendar, actions, goals and growth.',
    role: 'caregiver',
    permissions: { calendar: true, actions: true, goals: true, growth: true },
  },
  {
    id: 'clinician',
    label: 'Clinician',
    description: 'Full access plus concern alerts.',
    role: 'medical',
    permissions: {
      calendar: true,
      actions: true,
      goals: true,
      growth: true,
      health: true,
    },
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Pick permissions area by area.',
    role: 'supporter',
    permissions: {},
  },
];

/** Match an existing role+permissions blob back to a preset id (best-effort). */
export function matchRolePreset(
  role: string | undefined,
  permissions: Record<string, boolean> | undefined
): SupportRolePresetId {
  const perms = permissions || {};
  const keys = Object.keys(perms).filter((k) => perms[k]).sort().join(',');
  for (const preset of ROLE_PRESETS) {
    if (preset.id === 'custom') continue;
    const presetKeys = Object.keys(preset.permissions).sort().join(',');
    if (presetKeys === keys && preset.role === role) return preset.id;
  }
  return 'custom';
}

/** Non-medical, warm label for the count of people "in the loop" on an action. */
export function getLoopLabel(count: number): string {
  if (count <= 0) return 'No one in the loop';
  if (count === 1) return '1 in the loop';
  return `${count} in the loop`;
}
