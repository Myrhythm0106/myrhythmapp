
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MFAFactor } from '@/types/mfa';

export function useMFAFactors() {
  const { user } = useAuth();
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const fetchMFAFactors = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mfa_factors')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Type assertion to ensure compatibility
      const typedFactors: MFAFactor[] = (data || []).map(factor => ({
        id: factor.id,
        factor_type: factor.factor_type as 'totp' | 'sms' | 'backup_codes',
        factor_name: factor.factor_name || undefined,
        is_verified: factor.is_verified,
        is_enabled: factor.is_enabled,
        phone_number: factor.phone_number || undefined,
        backup_codes: factor.backup_codes as any[] || undefined,
        created_at: factor.created_at
      }));
      
      setFactors(typedFactors);

      // Check if MFA is enabled
      const { data: profile } = await supabase
        .from('profiles')
        .select('mfa_enabled')
        .eq('id', user.id)
        .single();
      
      setMfaEnabled(profile?.mfa_enabled || false);
    } catch (error) {
      console.error('Error fetching MFA factors:', error);
    }
  };

  const toggleMFA = async (enabled: boolean) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mfa_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setMfaEnabled(enabled);
      return true;
    } catch (error) {
      console.error('Error toggling MFA:', error);
      return false;
    }
  };

  const removeFactor = async (factorId: string) => {
    try {
      const { error } = await supabase
        .from('mfa_factors')
        .delete()
        .eq('id', factorId);

      if (error) throw error;

      await fetchMFAFactors();
      return true;
    } catch (error) {
      console.error('Error removing MFA factor:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMFAFactors();
  }, [user]);

  return {
    factors,
    mfaEnabled,
    fetchMFAFactors,
    toggleMFA,
    removeFactor
  };
}
