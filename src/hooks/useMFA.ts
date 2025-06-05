
import { useMFAFactors } from './mfa/useMFAFactors';
import { useTOTPSetup } from './mfa/useTOTPSetup';
import { useSMSSetup } from './mfa/useSMSSetup';
import { useBackupCodes } from './mfa/useBackupCodes';
import { useMFALogging } from './mfa/useMFALogging';

export function useMFA() {
  const {
    factors,
    mfaEnabled,
    fetchMFAFactors,
    toggleMFA,
    removeFactor
  } = useMFAFactors();

  const {
    setupTOTP,
    verifyTOTP,
    loading: totpLoading
  } = useTOTPSetup();

  const {
    setupSMS,
    loading: smsLoading
  } = useSMSSetup();

  const { generateBackupCodes } = useBackupCodes();
  const { logMFAAttempt } = useMFALogging();

  const loading = totpLoading || smsLoading;

  const enhancedVerifyTOTP = async (code: string): Promise<boolean> => {
    const result = await verifyTOTP(code, factors);
    await logMFAAttempt('totp', result);
    if (result) {
      await fetchMFAFactors();
    }
    return result;
  };

  const enhancedSetupSMS = async (phoneNumber: string): Promise<boolean> => {
    const result = await setupSMS(phoneNumber);
    if (result) {
      await fetchMFAFactors();
    }
    return result;
  };

  const enhancedGenerateBackupCodes = async () => {
    const result = await generateBackupCodes();
    if (result) {
      await fetchMFAFactors();
    }
    return result;
  };

  const enhancedToggleMFA = async (enabled: boolean): Promise<boolean> => {
    const result = await toggleMFA(enabled);
    if (result) {
      const message = enabled ? 'enabled' : 'disabled';
      console.log(`MFA ${message} successfully`);
    }
    return result;
  };

  const enhancedRemoveFactor = async (factorId: string): Promise<boolean> => {
    const result = await removeFactor(factorId);
    if (result) {
      console.log('MFA factor removed successfully');
    }
    return result;
  };

  return {
    factors,
    mfaEnabled,
    loading,
    setupTOTP,
    verifyTOTP: enhancedVerifyTOTP,
    setupSMS: enhancedSetupSMS,
    generateBackupCodes: enhancedGenerateBackupCodes,
    toggleMFA: enhancedToggleMFA,
    removeFactor: enhancedRemoveFactor,
    refreshFactors: fetchMFAFactors
  };
}
