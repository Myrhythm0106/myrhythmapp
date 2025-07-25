
import { RealMFAVerification } from '@/utils/mfa/realMFAVerification';
import { supabase } from '@/integrations/supabase/client';

export const verifyMFACode = async (
  selectedFactor: 'totp' | 'sms' | 'backup_codes',
  verificationCode: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    let result;
    switch (selectedFactor) {
      case 'totp':
        result = await RealMFAVerification.verifyTOTP(verificationCode, user.id);
        break;
      case 'sms':
        result = await RealMFAVerification.verifySMS(verificationCode, user.id);
        break;
      case 'backup_codes':
        result = await RealMFAVerification.verifyBackupCode(verificationCode, user.id);
        break;
      default:
        return false;
    }

    return result.success;
  } catch (error) {
    // Use secure logger instead of console.error
    return false;
  }
};

export const MFA_CONFIG = {
  MAX_ATTEMPTS: 3
};
