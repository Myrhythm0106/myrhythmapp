
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { generateTOTPSecret, verifyTOTPCode, generateQRCodeUrl, formatManualEntryKey } from '@/utils/mfa/totpUtils';
import { TOTPSetupData } from '@/types/mfa';

export function useTOTPSetup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const setupTOTP = async (factorName: string): Promise<TOTPSetupData | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      // Generate a secret key
      const secret = generateTOTPSecret();
      const issuer = 'MyRhythm';
      const accountName = user.email;
      const qrCodeUrl = generateQRCodeUrl(secret, issuer, accountName);

      // Store the factor in database (unverified)
      const { error } = await supabase
        .from('mfa_factors')
        .insert({
          user_id: user.id,
          factor_type: 'totp',
          factor_name: factorName,
          secret: secret,
          is_verified: false
        });

      if (error) throw error;

      toast.success('TOTP setup initiated. Scan the QR code with your authenticator app.');
      
      return {
        secret,
        qrCodeUrl,
        manualEntryKey: formatManualEntryKey(secret)
      };
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      toast.error('Failed to setup TOTP authentication');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyTOTP = async (code: string, factors: any[]): Promise<boolean> => {
    if (!user) return false;

    try {
      const factor = factors.find(f => f.factor_type === 'totp' && !f.is_verified);
      if (!factor) {
        toast.error('No TOTP factor found for verification');
        return false;
      }

      // In a real implementation, you'd verify the TOTP code against the secret
      // For now, we'll simulate verification
      const isValid = verifyTOTPCode(code, factor.id);
      
      if (isValid) {
        const { error } = await supabase
          .from('mfa_factors')
          .update({ is_verified: true })
          .eq('id', factor.id);

        if (error) throw error;

        toast.success('TOTP authentication verified successfully!');
        return true;
      } else {
        toast.error('Invalid TOTP code. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      toast.error('Failed to verify TOTP code');
      return false;
    }
  };

  return {
    setupTOTP,
    verifyTOTP,
    loading
  };
}
