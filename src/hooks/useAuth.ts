import { useAuth as useRealAuth } from '@/contexts/AuthContext';
import { useAuth as useMockAuth } from '@/contexts/mockAuthContext';

export function useAuth() {
  const isMockMode = import.meta.env.VITE_MOCK_SECURITY === 'true';
  
  if (isMockMode) {
    return useMockAuth();
  } else {
    return useRealAuth();
  }
}