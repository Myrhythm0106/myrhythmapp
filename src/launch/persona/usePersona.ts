import { useEffect, useState } from 'react';

export type Persona = 'recovery' | 'caregiver' | 'productivity' | 'student';

const PERSONA_LABEL: Record<Persona, string> = {
  recovery: 'Recovery',
  caregiver: 'Caregiver',
  productivity: 'Professional',
  student: 'Student',
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
