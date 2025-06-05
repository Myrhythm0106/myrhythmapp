
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Copy, CheckCircle, Trash2 } from 'lucide-react';
import { MFAFactor, TOTPSetupData } from '@/types/mfa';
import { toast } from 'sonner';

interface TOTPSetupPanelProps {
  totpFactor: MFAFactor | undefined;
  loading: boolean;
  onSetupTOTP: (factorName: string) => Promise<TOTPSetupData | null>;
  onVerifyTOTP: (code: string) => Promise<boolean>;
  onRemoveFactor: (factorId: string) => Promise<boolean>;
}

export function TOTPSetupPanel({
  totpFactor,
  loading,
  onSetupTOTP,
  onVerifyTOTP,
  onRemoveFactor
}: TOTPSetupPanelProps) {
  const [totpSetup, setTotpSetup] = useState<TOTPSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [factorName, setFactorName] = useState('');

  const handleSetupTOTP = async () => {
    if (!factorName.trim()) {
      toast.error('Please enter a name for this authenticator');
      return;
    }

    const setup = await onSetupTOTP(factorName);
    if (setup) {
      setTotpSetup(setup);
    }
  };

  const handleVerifyTOTP = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    const success = await onVerifyTOTP(verificationCode);
    if (success) {
      setTotpSetup(null);
      setVerificationCode('');
      setFactorName('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (totpFactor) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            TOTP authentication is active: {totpFactor.factor_name}
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemoveFactor(totpFactor.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!totpSetup) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="factorName">Authenticator Name</Label>
          <Input
            id="factorName"
            placeholder="e.g., iPhone, Work Phone"
            value={factorName}
            onChange={(e) => setFactorName(e.target.value)}
          />
        </div>
        <Button onClick={handleSetupTOTP} disabled={loading}>
          Setup Authenticator App
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <QrCode className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-3">
            <p>Scan this QR code with your authenticator app:</p>
            <div className="bg-white p-4 rounded border text-center">
              <div className="text-xs font-mono bg-gray-100 p-2 rounded mb-2">
                QR Code: {totpSetup.qrCodeUrl}
              </div>
              <p className="text-sm text-gray-600">
                Manual entry key: {totpSetup.manualEntryKey}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(totpSetup.secret)}
                className="mt-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Secret
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="verificationCode">Enter verification code</Label>
        <div className="flex gap-2">
          <Input
            id="verificationCode"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
          <Button onClick={handleVerifyTOTP}>
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
