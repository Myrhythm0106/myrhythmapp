
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface MFAVerificationHeaderProps {
  failed?: boolean;
}

export function MFAVerificationHeader({ failed = false }: MFAVerificationHeaderProps) {
  if (failed) {
    return (
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Verification Failed
        </CardTitle>
      </CardHeader>
    );
  }

  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-600" />
        Two-Factor Authentication
      </CardTitle>
    </CardHeader>
  );
}
