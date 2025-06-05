
import React from 'react';
import { Button } from '@/components/ui/button';

interface MFAVerificationActionsProps {
  onVerify: () => void;
  onCancel: () => void;
  loading: boolean;
  canVerify: boolean;
}

export function MFAVerificationActions({
  onVerify,
  onCancel,
  loading,
  canVerify
}: MFAVerificationActionsProps) {
  return (
    <div className="space-y-2">
      <Button 
        onClick={onVerify} 
        disabled={loading || !canVerify}
        className="w-full"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
}
