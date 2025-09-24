
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Mail, CheckCircle } from 'lucide-react';

export const VerificationBanner = () => {
  const { user, emailVerificationStatus, resendVerification } = useAuth();

  if (!user || emailVerificationStatus === 'verified') {
    return null;
  }

  if (emailVerificationStatus === 'pending') {
    return (
      <Alert className="border-amber-200 bg-amber-50 mb-4">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="text-amber-800">
            <strong>Email verification required.</strong> Check your inbox and spam folder to unlock all features.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => user.email && resendVerification(user.email)}
            className="ml-4 text-amber-700 border-amber-300 hover:bg-amber-100"
          >
            <Mail className="h-3 w-3 mr-1" />
            Resend
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
