// Single source of truth for the "Who's involved" roles on a next step.
// RACI under the hood, everyday words on screen — clinicians, family and
// colleagues should understand each role at a glance without knowing the
// acronym. The small R/A/C/I letter stays as a quiet secondary tag.

export type ActionRoleKey = 'responsible' | 'accountable' | 'consulted' | 'informed';

export interface ActionPerson {
  name: string;
  email?: string | null;
}

export interface ActionRoleDef {
  key: ActionRoleKey;
  /** Quiet secondary tag for people who know the RACI standard. */
  letter: 'R' | 'A' | 'C' | 'I';
  /** Primary on-screen label — everyday language. */
  label: string;
  /** One-line helper shown under the label in the sheet. */
  helper: string;
  /** The plain sentence used in emails, with {name} optional. */
  emailLine: string;
  /** Only one person may hold this role per action. */
  single: boolean;
}

export const ACTION_ROLES: ActionRoleDef[] = [
  {
    key: 'responsible',
    letter: 'R',
    label: 'Does it',
    helper: 'The person who actually carries this out.',
    emailLine: "This step is yours to do.",
    single: true,
  },
  {
    key: 'accountable',
    letter: 'A',
    label: 'Signs it off',
    helper: 'One person who confirms it\u2019s done properly.',
    emailLine: "You\u2019re the one who signs this step off.",
    single: true,
  },
  {
    key: 'consulted',
    letter: 'C',
    label: 'Ask first',
    helper: 'People asked for their input before it\u2019s done.',
    emailLine: "You\u2019re asked first on this step — input welcome before it\u2019s done.",
    single: false,
  },
  {
    key: 'informed',
    letter: 'I',
    label: 'Keep in the loop',
    helper: 'People told once it\u2019s scheduled or done.',
    emailLine: "We\u2019ll keep you in the loop on this step.",
    single: false,
  },
];

export const roleDef = (key: ActionRoleKey): ActionRoleDef =>
  ACTION_ROLES.find((r) => r.key === key)!;

export interface ActionInvolvement {
  responsible: ActionPerson;
  accountable: ActionPerson | null;
  consulted: ActionPerson[];
  informed: ActionPerson[];
}

/** Everyone with an email address, tagged with their role. */
export function emailableRecipients(inv: ActionInvolvement): { person: ActionPerson; role: ActionRoleKey }[] {
  const out: { person: ActionPerson; role: ActionRoleKey }[] = [];
  if (inv.responsible.email) out.push({ person: inv.responsible, role: 'responsible' });
  if (inv.accountable?.email) out.push({ person: inv.accountable, role: 'accountable' });
  for (const p of inv.consulted) if (p.email) out.push({ person: p, role: 'consulted' });
  for (const p of inv.informed) if (p.email) out.push({ person: p, role: 'informed' });
  // De-dupe by email, keeping the most senior role (first wins: R > A > C > I).
  const seen = new Set<string>();
  return out.filter(({ person }) => {
    const key = person.email!.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
