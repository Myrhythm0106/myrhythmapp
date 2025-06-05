
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useMFALogging() {
  const { user } = useAuth();

  const logMFAAttempt = async (factorType: string, success: boolean) => {
    if (!user) return;

    try {
      await supabase
        .from('mfa_verification_attempts')
        .insert({
          user_id: user.id,
          factor_type: factorType,
          success,
          ip_address: null, // Would need to get real IP
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error logging MFA attempt:', error);
    }
  };

  return {
    logMFAAttempt
  };
}
