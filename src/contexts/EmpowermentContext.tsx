import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEmpowermentStatements, type EmpowermentStatement } from '@/hooks/useEmpowermentStatements';
import { useUserData } from '@/hooks/use-user-data';

interface EmpowermentContextType {
  dailyStatement: EmpowermentStatement | null;
  refreshStatement: () => void;
  toggleFavorite: (statementId: string) => void;
  dismissedForToday: boolean;
  dismissForToday: () => void;
  isLoading: boolean;
}

const EmpowermentContext = createContext<EmpowermentContextType | undefined>(undefined);

export function EmpowermentProvider({ children }: { children: React.ReactNode }) {
  const userData = useUserData();
  const [dismissedForToday, setDismissedForToday] = useState(() => {
    const today = new Date().toDateString();
    return localStorage.getItem(`empowerment-dismissed-${today}`) === 'true';
  });
  const [currentStatement, setCurrentStatement] = useState<EmpowermentStatement | null>(null);

  const { 
    statements, 
    isLoading, 
    selectDailyStatement, 
    toggleFavorite: toggleStatementFavorite,
    recordStatementShown 
  } = useEmpowermentStatements(
    userData.userType || 'wellness',
    false // For now, assume no premium access
  );

  // Select daily statement on mount or when statements change
  useEffect(() => {
    if (statements.length > 0 && !currentStatement && !dismissedForToday) {
      const selected = selectDailyStatement();
      if (selected) {
        setCurrentStatement(selected);
        // Record that we showed this statement
        recordStatementShown({ statementId: selected.id });
      }
    }
  }, [statements, currentStatement, dismissedForToday, selectDailyStatement, recordStatementShown]);

  const refreshStatement = () => {
    if (statements.length > 0) {
      const newStatement = selectDailyStatement();
      if (newStatement) {
        setCurrentStatement(newStatement);
        recordStatementShown({ statementId: newStatement.id });
        // Clear dismissal when refreshing
        const today = new Date().toDateString();
        localStorage.removeItem(`empowerment-dismissed-${today}`);
        setDismissedForToday(false);
      }
    }
  };

  const dismissForToday = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`empowerment-dismissed-${today}`, 'true');
    setDismissedForToday(true);
  };

  const toggleFavorite = (statementId: string) => {
    toggleStatementFavorite(statementId);
  };

  return (
    <EmpowermentContext.Provider
      value={{
        dailyStatement: currentStatement,
        refreshStatement,
        toggleFavorite,
        dismissedForToday,
        dismissForToday,
        isLoading
      }}
    >
      {children}
    </EmpowermentContext.Provider>
  );
}

export function useEmpowerment() {
  const context = useContext(EmpowermentContext);
  if (context === undefined) {
    throw new Error('useEmpowerment must be used within an EmpowermentProvider');
  }
  return context;
}