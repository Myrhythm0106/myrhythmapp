
import React from 'react';
import { Button } from '@/components/ui/button';

interface ReminderFormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function ReminderFormActions({
  onClose,
  onSubmit,
  isValid
}: ReminderFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose}>
        Maybe Later
      </Button>
      <Button onClick={onSubmit} disabled={!isValid}>
        Set Me Up for Success!
      </Button>
    </div>
  );
}
