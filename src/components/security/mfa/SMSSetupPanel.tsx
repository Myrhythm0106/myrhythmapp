
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Trash2 } from 'lucide-react';
import { MFAFactor } from '@/types/mfa';

interface SMSSetupPanelProps {
  smsFactor: MFAFactor | undefined;
  loading: boolean;
  onSetupSMS: (phoneNumber: string) => Promise<boolean>;
  onRemoveFactor: (factorId: string) => Promise<boolean>;
}

export function SMSSetupPanel({
  smsFactor,
  loading,
  onSetupSMS,
  onRemoveFactor
}: SMSSetupPanelProps) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSetupSMS = async () => {
    if (!phoneNumber.trim()) {
      return;
    }

    await onSetupSMS(phoneNumber);
  };

  if (smsFactor) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            SMS authentication is active: {smsFactor.phone_number}
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemoveFactor(smsFactor.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <Button onClick={handleSetupSMS} disabled={loading}>
        Setup SMS Authentication
      </Button>
    </div>
  );
}
