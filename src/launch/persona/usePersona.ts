import { useEffect, useState } from 'react';

export type Persona = 'recovery' | 'caregiver' | 'productivity' | 'student';

export const PERSONA_LABEL: Record<Persona, string> = {
  recovery: 'Pathfinder',
  caregiver: 'Anchor',
  productivity: 'Operator',
  student: 'Scholar',
};

export const PERSONA_LABEL_PLURAL: Record<Persona, string> = {
  recovery: 'Pathfinders',
  caregiver: 'Anchors',
  productivity: 'Operators',
  student: 'Scholars',
};

export const PERSONA_DEFINITION: Record<Persona, string> = {
  recovery: 'People rebuilding cognitive ground after a neurological event or condition — brain injury, stroke, dementia, long COVID, MS. Pathfinders use MyRhythm to bridge clinical-ready and life-ready, one steady step at a time.',
  caregiver: 'The people who hold the line for someone else — family carers, spouses, adult children, professional carers. Anchors use MyRhythm to coordinate care without losing their own day, and to protect themselves from burnout.',
  productivity: 'High-output professionals and focus-seekers protecting their best thinking. Operators use MyRhythm to defend deep work, convert meetings into leverage, and keep signal above noise.',
  student: 'Students and lifelong learners pacing themselves toward recall, not burnout. Scholars use MyRhythm to turn lectures and revision into a searchable record, and to compound study across the week.',
};

export const PERSONA_DEFINITION_SHORT: Record<Persona, string> = {
  recovery: 'Rebuilding cognitive ground after a neurological event or condition.',
  caregiver: 'Holding the line for someone you love — without losing your own day.',
  productivity: 'High-output professionals protecting their best thinking.',
  student: 'Pacing study toward recall, not burnout.',
};

function readRawType(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const direct = localStorage.getItem('myrhythm_user_type');
    if (direct) return direct;
    const saved = localStorage.getItem('myrhythm_launch_mode');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed?.assessmentResults?.userType ?? parsed?.selectedUserType ?? null;
    }
  } catch {
    /* noop */
  }
  return null;
}

export function mapToPersona(raw: string | null | undefined): Persona {
  switch (raw) {
    case 'caregiver':
    case 'medical-professional':
      return 'caregiver';
    case 'executive':
    case 'wellness':
    case 'cognitive-optimization':
    case 'adhd':
    case 'goal-achiever':
      return 'productivity';
    case 'student':
      return 'student';
    case 'brain-injury':
    case 'recovery':
    case 'post-recovery':
    case 'long-covid':
    case 'ms-cognitive':
    default:
      return 'recovery';
  }
}

export interface PersonaInfo {
  persona: Persona;
  label: string;
  isCaregiver: boolean;
  rawType: string | null;
}

export function usePersona(): PersonaInfo {
  const [rawType, setRawType] = useState<string | null>(() => readRawType());

  useEffect(() => {
    const onStorage = () => setRawType(readRawType());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persona = mapToPersona(rawType);
  return {
    persona,
    label: PERSONA_LABEL[persona],
    isCaregiver: persona === 'caregiver',
    rawType,
  };
}
