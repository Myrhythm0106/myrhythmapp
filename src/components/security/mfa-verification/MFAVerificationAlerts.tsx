
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface MFAVerificationAlertsProps {
  attempts: number;
  maxAttempts: number;
  failed?: boolean;
}

export function MFAVerificationAlerts({ attempts, maxAttempts, failed = false }: MFAVerificationAlertsProps) {
  if (failed) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Maximum verification attempts exceeded. Please try again later or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Additional verification required to complete sign in.
        </AlertDescription>
      </Alert>

      {attempts > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {attempts} failed attempt(s). {maxAttempts - attempts} remaining.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
