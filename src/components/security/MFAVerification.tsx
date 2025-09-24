
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { SecureLogger } from '@/utils/security/secureLogger';
import { MFAVerificationHeader } from './mfa-verification/MFAVerificationHeader';
import { MFAFactorSelector } from './mfa-verification/MFAFactorSelector';
import { MFACodeInput } from './mfa-verification/MFACodeInput';
import { MFAVerificationAlerts } from './mfa-verification/MFAVerificationAlerts';
import { MFAVerificationActions } from './mfa-verification/MFAVerificationActions';
import { verifyMFACode, MFA_CONFIG } from './mfa-verification/MFAVerificationLogic';

interface MFAVerificationProps {
  onVerificationComplete: (success: boolean) => void;
  availableFactors: Array<{
    type: 'totp' | 'sms' | 'backup_codes';
    name?: string;
    phone?: string;
  }>;
}

export function MFAVerification({ onVerificationComplete, availableFactors }: MFAVerificationProps) {
  const { user } = useAuth();
  const [selectedFactor, setSelectedFactor] = useState<'totp' | 'sms' | 'backup_codes'>('totp');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const maxAttempts = MFA_CONFIG.MAX_ATTEMPTS;
  const hasExceededAttempts = attempts >= maxAttempts;

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    if (hasExceededAttempts) {
      toast.error('Maximum verification attempts exceeded');
      onVerificationComplete(false);
      return;
    }

    setLoading(true);
    try {
      const isValid = await verifyMFACode(selectedFactor, verificationCode);

      if (isValid) {
        toast.success('Verification successful!');
        onVerificationComplete(true);
      } else {
        setAttempts(prev => prev + 1);
        toast.error(`Invalid code. ${maxAttempts - attempts - 1} attempts remaining.`);
        setVerificationCode('');
      }
    } catch (error) {
      SecureLogger.error('MFA verification error', error, user?.id);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  const canVerify = verificationCode.trim().length > 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <MFAVerificationHeader failed={hasExceededAttempts} />
      <CardContent className="space-y-4">
        <MFAVerificationAlerts 
          attempts={attempts}
          maxAttempts={maxAttempts}
          failed={hasExceededAttempts}
        />

        {!hasExceededAttempts && (
          <>
            <MFAFactorSelector
              availableFactors={availableFactors}
              selectedFactor={selectedFactor}
              onFactorChange={setSelectedFactor}
            />

            <MFACodeInput
              selectedFactor={selectedFactor}
              verificationCode={verificationCode}
              onCodeChange={setVerificationCode}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />

            <MFAVerificationActions
              onVerify={handleVerification}
              onCancel={() => onVerificationComplete(false)}
              loading={loading}
              canVerify={canVerify}
            />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Having trouble? Try using a backup code or contact support.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
