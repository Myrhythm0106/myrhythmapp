
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  mode: 'add' | 'edit';
}

export function FormActions({ isSubmitting, mode }: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4 border-t">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === 'edit' ? 'Update' : 'Create'} Action
      </Button>
    </div>
  );
}
