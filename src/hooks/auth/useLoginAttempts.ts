
import { useState } from 'react';
import { LoginAttemptsManager, AuthAttempt } from '@/utils/auth/loginAttempts';

export function useLoginAttempts() {
  const [manager] = useState(() => new LoginAttemptsManager());

  return {
    isEmailLocked: (email: string) => manager.isEmailLocked(email),
    recordFailedAttempt: (email: string) => manager.recordFailedAttempt(email),
    clearAttempts: (email: string) => manager.clearAttempts(email),
    getAttempts: (): AuthAttempt[] => manager.getAttempts()
  };
}
