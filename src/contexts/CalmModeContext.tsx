import React, { createContext, useContext, useState, useEffect } from "react";

interface CalmModeContextType {
  isCalmMode: boolean;
  toggleCalmMode: () => void;
  setCalmMode: (enabled: boolean) => void;
}

const CalmModeContext = createContext<CalmModeContextType | undefined>(undefined);

interface CalmModeProviderProps {
  children: React.ReactNode;
}

export function CalmModeProvider({ children }: CalmModeProviderProps) {
  const [isCalmMode, setIsCalmMode] = useState(() => {
    const saved = localStorage.getItem('myrhythm_calm_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('myrhythm_calm_mode', isCalmMode.toString());
    
    // Apply calm mode styles to body
    if (isCalmMode) {
      document.body.classList.add('calm-mode');
    } else {
      document.body.classList.remove('calm-mode');
    }

    return () => {
      document.body.classList.remove('calm-mode');
    };
  }, [isCalmMode]);

  const toggleCalmMode = () => {
    setIsCalmMode(!isCalmMode);
  };

  const setCalmMode = (enabled: boolean) => {
    setIsCalmMode(enabled);
  };

  return (
    <CalmModeContext.Provider value={{
      isCalmMode,
      toggleCalmMode,
      setCalmMode
    }}>
      {children}
    </CalmModeContext.Provider>
  );
}

export function useCalmMode() {
  const context = useContext(CalmModeContext);
  if (context === undefined) {
    throw new Error('useCalmMode must be used within a CalmModeProvider');
  }
  return context;
}