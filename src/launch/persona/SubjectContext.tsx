import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Subject = 'self' | 'supporting';

const SUBJECT_KEY = 'myrhythm_caregiver_subject';
const NAME_KEY = 'myrhythm_caregiver_supported_name';

interface SubjectContextValue {
  subject: Subject;
  supportedName: string;
  setSubject: (s: Subject) => void;
  setSupportedName: (name: string) => void;
}

const SubjectContext = createContext<SubjectContextValue | undefined>(undefined);

export function SubjectProvider({ children }: { children: React.ReactNode }) {
  const [subject, setSubjectState] = useState<Subject>(() => {
    if (typeof window === 'undefined') return 'self';
    return (localStorage.getItem(SUBJECT_KEY) as Subject | null) ?? 'self';
  });
  const [supportedName, setSupportedNameState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'the person you support';
    return localStorage.getItem(NAME_KEY) ?? 'the person you support';
  });

  useEffect(() => {
    localStorage.setItem(SUBJECT_KEY, subject);
  }, [subject]);
  useEffect(() => {
    localStorage.setItem(NAME_KEY, supportedName);
  }, [supportedName]);

  const value = useMemo<SubjectContextValue>(() => ({
    subject,
    supportedName,
    setSubject: setSubjectState,
    setSupportedName: setSupportedNameState,
  }), [subject, supportedName]);

  return <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>;
}

export function useSubject(): SubjectContextValue {
  const ctx = useContext(SubjectContext);
  if (!ctx) {
    return {
      subject: 'self',
      supportedName: 'the person you support',
      setSubject: () => {},
      setSupportedName: () => {},
    };
  }
  return ctx;
}
