
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Smartphone, Key, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface MFAVerificationProps {
  onVerificationComplete: (success: boolean) => void;
  availableFactors: Array<{
    type: 'totp' | 'sms' | 'backup_codes';
    name?: string;
    phone?: string;
  }>;
}

export function MFAVerification({ onVerificationComplete, availableFactors }: MFAVerificationProps) {
  const [selectedFactor, setSelectedFactor] = useState<'totp' | 'sms' | 'backup_codes'>('totp');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const maxAttempts = 3;

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    if (attempts >= maxAttempts) {
      toast.error('Maximum verification attempts exceeded');
      onVerificationComplete(false);
      return;
    }

    setLoading(true);
    try {
      // Simulate verification logic based on factor type
      let isValid = false;

      switch (selectedFactor) {
        case 'totp':
          // In real implementation, verify TOTP code
          isValid = /^\d{6}$/.test(verificationCode);
          break;
        case 'sms':
          // In real implementation, verify SMS code
          isValid = /^\d{6}$/.test(verificationCode);
          break;
        case 'backup_codes':
          // In real implementation, verify backup code
          isValid = /^[A-Z0-9]{8}$/.test(verificationCode.toUpperCase());
          break;
      }

      if (isValid) {
        toast.success('Verification successful!');
        onVerificationComplete(true);
      } else {
        setAttempts(prev => prev + 1);
        toast.error(`Invalid code. ${maxAttempts - attempts - 1} attempts remaining.`);
        setVerificationCode('');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFactorIcon = (type: string) => {
    switch (type) {
      case 'totp':
        return <Smartphone className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'backup_codes':
        return <Key className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getFactorLabel = (type: string) => {
    switch (type) {
      case 'totp':
        return 'Authenticator App';
      case 'sms':
        return 'SMS Code';
      case 'backup_codes':
        return 'Backup Code';
      default:
        return 'Unknown';
    }
  };

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

  if (attempts >= maxAttempts) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Verification Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Maximum verification attempts exceeded. Please try again later or contact support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Additional verification required to complete sign in.
          </AlertDescription>
        </Alert>

        {availableFactors.length > 1 && (
          <div className="space-y-2">
            <Label>Verification Method</Label>
            <div className="flex gap-2">
              {availableFactors.map((factor) => (
                <Button
                  key={factor.type}
                  variant={selectedFactor === factor.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFactor(factor.type)}
                  className="flex items-center gap-2"
                >
                  {getFactorIcon(factor.type)}
                  {getFactorLabel(factor.type)}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            placeholder={getPlaceholder()}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
            disabled={loading}
          />
          <p className="text-sm text-gray-600">{getDescription()}</p>
        </div>

        {attempts > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {attempts} failed attempt(s). {maxAttempts - attempts} remaining.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button 
            onClick={handleVerification} 
            disabled={loading || !verificationCode.trim()}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onVerificationComplete(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Having trouble? Try using a backup code or contact support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
