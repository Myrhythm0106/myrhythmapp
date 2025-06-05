
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useBackupCodes() {
  const { user } = useAuth();

  const generateBackupCodes = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('generate_backup_codes');
      
      if (error) throw error;

      // Store backup codes
      const { error: insertError } = await supabase
        .from('mfa_factors')
        .insert({
          user_id: user.id,
          factor_type: 'backup_codes',
          backup_codes: data,
          is_verified: true
        });

      if (insertError) throw insertError;

      toast.success('Backup codes generated successfully. Store them securely!');
      return data;
    } catch (error) {
      console.error('Error generating backup codes:', error);
      toast.error('Failed to generate backup codes');
      return null;
    }
  };

  return {
    generateBackupCodes
  };
}
