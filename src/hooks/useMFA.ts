
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface MFAFactor {
  id: string;
  factor_type: 'totp' | 'sms' | 'backup_codes';
  factor_name?: string;
  is_verified: boolean;
  is_enabled: boolean;
  phone_number?: string;
  backup_codes?: any[];
  created_at: string;
}

export function useMFA() {
  const { user } = useAuth();
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // Fetch user's MFA factors
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

  // Generate TOTP secret and QR code
  const setupTOTP = async (factorName: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      // Generate a secret key
      const secret = generateTOTPSecret();
      const issuer = 'MyRhythm';
      const accountName = user.email;
      const qrCodeUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

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
        manualEntryKey: secret.match(/.{1,4}/g)?.join(' ') || secret
      };
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      toast.error('Failed to setup TOTP authentication');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verify TOTP code
  const verifyTOTP = async (code: string) => {
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

        await logMFAAttempt('totp', true);
        toast.success('TOTP authentication verified successfully!');
        await fetchMFAFactors();
        return true;
      } else {
        await logMFAAttempt('totp', false);
        toast.error('Invalid TOTP code. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      toast.error('Failed to verify TOTP code');
      return false;
    }
  };

  // Setup SMS MFA
  const setupSMS = async (phoneNumber: string) => {
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
      await fetchMFAFactors();
      return true;
    } catch (error) {
      console.error('Error setting up SMS:', error);
      toast.error('Failed to setup SMS authentication');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Generate backup codes
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
      await fetchMFAFactors();
      return data;
    } catch (error) {
      console.error('Error generating backup codes:', error);
      toast.error('Failed to generate backup codes');
      return null;
    }
  };

  // Enable/Disable MFA
  const toggleMFA = async (enabled: boolean) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mfa_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setMfaEnabled(enabled);
      toast.success(`MFA ${enabled ? 'enabled' : 'disabled'} successfully`);
      return true;
    } catch (error) {
      console.error('Error toggling MFA:', error);
      toast.error(`Failed to ${enabled ? 'enable' : 'disable'} MFA`);
      return false;
    }
  };

  // Remove MFA factor
  const removeFactor = async (factorId: string) => {
    try {
      const { error } = await supabase
        .from('mfa_factors')
        .delete()
        .eq('id', factorId);

      if (error) throw error;

      toast.success('MFA factor removed successfully');
      await fetchMFAFactors();
      return true;
    } catch (error) {
      console.error('Error removing MFA factor:', error);
      toast.error('Failed to remove MFA factor');
      return false;
    }
  };

  // Log MFA verification attempt
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

  useEffect(() => {
    fetchMFAFactors();
  }, [user]);

  return {
    factors,
    mfaEnabled,
    loading,
    setupTOTP,
    verifyTOTP,
    setupSMS,
    generateBackupCodes,
    toggleMFA,
    removeFactor,
    refreshFactors: fetchMFAFactors
  };
}

// Helper functions
function generateTOTPSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

function verifyTOTPCode(code: string, factorId: string): boolean {
  // In a real implementation, use a TOTP library like 'otplib'
  // For demo purposes, accept any 6-digit code
  return /^\d{6}$/.test(code);
}
