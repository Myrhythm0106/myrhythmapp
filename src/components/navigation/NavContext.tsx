import React, { createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface NavContextType {
  currentRoute: string;
  isActive: (path: string) => boolean;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

interface NavProviderProps {
  children: ReactNode;
}

export function NavProvider({ children }: NavProviderProps) {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    // Exact match for home/dashboard
    if (path === '/dashboard' || path === '/') {
      return location.pathname === path || location.pathname === '/dashboard' || location.pathname === '/';
    }
    
    // Prefix match for other routes
    return location.pathname.startsWith(path);
  };

  const value: NavContextType = {
    currentRoute: location.pathname,
    isActive,
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const context = useContext(NavContext);
  if (context === undefined) {
    throw new Error('useNav must be used within NavProvider');
  }
  return context;
}
