import React, { useEffect, useState } from 'react';
import { AuthProvider as RealAuthProvider } from '@/contexts/AuthContext';
import { MockAuthProvider } from '@/contexts/mockAuthContext';

interface MockAuthWrapperProps {
  children: React.ReactNode;
}

export function MockAuthWrapper({ children }: MockAuthWrapperProps) {
  const [AuthComponent, setAuthComponent] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);

  useEffect(() => {
    const isMockMode = import.meta.env.VITE_MOCK_SECURITY === 'true';
    
    if (isMockMode) {
      console.log('🔒 Using Mock Authentication System');
      setAuthComponent(() => MockAuthProvider);
    } else {
      console.log('🔒 Using Real Authentication System');
      setAuthComponent(() => RealAuthProvider);
    }
  }, []);

  if (!AuthComponent) {
    return <div>Loading auth system...</div>;
  }

  return <AuthComponent>{children}</AuthComponent>;
}