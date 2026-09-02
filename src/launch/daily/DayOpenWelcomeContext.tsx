import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DayOpenWelcomeContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DayOpenWelcomeContext = createContext<DayOpenWelcomeContextValue | null>(null);

export function DayOpenWelcomeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DayOpenWelcomeContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DayOpenWelcomeContext.Provider>
  );
}

export function useDayOpenWelcomeOpen(): DayOpenWelcomeContextValue {
  const ctx = useContext(DayOpenWelcomeContext);
  if (!ctx) {
    throw new Error('useDayOpenWelcomeOpen must be used within DayOpenWelcomeProvider');
  }
  return ctx;
}
