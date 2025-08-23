
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  mode: 'add' | 'edit';
  onSaveAndClose?: () => void;
}

export function FormActions({ isSubmitting, mode, onSaveAndClose }: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save
      </Button>
      
      {onSaveAndClose && (
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={onSaveAndClose}
          className="flex-1 bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save & Close
        </Button>
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        disabled={isSubmitting}
        onClick={() => {
          const form = document.querySelector('form');
          if (form) {
            form.reset();
          }
        }}
        className="sm:w-auto"
      >
        Clear Form
      </Button>
    </div>
  );
}
