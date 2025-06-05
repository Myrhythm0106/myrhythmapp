
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MFACodeInputProps {
  selectedFactor: 'totp' | 'sms' | 'backup_codes';
  verificationCode: string;
  onCodeChange: (code: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
}

export function MFACodeInput({
  selectedFactor,
  verificationCode,
  onCodeChange,
  onKeyPress,
  disabled = false
}: MFACodeInputProps) {
  const getPlaceholder = () => {
    switch (selectedFactor) {
      case 'totp':
        return '123456';
      case 'sms':
        return '123456';
      case 'backup_codes':
        return 'ABCD1234';
      default:
        return 'Enter code';
    }
  };

  const getDescription = () => {
    switch (selectedFactor) {
      case 'totp':
        return 'Enter the 6-digit code from your authenticator app';
      case 'sms':
        return 'Enter the 6-digit code sent to your phone';
      case 'backup_codes':
        return 'Enter one of your backup codes';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="verificationCode">Verification Code</Label>
      <Input
        id="verificationCode"
        placeholder={getPlaceholder()}
        value={verificationCode}
        onChange={(e) => onCodeChange(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={disabled}
      />
      <p className="text-sm text-gray-600">{getDescription()}</p>
    </div>
  );
}
