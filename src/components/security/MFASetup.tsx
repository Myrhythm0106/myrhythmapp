
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Smartphone, 
  Key, 
  QrCode, 
  Copy, 
  Download,
  AlertTriangle,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { useMFA } from '@/hooks/useMFA';
import { toast } from 'sonner';

export function MFASetup() {
  const { 
    factors, 
    mfaEnabled, 
    loading, 
    setupTOTP, 
    verifyTOTP, 
    setupSMS, 
    generateBackupCodes,
    toggleMFA,
    removeFactor 
  } = useMFA();

  const [activeTab, setActiveTab] = useState<'totp' | 'sms' | 'backup'>('totp');
  const [totpSetup, setTotpSetup] = useState<{
    secret: string;
    qrCodeUrl: string;
    manualEntryKey: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [factorName, setFactorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [backupCodes, setBackupCodes] = useState<Array<{ code: string }>>([]);

  const totpFactor = factors.find(f => f.factor_type === 'totp');
  const smsFactor = factors.find(f => f.factor_type === 'sms');
  const backupFactor = factors.find(f => f.factor_type === 'backup_codes');

  const handleSetupTOTP = async () => {
    if (!factorName.trim()) {
      toast.error('Please enter a name for this authenticator');
      return;
    }

    const setup = await setupTOTP(factorName);
    if (setup) {
      setTotpSetup(setup);
    }
  };

  const handleVerifyTOTP = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    const success = await verifyTOTP(verificationCode);
    if (success) {
      setTotpSetup(null);
      setVerificationCode('');
      setFactorName('');
    }
  };

  const handleSetupSMS = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    await setupSMS(phoneNumber);
  };

  const handleGenerateBackupCodes = async () => {
    const codes = await generateBackupCodes();
    if (codes) {
      // Ensure codes is properly typed as array
      const typedCodes = Array.isArray(codes) ? codes : [];
      setBackupCodes(typedCodes);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes
      .map(code => code.code)
      .join('\n');
    
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myrhythm-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Multi-Factor Authentication (MFA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={mfaEnabled ? 'default' : 'secondary'}>
                  {mfaEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                {factors.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {factors.filter(f => f.is_verified).length} active factor(s)
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => toggleMFA(!mfaEnabled)}
              variant={mfaEnabled ? 'destructive' : 'default'}
              disabled={loading}
            >
              {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
            </Button>
          </div>

          {mfaEnabled && (
            <div className="space-y-4">
              <div className="flex gap-2 border-b">
                <Button
                  variant={activeTab === 'totp' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('totp')}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Authenticator App
                </Button>
                <Button
                  variant={activeTab === 'sms' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('sms')}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  SMS
                </Button>
                <Button
                  variant={activeTab === 'backup' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('backup')}
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Backup Codes
                </Button>
              </div>

              {/* TOTP Setup */}
              {activeTab === 'totp' && (
                <div className="space-y-4">
                  {totpFactor ? (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <span>
                          TOTP authentication is active: {totpFactor.factor_name}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFactor(totpFactor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {!totpSetup ? (
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
                      ) : (
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
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SMS Setup */}
              {activeTab === 'sms' && (
                <div className="space-y-4">
                  {smsFactor ? (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <span>
                          SMS authentication is active: {smsFactor.phone_number}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFactor(smsFactor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ) : (
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
                  )}
                </div>
              )}

              {/* Backup Codes */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  {backupFactor ? (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Backup codes are active. Store them securely as they can only be used once each.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Important:</strong> Backup codes are one-time use recovery codes. 
                          Store them securely in case you lose access to your other MFA methods.
                        </AlertDescription>
                      </Alert>
                      <Button onClick={handleGenerateBackupCodes} disabled={loading}>
                        Generate Backup Codes
                      </Button>
                    </div>
                  )}

                  {backupCodes.length > 0 && (
                    <div className="space-y-4">
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Save these codes now!</strong> You won't be able to see them again.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="bg-gray-50 p-4 rounded border">
                        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                          {backupCodes.map((code, index) => (
                            <div key={index} className="text-center p-2 bg-white rounded border">
                              {code.code}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(backupCodes.map(c => c.code).join('\n'))}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy All
                        </Button>
                        <Button
                          variant="outline"
                          onClick={downloadBackupCodes}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
