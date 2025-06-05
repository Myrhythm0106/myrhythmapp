
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface MFAHeaderProps {
  mfaEnabled: boolean;
  factorCount: number;
  loading: boolean;
  onToggleMFA: (enabled: boolean) => void;
}

export function MFAHeader({ mfaEnabled, factorCount, loading, onToggleMFA }: MFAHeaderProps) {
  return (
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
              {factorCount > 0 && (
                <span className="text-sm text-gray-500">
                  {factorCount} active factor(s)
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={() => onToggleMFA(!mfaEnabled)}
            variant={mfaEnabled ? 'destructive' : 'default'}
            disabled={loading}
          >
            {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
