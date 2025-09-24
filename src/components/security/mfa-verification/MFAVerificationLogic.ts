
import { MFAVerification } from '@/utils/mfa';
import { supabase } from '@/integrations/supabase/client';
import { SecureLogger } from '@/utils/security';

export const verifyMFACode = async (
  selectedFactor: 'totp' | 'sms' | 'backup_codes',
  verificationCode: string
): Promise<boolean> => {
  let user = null;
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
    if (!user) {
      return false;
    }

    const mfa = await MFAVerification.getInstance();
    let result;
    switch (selectedFactor) {
      case 'totp':
        result = await mfa.verifyTOTP(verificationCode, user.id);
        break;
      case 'sms':
        result = await mfa.verifySMS(verificationCode, user.id);
        break;
      case 'backup_codes':
        result = await mfa.verifyBackupCode(verificationCode, user.id);
        break;
      default:
        return false;
    }

    return result.success;
  } catch (error) {
    const logger = await SecureLogger.getInstance();
    logger.error('MFA verification failed', error, user?.id);
    return false;
  }
};

export const MFA_CONFIG = {
  MAX_ATTEMPTS: 3
};
