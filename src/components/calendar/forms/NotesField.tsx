
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export function NotesField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (Optional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Any additional details..."
              className="min-h-[80px]"
              {...field} 
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
