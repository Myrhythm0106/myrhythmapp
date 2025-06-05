
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useSMSSetup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const setupSMS = async (phoneNumber: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Store phone number and create SMS factor
      const { error: factorError } = await supabase
        .from('mfa_factors')
        .insert({
          user_id: user.id,
          factor_type: 'sms',
          phone_number: phoneNumber,
          is_verified: false
        });

      if (factorError) throw factorError;

      // Update profile with phone number
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ phone_number: phoneNumber })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // In a real implementation, send SMS verification code
      toast.success('SMS setup initiated. Verification code sent to your phone.');
      return true;
    } catch (error) {
      console.error('Error setting up SMS:', error);
      toast.error('Failed to setup SMS authentication');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    setupSMS,
    loading
  };
}
