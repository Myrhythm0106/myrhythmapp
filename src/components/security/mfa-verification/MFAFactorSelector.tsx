
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Smartphone, Key, Shield } from 'lucide-react';

interface MFAFactor {
  type: 'totp' | 'sms' | 'backup_codes';
  name?: string;
  phone?: string;
}

interface MFAFactorSelectorProps {
  availableFactors: MFAFactor[];
  selectedFactor: 'totp' | 'sms' | 'backup_codes';
  onFactorChange: (factor: 'totp' | 'sms' | 'backup_codes') => void;
}

export function MFAFactorSelector({ 
  availableFactors, 
  selectedFactor, 
  onFactorChange 
}: MFAFactorSelectorProps) {
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

  if (availableFactors.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>Verification Method</Label>
      <div className="flex gap-2">
        {availableFactors.map((factor) => (
          <Button
            key={factor.type}
            variant={selectedFactor === factor.type ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFactorChange(factor.type)}
            className="flex items-center gap-2"
          >
            {getFactorIcon(factor.type)}
            {getFactorLabel(factor.type)}
          </Button>
        ))}
      </div>
    </div>
  );
}
